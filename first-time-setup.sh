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

echo -e "${YELLOW}Step 5: Configuring environment for reverse proxy...${NC}"
if [ ! -f "server/.env" ]; then
    echo -e "${YELLOW}Creating .env file with reverse proxy configuration...${NC}"
    cp server/.env.example server/.env
    # Update PORT to 3000 for reverse proxy setup
    sed -i 's/PORT=5000/PORT=3000/g' server/.env
    echo -e "${GREEN}.env file created and configured for port 3000${NC}"
    echo ""
    echo -e "${YELLOW}Please edit server/.env to add your API URLs:${NC}"
    echo "  nano server/.env"
    echo ""
    read -p "Press Enter to continue, or Ctrl+C to edit .env first..."
else
    echo -e "${GREEN}.env file found!${NC}"
    # Ensure PORT is set to 3000 for reverse proxy
    if grep -q "PORT=5000" server/.env; then
        sed -i 's/PORT=5000/PORT=3000/g' server/.env
        echo -e "${YELLOW}Updated PORT to 3000 for reverse proxy setup${NC}"
    fi
fi
echo ""

echo -e "${YELLOW}Step 6: Configuring reverse proxy (Nginx/Apache)...${NC}"
chmod +x configure-reverse-proxy.sh
./configure-reverse-proxy.sh 3000
echo ""

echo -e "${YELLOW}Step 7: Starting application with PM2...${NC}"
pm2 start ecosystem.config.js
pm2 save
echo ""

echo -e "${YELLOW}Step 8: Setting up PM2 to start on system boot...${NC}"
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
echo "2. Test your site: http://YOUR_LIGHTSAIL_IP"
echo "3. Setup your domain and SSL certificate with: sudo certbot --nginx -d yourdomain.com"
echo ""
echo "App Details:"
echo "  • Node.js app running on: http://localhost:3000"
echo "  • Public access via: http://YOUR_IP (port 80)"
echo "  • Reverse proxy automatically configured"
echo ""
echo "To deploy updates in the future, just run:"
echo "  ./deploy.sh"
