#!/bin/bash
# 将当前更改保存到milestone2分支，然后回滚main分支

# 设置错误时退出
set -e

echo "===== 开始回滚操作 ====="

# 切换到仓库目录
cd /root/Kasta-Project-Management-Platform

# 1. 保存当前的包锁定文件（如果有修改）
if [ -f "package-lock.json" ]; then
  cp package-lock.json package-lock.json.backup
fi

# 2. 获取最新的milestone2分支
echo "更新milestone2分支..."
git fetch origin milestone2

# 3. 将当前的main分支状态保存到新的提交
echo "保存当前main分支的状态..."
git add -A
git commit -m "Save current state before rollback" || echo "没有需要提交的更改"

# 4. 切换到milestone2分支并合并当前状态
echo "切换到milestone2分支并更新..."
git checkout milestone2
git merge main -m "Merge current main state into milestone2" || {
  echo "合并可能有冲突，正在中止合并..."
  git merge --abort
  echo "将采用强制更新milestone2的方式..."
  git reset --hard main
}

# 5. 推送更新后的milestone2分支到远程
echo "推送milestone2分支到远程..."
git push origin milestone2 || echo "推送milestone2失败，但继续执行回滚操作"

# 6. 切换回main分支并回滚到之前的可运行版本
echo "切换回main分支并回滚..."
git checkout main
git reset --hard 05207ac01005bcbc4033205e36d0cdabbcd454f5  # 回滚到之前的可运行版本

# 7. 强制推送回滚后的main分支
echo "强制推送回滚后的main分支..."
git push -f origin main || echo "推送main分支失败，但继续执行恢复操作"

echo "Git操作完成，现在尝试恢复网站..."

# 8. 尝试恢复网站
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

echo "===== 回滚和恢复过程完成 ====="
echo "main分支已回滚到之前可运行的版本，最新更改已保存到milestone2分支"
echo "提示: 如果网站仍然无法访问，请尝试手动上传之前的构建文件" 