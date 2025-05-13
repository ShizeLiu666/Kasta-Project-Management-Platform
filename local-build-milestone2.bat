@echo off
echo Switching to milestone2 branch...
git checkout milestone2

echo Installing dependencies...
npm install

echo Building project...
set NODE_OPTIONS=--max_old_space_size=4096
npm run build

echo Creating build directory if it doesn't exist...
if not exist "build" mkdir build

echo Packaging build...
powershell Compress-Archive -Path build\* -DestinationPath milestone2-build.zip -Force

echo Build complete! 
echo Please upload milestone2-build.zip to server /root/ directory using SFTP
echo Then run deploy-milestone2-uploaded.sh on the server to deploy 