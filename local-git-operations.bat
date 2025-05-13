@echo off
echo ===== 开始执行 Git 操作 =====

echo 1. 确保所有分支都是最新的...
git fetch --all

echo 2. 确保在main分支上...
git checkout main

echo 3. 保存当前的main分支状态...
git add -A
git commit -m "Save current state before rollback" || echo 没有需要提交的更改

echo 4. 将当前main分支内容推送到milestone2分支...
git checkout milestone2 || git checkout -b milestone2
git merge main -m "Merge main updates into milestone2" || (
    echo 合并失败，尝试强制更新...
    git reset --hard main
)

echo 5. 推送milestone2分支到远程...
git push origin milestone2

echo 6. 切换回main分支并回滚到之前可运行的版本...
git checkout main
git reset --hard 05207ac01005bcbc4033205e36d0cdabbcd454f5

echo 7. 强制推送回滚后的main分支到远程...
git push -f origin main

echo ===== Git操作完成 =====
echo main分支已回滚到之前可运行的版本 (05207ac)
echo 最新更改已保存在milestone2分支
echo.
echo 下次开发时，请从milestone2分支开始:
echo   git checkout milestone2
echo.
pause 