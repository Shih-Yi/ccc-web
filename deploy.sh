#!/bin/bash
set -e

# 顯示調試信息
echo "== 部署腳本開始執行 =="
echo "當前目錄: $(pwd)"
echo "當前用戶: $(whoami)"

# 創建時間戳目錄
TIMESTAMP=$(date +%Y%m%d%H%M%S)
BUILD_DIR="/home/deploy/ccc-web/releases/build_$TIMESTAMP"
echo "開始零停機部署，使用構建目錄: $BUILD_DIR"

# 備份並修改 tsconfig.json
echo "- 備份並修改 tsconfig.json"
cp tsconfig.json tsconfig.json.bak
sed -i 's#"outDir": "./build"#"outDir": "'$BUILD_DIR'"#g' tsconfig.json

# 安裝依賴
echo "- 安裝依賴"
npm install

# 構建應用
echo "- 構建應用"
NODE_ENV=production NODE_OPTIONS=--max-old-space-size=2048 node ace build

# 在構建目錄中安裝生產依賴 (關鍵步驟)
pwd
echo "- 在構建目錄中安裝生產依賴"
cd $BUILD_DIR
npm ci --only=production
cd ..
pwd

# 恢復原始配置
echo "- 恢復原始配置"
mv tsconfig.json.bak tsconfig.json

# 設定環境變數
echo "- 設定環境變數"
mkdir -p /home/deploy/ccc-web/shared
cd ..
cp .env /home/deploy/ccc-web/shared/.env 2>/dev/null || true
ln -sf /home/deploy/ccc-web/shared/.env /home/deploy/ccc-web/current/build/.env
mkdir -p $BUILD_DIR
cp /home/deploy/ccc-web/shared/.env $BUILD_DIR/.env

# 確保構建目錄有正確的權限
echo "- 設定權限"
chmod -R 755 $BUILD_DIR

# 創建新的符號連結指向最新構建
echo "- 更新符號連結"
ln -sfn $BUILD_DIR /home/deploy/ccc-web/current

# 使用 PM2 重載應用
echo "- 重載 PM2 應用"
cd /home/deploy/ccc-web
pm2 reload ecosystem.config.cjs --env production

# 清理舊的構建目錄，保留最近5個
# echo "- 清理舊版本"
# cd /home/deploy/ccc-web/releases
# ls -td build_* 2>/dev/null | tail -n +6 | xargs -r rm -rf

echo "== 零停機部署完成！=="
