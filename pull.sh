#!/bin/bash
# /Kasta-Project-Management-Platform 下做以下操作更新代码

# 设置错误时退出
set -e

# 下拉最新版本
git pull origin main

# 清理系统缓存，释放内存
sudo sync && sudo echo 3 | sudo tee /proc/sys/vm/drop_caches

# 确保有足够的交换空间
if [ ! -f /swapfile2 ]; then
  echo "创建额外的交换空间..."
  sudo fallocate -l 2G /swapfile2
  sudo chmod 600 /swapfile2
  sudo mkswap /swapfile2
  sudo swapon /swapfile2
  echo "交换空间创建完成"
fi

# 安装依赖（完整依赖，因为生产模式可能缺少构建所需依赖）
npm install --force

# 增加 Node.js 内存限制，避免内存不足错误
export NODE_OPTIONS="--max_old_space_size=768"
export NODE_ENV=production

echo "开始构建项目..."
# 生成静态文件
node --max_old_space_size=768 ./node_modules/.bin/react-scripts build

# 检查构建是否成功
if [ ! -d "build" ]; then
  echo "错误: 构建失败，没有生成 build 文件夹"
  exit 1
fi

echo "构建成功，准备部署..."

# 删除旧的前端构建文件夹 (指向 /srv/react-app/build)
sudo rm -rf /srv/react-app/build

# 将新构建的 'build' 文件夹移动到 /srv/react-app/
sudo mv build /srv/react-app/

# 清除 Nginx 缓存 (如果有缓存路径)
if [ -d "/data/nginx/cache" ]; then
  sudo rm -rf /data/nginx/cache/*
fi

# 重启 Nginx 服务，使新的构建文件生效
sudo systemctl restart nginx

echo "部署完成！"