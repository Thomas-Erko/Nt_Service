#!/bin/bash

# Nighttime Service - Automatic Reverse Proxy Configuration
# Detects and configures existing reverse proxy (Nginx/Apache) on AWS Lightsail

set -e  # Exit on any error

echo "=========================================="
echo "Configuring Reverse Proxy for Port 80"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

APP_PORT=${1:-3000}  # Default to port 3000, but allow override
SERVER_NAME=${2:-"_"}  # Default to catch-all, but allow specific domain

echo -e "${BLUE}Detecting existing web server...${NC}"

# Function to check if a service is running
is_service_running() {
    systemctl is-active --quiet "$1" 2>/dev/null
}

# Function to check if a port is in use
is_port_in_use() {
    sudo netstat -tlnp | grep ":$1 " >/dev/null 2>&1
}

# Detect which web server is running
if is_service_running nginx || command -v nginx >/dev/null 2>&1; then
    WEB_SERVER="nginx"
    CONFIG_PATH="/etc/nginx/sites-available/nighttime-service"
    ENABLED_PATH="/etc/nginx/sites-enabled/nighttime-service"
elif is_service_running apache2 || is_service_running httpd || command -v apache2 >/dev/null 2>&1; then
    WEB_SERVER="apache"
    CONFIG_PATH="/etc/apache2/sites-available/nighttime-service.conf"
    ENABLED_PATH="/etc/apache2/sites-enabled/nighttime-service.conf"
else
    echo -e "${YELLOW}No existing web server detected. Installing Nginx...${NC}"
    sudo apt update
    sudo apt install -y nginx
    WEB_SERVER="nginx"
    CONFIG_PATH="/etc/nginx/sites-available/nighttime-service"
    ENABLED_PATH="/etc/nginx/sites-enabled/nighttime-service"
fi

echo -e "${GREEN}Detected web server: $WEB_SERVER${NC}"

# Check if port 80 is already in use
if is_port_in_use 80; then
    echo -e "${GREEN}Port 80 is already in use (likely by $WEB_SERVER)${NC}"
else
    echo -e "${YELLOW}Port 80 is not in use. Starting $WEB_SERVER...${NC}"
    sudo systemctl start $WEB_SERVER
    sudo systemctl enable $WEB_SERVER
fi

# Remove default site if it exists
if [ "$WEB_SERVER" = "nginx" ]; then
    sudo rm -f /etc/nginx/sites-enabled/default
    
    echo -e "${YELLOW}Creating Nginx configuration for Node.js app...${NC}"
    sudo tee "$CONFIG_PATH" > /dev/null <<EOF
server {
    listen 80;
    server_name $SERVER_NAME;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Main proxy to Node.js app
    location / {
        proxy_pass http://localhost:$APP_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 30s;
        proxy_send_timeout 30s;
        proxy_read_timeout 30s;
    }

    # Optional: Handle static files directly (if you have them)
    location /static/ {
        alias /home/ubuntu/nighttime-service/client/build/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Health check endpoint
    location /health {
        proxy_pass http://localhost:$APP_PORT/health;
        access_log off;
    }
}
EOF

    # Enable the site
    sudo ln -sf "$CONFIG_PATH" "$ENABLED_PATH"
    
    # Test configuration
    if sudo nginx -t; then
        echo -e "${GREEN}Nginx configuration is valid${NC}"
        sudo systemctl reload nginx
    else
        echo -e "${RED}Nginx configuration error!${NC}"
        exit 1
    fi

elif [ "$WEB_SERVER" = "apache" ]; then
    # Enable required Apache modules
    sudo a2enmod proxy
    sudo a2enmod proxy_http
    sudo a2enmod headers
    sudo a2enmod rewrite
    
    echo -e "${YELLOW}Creating Apache configuration for Node.js app...${NC}"
    sudo tee "$CONFIG_PATH" > /dev/null <<EOF
<VirtualHost *:80>
    ServerName $SERVER_NAME
    
    # Security headers
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set X-Content-Type-Options "nosniff"
    
    # Proxy to Node.js app
    ProxyPreserveHost On
    ProxyRequests Off
    ProxyPass / http://localhost:$APP_PORT/
    ProxyPassReverse / http://localhost:$APP_PORT/
    
    # Set headers for WebSocket support
    RewriteEngine on
    RewriteCond %{HTTP:Upgrade} websocket [NC]
    RewriteCond %{HTTP:Connection} upgrade [NC]
    RewriteRule ^/?(.*) "ws://localhost:$APP_PORT/\$1" [P,L]
    
    ErrorLog \${APACHE_LOG_DIR}/nighttime-service_error.log
    CustomLog \${APACHE_LOG_DIR}/nighttime-service_access.log combined
</VirtualHost>
EOF

    # Enable the site
    sudo a2ensite nighttime-service
    sudo a2dissite 000-default
    
    # Test configuration
    if sudo apache2ctl configtest; then
        echo -e "${GREEN}Apache configuration is valid${NC}"
        sudo systemctl reload apache2
    else
        echo -e "${RED}Apache configuration error!${NC}"
        exit 1
    fi
fi

# Verify the setup
echo ""
echo -e "${YELLOW}Verifying reverse proxy setup...${NC}"

if is_port_in_use 80; then
    echo -e "${GREEN}✓ Port 80 is active${NC}"
else
    echo -e "${RED}✗ Port 80 is not responding${NC}"
fi

if is_service_running $WEB_SERVER; then
    echo -e "${GREEN}✓ $WEB_SERVER is running${NC}"
else
    echo -e "${RED}✗ $WEB_SERVER is not running${NC}"
fi

echo ""
echo -e "${GREEN}=========================================="
echo "Reverse Proxy Configuration Complete!"
echo "==========================================${NC}"
echo ""
echo -e "${BLUE}Summary:${NC}"
echo "  • Web Server: $WEB_SERVER"
echo "  • Proxy Target: http://localhost:$APP_PORT"
echo "  • Configuration: $CONFIG_PATH"
echo "  • Server Name: $SERVER_NAME"
echo ""
echo -e "${YELLOW}Important:${NC}"
echo "  • Your Node.js app should run on port $APP_PORT"
echo "  • Access your site via: http://YOUR_IP"
echo "  • For custom domains, update server_name in config"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "  1. Make sure your Node.js app is running on port $APP_PORT"
echo "  2. Test: curl http://localhost"
echo "  3. Setup SSL with: sudo certbot --$WEB_SERVER -d yourdomain.com"
