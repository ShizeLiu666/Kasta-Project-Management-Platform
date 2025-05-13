#!/bin/bash
# /Kasta-Project-Management-Platform 下做以下操作更新代码

# 下拉最新版本
git pull origin main

# 清理系统缓存，释放内存
sudo sync && sudo echo 3 | sudo tee /proc/sys/vm/drop_caches

# 安装依赖（仅生产依赖，节省内存）
npm install --production --force

# 增加 Node.js 内存限制，避免内存不足错误
export NODE_OPTIONS="--max_old_space_size=768 --gc-interval=100"
export NODE_ENV=production

# 生成静态文件（使用--max_old_space_size参数直接传给Node，确保生效）
node --max_old_space_size=768 ./node_modules/.bin/react-scripts build

# 删除旧的前端构建文件夹 (指向 /srv/react-app/build)
sudo rm -rf /srv/react-app/build

# 将新构建的 'build' 文件夹移动到 /srv/react-app/
sudo mv /root/Kasta-Project-Management-Platform/build /srv/react-app/

# 清除 Nginx 缓存 (如果有缓存路径)
sudo rm -rf /data/nginx/cache/*

# 重启 Nginx 服务，使新的构建文件生效
sudo systemctl restart nginx