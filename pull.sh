#!/bin/bash
git pull origin main
npm run build
sudo rm -rf /var/www/html/build
sudo cp -r /root/Kasta-Project-Management-Platform/build /var/www/html/
sudo systemctl restart nginx