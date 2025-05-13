#!/bin/bash
# /Kasta-Project-Management-Platform 下做以下操作更新代码

# 下拉最新版本
git pull origin main

# 安装依赖
npm install --production --force

# 生成静态文件
npm run build

# 删除旧的前端构建文件夹 (指向 /srv/react-app/build)
sudo rm -rf /srv/react-app/build

# 将新构建的 'build' 文件夹移动到 /srv/react-app/
sudo mv /root/Kasta-Project-Management-Platform/build /srv/react-app/

# 清除 Nginx 缓存 (如果有缓存路径)
sudo rm -rf /data/nginx/cache/*

# 重启 Nginx 服务，使新的构建文件生效
sudo systemctl restart nginx