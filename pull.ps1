#!/bin/bash
git pull origin main
npm run build
pm2 restart kasta-frontend