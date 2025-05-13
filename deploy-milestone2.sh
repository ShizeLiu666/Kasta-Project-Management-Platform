#!/bin/bash
# 在服务器上部署milestone2分支到单独路径

# 设置错误时退出
set -e

echo "===== 开始部署milestone2分支 ====="

# 创建milestone2部署目录（如果不存在）
sudo mkdir -p /srv/react-app-milestone2

# 切换到仓库目录
cd /root/Kasta-Project-Management-Platform

# 保存当前状态
git stash

# 切换到milestone2分支
git fetch origin milestone2
git checkout milestone2
git pull origin milestone2

# 安装依赖
npm install --force

# 增加内存限制
export NODE_OPTIONS="--max_old_space_size=768"

# 尝试为milestone2构建
if [ -f /swapfile2 ]; then
  echo "使用现有交换空间..."
else
  echo "创建额外交换空间..."
  sudo fallocate -l 2G /swapfile2 || true
  sudo chmod 600 /swapfile2 || true
  sudo mkswap /swapfile2 || true
  sudo swapon /swapfile2 || true
fi

# 构建项目
echo "构建milestone2分支..."
npm run build || {
  echo "构建失败，无法部署milestone2"
  exit 1
}

# 部署构建结果
echo "部署构建结果..."
sudo rm -rf /srv/react-app-milestone2/build
sudo mv build /srv/react-app-milestone2/

# 创建Nginx配置文件
echo "配置Nginx..."
sudo tee /etc/nginx/sites-available/milestone2.conf > /dev/null << 'EOF'
server {
    listen 8080;
    server_name localhost;

    root /srv/react-app-milestone2/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
EOF

# 启用配置
sudo ln -sf /etc/nginx/sites-available/milestone2.conf /etc/nginx/sites-enabled/

# 检查Nginx配置是否有效
sudo nginx -t

# 重新载入Nginx
sudo systemctl reload nginx

echo "===== milestone2分支部署完成 ====="
echo "可以通过以下地址访问milestone2版本："
echo "http://服务器IP地址:8080"
echo "注意：主版本仍然在默认端口 (80) 上运行" 