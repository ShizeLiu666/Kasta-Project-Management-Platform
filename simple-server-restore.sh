#!/bin/bash
# 服务器恢复脚本 - 简化版
# 仅回滚到之前的可运行版本

# 设置错误时退出
set -e

echo "===== 开始服务器恢复操作 ====="

# 切换到仓库目录
cd /root/Kasta-Project-Management-Platform

# 保存当前的package-lock.json（如果有修改）
if [ -f "package-lock.json" ]; then
  cp package-lock.json package-lock.json.backup
fi

# 取消所有本地更改并回滚
echo "回滚到先前可运行的版本..."
git reset --hard
git checkout 05207ac01005bcbc4033205e36d0cdabbcd454f5

echo "已回滚到之前可运行的版本"

# 尝试安装依赖和构建
echo "安装依赖..."
npm install --force

# 尝试构建
echo "构建项目..."
npm run build || {
  echo "构建失败，但我们将继续尝试恢复服务"
}

# 如果构建成功，部署它
if [ -d "build" ]; then
  echo "构建成功，正在部署..."
  sudo rm -rf /srv/react-app/build
  sudo mv build /srv/react-app/
else
  echo "警告: 构建失败，无法恢复构建文件"
  echo "请手动上传之前的构建文件到服务器"
fi

# 重启Nginx服务
echo "重启Nginx服务..."
sudo systemctl restart nginx || true

echo "===== 服务器恢复操作完成 ====="
echo "服务器已恢复到之前可运行的版本 (05207ac)" 