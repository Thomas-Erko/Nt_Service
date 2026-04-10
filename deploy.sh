#!/bin/bash

# Nighttime Service - Automated Deployment Script
# This script handles pulling updates, installing dependencies, building, and restarting the app

set -e  # Exit on any error

echo "=========================================="
echo "Nighttime Service - Automated Deployment"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo -e "${YELLOW}Step 1: Pulling latest changes from Git...${NC}"
git pull origin main || git pull origin master || {
    echo -e "${RED}Git pull failed. Make sure you have a git repository set up.${NC}"
    echo "Continuing with local files..."
}
echo ""

echo -e "${YELLOW}Step 2: Installing/updating server dependencies...${NC}"
cd server
npm install --production
cd ..
echo ""

echo -e "${YELLOW}Step 3: Installing/updating client dependencies...${NC}"
cd client
npm install
echo ""

echo -e "${YELLOW}Step 4: Building React production bundle...${NC}"
npm run build
cd ..
echo ""

echo -e "${YELLOW}Step 5: Restarting application with PM2...${NC}"
pm2 restart nighttime-service || pm2 start server/server.js --name nighttime-service
pm2 save
echo ""

echo -e "${GREEN}=========================================="
echo "Deployment completed successfully!"
echo "==========================================${NC}"
echo ""
echo "Application status:"
pm2 status nighttime-service
echo ""
echo "View logs with: pm2 logs nighttime-service"
echo "Stop app with: pm2 stop nighttime-service"
