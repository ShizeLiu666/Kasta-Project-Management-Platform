@echo off
echo === 开始本地构建和部署过程 ===

:: 构建项目
echo 正在构建项目...
call npm run build

:: 检查构建是否成功
if not exist "build" (
  echo 错误: 构建失败，没有生成 build 文件夹
  exit /b 1
)

echo 构建成功! 正在准备部署...

:: 压缩build文件夹为zip
echo 正在压缩build文件夹...
powershell Compress-Archive -Path build -DestinationPath build.zip -Force

echo 压缩完成，准备上传到服务器...

:: 设置服务器信息 (请替换为你的服务器信息)
set SERVER_IP=你的服务器IP地址
set SERVER_USER=root
set SERVER_PASSWORD=你的服务器密码
set REMOTE_PATH=/root/

:: 上传到服务器
echo 正在上传build.zip到服务器...
echo 请使用你习惯的方式(如SCP或SFTP客户端)将build.zip上传到服务器的/root/目录
echo 上传完成后，在服务器上运行以下命令:
echo.
echo cd /root/
echo unzip -o build.zip
echo sudo rm -rf /srv/react-app/build
echo sudo mv build /srv/react-app/
echo sudo systemctl restart nginx
echo.

echo 脚本执行完毕，请手动完成上传和服务器部署步骤。
pause 