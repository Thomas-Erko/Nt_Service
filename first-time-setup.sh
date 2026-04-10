#!/bin/bash

# Nighttime Service - First Time Setup Script for AWS Lightsail
# Run this script ONCE when you first deploy to AWS

set -e  # Exit on any error

echo "=========================================="
echo "Nighttime Service - First Time Setup"
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

echo -e "${YELLOW}Step 1: Installing server dependencies...${NC}"
cd server
npm install --production
cd ..
echo ""

echo -e "${YELLOW}Step 2: Installing client dependencies...${NC}"
cd client
npm install
echo ""

echo -e "${YELLOW}Step 3: Building React production bundle...${NC}"
npm run build
cd ..
echo ""

echo -e "${YELLOW}Step 4: Creating logs directory...${NC}"
mkdir -p logs
echo ""

echo -e "${YELLOW}Step 5: Checking for .env file...${NC}"
if [ ! -f "server/.env" ]; then
    echo -e "${RED}WARNING: server/.env file not found!${NC}"
    echo "Please create server/.env with your environment variables:"
    echo "  PORT=5000"
    echo "  GOOGLE_APPS_SCRIPT_URL=your_clergy_url"
    echo "  BLOG_APPS_SCRIPT_URL=your_blog_url"
    echo "  IMGBB_API_KEY=your_key"
    echo ""
    echo "You can copy from .env.example:"
    echo "  cp server/.env.example server/.env"
    echo "  nano server/.env"
    echo ""
    read -p "Press Enter to continue anyway, or Ctrl+C to exit and create .env first..."
else
    echo -e "${GREEN}.env file found!${NC}"
fi
echo ""

echo -e "${YELLOW}Step 6: Starting application with PM2...${NC}"
pm2 start ecosystem.config.js
pm2 save
echo ""

echo -e "${YELLOW}Step 7: Setting up PM2 to start on system boot...${NC}"
pm2 startup
echo ""
echo -e "${YELLOW}Copy and run the command above (starts with 'sudo env PATH=...')${NC}"
echo ""

echo -e "${GREEN}=========================================="
echo "First-time setup completed!"
echo "==========================================${NC}"
echo ""
echo "Your application is now running!"
echo ""
echo "Useful commands:"
echo "  pm2 status              - Check app status"
echo "  pm2 logs nighttime-service - View logs"
echo "  pm2 restart nighttime-service - Restart app"
echo "  ./deploy.sh             - Deploy updates"
echo ""
echo "Next steps:"
echo "1. If you haven't already, run the PM2 startup command shown above"
echo "2. Configure Nginx as reverse proxy (see deployment guide)"
echo "3. Setup your domain and SSL certificate"
echo ""
echo "To deploy updates in the future, just run:"
echo "  ./deploy.sh"
