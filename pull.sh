#!/bin/bash
# /Kasta-Project-Management-Platform 下做以下操作更新代码
# 下拉最新版本
git pull origin main

# 生成静态文件
npm run build

# 删除旧的前端构建文件夹
sudo rm -rf /var/www/html/build

# 将新构建的 'build' 文件夹复制到服务器的 Web 根目录 (/var/www/html/)
sudo cp -r /root/Kasta-Project-Management-Platform/build /var/www/html/

# 清除 Nginx 缓存
sudo rm -rf /data/nginx/cache/*

# 重启 Nginx 服务，使新的构建文件生效
sudo systemctl restart nginx