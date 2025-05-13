#!/bin/bash
set -e  # 一出错就终止脚本

# Step 1: 更新代码
echo "📥 Pulling latest code from main..."
git pull origin main

# Step 2: 安装生产依赖
echo "📦 Installing production dependencies..."
npm install --force

# Step 3: 设置构建时 Node 内存限制
echo "🛠️ Building project with increased memory limit..."
export NODE_OPTIONS="--max_old_space_size=2048"
npm run build

# Step 4: 替换部署目录
echo "🧹 Cleaning old build..."
sudo rm -rf /srv/react-app/build

echo "🚚 Deploying new build..."
sudo mv /root/Kasta-Project-Management-Platform/build /srv/react-app/

# Step 5: 清除 Nginx 缓存并重启
echo "🧼 Clearing Nginx cache..."
sudo rm -rf /data/nginx/cache/*

echo "🔁 Restarting Nginx..."
sudo systemctl restart nginx

echo "✅ Deployment completed successfully!"