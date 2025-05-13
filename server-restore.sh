#!/bin/bash
# 恢复服务器到之前的可运行版本

# 设置错误时退出
set -e

echo "===== 开始恢复服务器到之前可运行版本 ====="

# 回到指定的已知可运行的提交
cd /root/Kasta-Project-Management-Platform

# 保存当前的包锁定文件（如果有修改）
if [ -f "package-lock.json" ]; then
  cp package-lock.json package-lock.json.backup
fi

# 取消所有本地更改
git reset --hard
git checkout 05207ac01005bcbc4033205e36d0cdabbcd454f5  # 之前的可运行版本

echo "已恢复代码到之前的可运行版本"

# 检查是否存在旧的构建文件夹备份
if [ -d "/srv/react-app/build.bak" ]; then
  echo "发现之前的构建文件备份，正在恢复..."
  sudo rm -rf /srv/react-app/build
  sudo cp -r /srv/react-app/build.bak /srv/react-app/build
  echo "已从备份恢复构建文件"
else
  echo "没有找到构建文件备份，将尝试重新构建旧版本"
  
  # 安装依赖
  npm install --force
  
  # 创建临时交换空间以支持构建
  if [ ! -f /swapfile2 ]; then
    echo "创建临时交换空间..."
    sudo fallocate -l 2G /swapfile2 || true
    sudo chmod 600 /swapfile2 || true
    sudo mkswap /swapfile2 || true
    sudo swapon /swapfile2 || true
  fi
  
  # 尝试构建
  export NODE_OPTIONS="--max_old_space_size=768"
  echo "正在尝试构建旧版本..."
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
fi

# 重启Nginx服务
echo "重启Nginx服务..."
sudo systemctl restart nginx || true

echo "===== 恢复过程完成 ====="
echo "提示: 如果网站仍然无法访问，请手动上传之前的构建文件到 /srv/react-app/build 目录" 