#!/bin/bash
# 部署本地上传的构建文件

# 设置错误时退出
set -e

echo "开始从本地构建文件部署..."

# 检查build.zip是否存在
if [ ! -f "build.zip" ]; then
  echo "错误: build.zip文件不存在，请先上传"
  exit 1
fi

# 解压文件
echo "正在解压build.zip..."
unzip -o build.zip

# 检查解压是否成功
if [ ! -d "build" ]; then
  echo "错误: 解压失败，没有生成build文件夹"
  exit 1
fi

echo "解压成功，准备部署..."

# 删除旧的前端构建文件夹
echo "删除旧的构建文件..."
sudo rm -rf /srv/react-app/build

# 将新构建的build文件夹移动到/srv/react-app/
echo "部署新的构建文件..."
sudo mv build /srv/react-app/

# 清除Nginx缓存(如果有缓存路径)
if [ -d "/data/nginx/cache" ]; then
  echo "清除Nginx缓存..."
  sudo rm -rf /data/nginx/cache/*
fi

# 重启Nginx服务
echo "重启Nginx服务..."
sudo systemctl restart nginx

echo "部署完成！新版本已经上线" 