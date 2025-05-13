#!/bin/bash

# 确保脚本以root用户运行
if [ "$(id -u)" != "0" ]; then
   echo "This script must be run as root" 1>&2
   exit 1
fi

echo "===== 开始部署milestone2版本 ====="

# 检查上传的ZIP文件
if [ ! -f "/root/milestone2-build.zip" ]; then
    echo "错误: 找不到上传的milestone2-build.zip文件"
    echo "请先将本地构建的milestone2-build.zip上传到服务器的/root/目录"
    exit 1
fi

# 创建milestone2目录
DEPLOY_DIR="/var/www/html/milestone2"
echo "创建部署目录: $DEPLOY_DIR"
mkdir -p $DEPLOY_DIR

# 清空旧的部署文件
echo "清空旧的部署文件..."
rm -rf $DEPLOY_DIR/*

# 解压构建文件
echo "解压milestone2-build.zip到$DEPLOY_DIR..."
unzip -o /root/milestone2-build.zip -d $DEPLOY_DIR

# 设置正确的权限
echo "设置文件权限..."
chown -R www-data:www-data $DEPLOY_DIR
chmod -R 755 $DEPLOY_DIR

# 配置Nginx为milestone2提供服务
NGINX_CONF="/etc/nginx/sites-available/milestone2"
echo "配置Nginx为milestone2版本提供服务..."

cat > $NGINX_CONF << 'EOL'
server {
    listen 8080;
    server_name _;

    root /var/www/html/milestone2;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
        expires max;
        log_not_found off;
    }
}
EOL

# 启用新的站点配置
echo "启用Nginx配置..."
ln -sf $NGINX_CONF /etc/nginx/sites-enabled/

# 测试Nginx配置
echo "测试Nginx配置..."
nginx -t

if [ $? -eq 0 ]; then
    # 重启Nginx
    echo "重新加载Nginx配置..."
    systemctl reload nginx
    echo "===== milestone2版本已成功部署 ====="
    echo "可通过 http://服务器IP:8080 访问milestone2版本"
else
    echo "错误: Nginx配置测试失败，请检查配置"
    exit 1
fi 