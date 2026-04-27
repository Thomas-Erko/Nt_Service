# AWS Lightsail Deployment Guide - Nighttime Service

## Overview

This deployment is optimized for AWS Lightsail's Node.js blueprints, which come with a pre-configured reverse proxy (Nginx or Apache). The setup automatically:

- Configures your Node.js app to run on port 3000
- Sets up the reverse proxy to route traffic from port 80 → port 3000
- Provides production-ready configuration with security headers
- Enables SSL certificate setup with one command

**Architecture**: Public (Port 80) → Reverse Proxy → Node.js App (Port 3000)

## Quick Start (Automated)

### First Time Setup on AWS Lightsail

1. **Upload your project** to the server:
   ```bash
   # On your local machine
   cd /Users/t0e03vc/Desktop/Faith/Nightime_Service
   tar -czf nighttime-service.tar.gz --exclude=node_modules --exclude=client/build .
   
   # Upload to AWS (replace with your Lightsail IP)
   scp nighttime-service.tar.gz ubuntu@YOUR_IP:~/
   ```

2. **SSH into your Lightsail instance**:
   ```bash
   ssh ubuntu@YOUR_IP
   ```

3. **Extract and setup**:
   ```bash
   mkdir -p nighttime-service
   tar -xzf nighttime-service.tar.gz -C nighttime-service
   cd nighttime-service
   ```

4. **Create your .env file**:
   ```bash
   cp server/.env.example server/.env
   nano server/.env
   ```
   
   Add your actual values:
   ```
   PORT=3000
   GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_CLERGY_ID/exec
   BLOG_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_BLOG_ID/exec
   IMGBB_API_KEY=your_imgbb_key_if_needed
   ```

5. **Make scripts executable**:
   ```bash
   chmod +x first-time-setup.sh deploy.sh
   ```

6. **Run first-time setup**:
   ```bash
   ./first-time-setup.sh
   ```

7. **Copy and run the PM2 startup command** that appears (starts with `sudo env PATH=...`)

**Done!** Your app is now running on http://YOUR_IP (port 80) and will auto-restart on server reboot.

The setup automatically configures a reverse proxy to route traffic from port 80 to your Node.js app running on port 3000.

---

## Deploying Updates (Automated)

Whenever you make changes and want to deploy:

### Option 1: From AWS Server (Recommended)

```bash
ssh ubuntu@YOUR_IP
cd nighttime-service
./deploy.sh
```

That's it! The script automatically:
- Pulls latest code from Git
- Installs any new dependencies
- Builds the React app
- Restarts the server with zero downtime

### Option 2: Upload New Files

If you're not using Git:

```bash
# On your local machine
cd /Users/t0e03vc/Desktop/Faith/Nightime_Service
tar -czf nighttime-service.tar.gz --exclude=node_modules --exclude=client/build .
scp nighttime-service.tar.gz ubuntu@YOUR_IP:~/

# On AWS server
ssh ubuntu@YOUR_IP
cd nighttime-service
tar -xzf ../nighttime-service.tar.gz
./deploy.sh
```

---

## Useful Commands

### Check Application Status
```bash
pm2 status
```

### View Live Logs
```bash
pm2 logs nighttime-service
```

### Restart Application
```bash
pm2 restart nighttime-service
```

### Stop Application
```bash
pm2 stop nighttime-service
```

### View Saved Logs
```bash
cat logs/out.log    # Application output
cat logs/error.log  # Error logs
```

---

## Reverse Proxy Configuration (Automatic)

The setup automatically detects and configures the existing reverse proxy on AWS Lightsail:

### How it Works

1. **Detection**: The setup script detects if Nginx or Apache is already running (common in Lightsail Node.js blueprints)
2. **Configuration**: Creates optimized proxy configuration to route port 80 → port 3000
3. **Security**: Adds security headers and optimizations
4. **Health Checks**: Configures health check endpoints

### Manual Configuration (if needed)

If you need to reconfigure the reverse proxy:

```bash
./configure-reverse-proxy.sh 3000
```

Or with a custom domain:
```bash
./configure-reverse-proxy.sh 3000 yourdomain.com
```

### Configuration Files

- **Nginx**: `/etc/nginx/sites-available/nighttime-service`
- **Apache**: `/etc/apache2/sites-available/nighttime-service.conf`

---

## Setting Up SSL (HTTPS)

1. **Point your domain** to your Lightsail static IP

2. **Install Certbot**:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   ```

3. **Get SSL certificate**:
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

4. **Auto-renewal** is configured automatically by Certbot

---

## Troubleshooting

### App won't start
```bash
pm2 logs nighttime-service  # Check for errors
cd ~/nighttime-service/server
cat .env  # Verify environment variables
```

### Port 3000 already in use
```bash
sudo lsof -i :3000  # Find what's using the port
pm2 delete nighttime-service  # Remove old process
./deploy.sh  # Redeploy
```

### Reverse proxy not working
```bash
sudo systemctl status nginx  # Check Nginx status
sudo systemctl status apache2  # Check Apache status
sudo nginx -t  # Test Nginx config (if using Nginx)
./configure-reverse-proxy.sh 3000  # Reconfigure proxy
```

### Git pull fails
```bash
cd ~/nighttime-service
git status  # Check for conflicts
git stash  # Save local changes
git pull
git stash pop  # Restore local changes
```

### Out of memory
Upgrade your Lightsail instance to at least 1GB RAM ($10/month plan)

---

## File Structure on AWS

```
~/nighttime-service/
├── deploy.sh              # Automated deployment script
├── first-time-setup.sh    # First-time setup script
├── ecosystem.config.js    # PM2 configuration
├── logs/                  # Application logs
│   ├── error.log
│   └── out.log
├── server/
│   ├── .env              # Environment variables (create this!)
│   ├── server.js
│   └── ...
└── client/
    ├── build/            # Production React build
    └── ...
```

---

## Cost Estimate

- **Lightsail Instance**: $5-10/month (512MB-1GB RAM)
- **Static IP**: Free
- **Data Transfer**: 1-2TB included
- **SSL Certificate**: Free (Let's Encrypt)

**Total**: ~$5-10/month

---

## Security Best Practices

1. **Keep system updated**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Use SSH keys** instead of passwords

3. **Configure firewall** in Lightsail console:
   - Allow: HTTP (80), HTTPS (443), SSH (22)
   - Block: Direct access to 3000 (reverse proxy handles this)

4. **Never commit .env files** to Git

5. **Regularly backup** your data and configuration

---

## Support

If you encounter issues:

1. Check logs: `pm2 logs nighttime-service`
2. Check PM2 status: `pm2 status`
3. Check Nginx: `sudo nginx -t`
4. Restart everything: `./deploy.sh`

For more help, refer to:
- PM2 docs: https://pm2.keymetrics.io/docs/
- Nginx docs: https://nginx.org/en/docs/
- AWS Lightsail docs: https://lightsail.aws.amazon.com/ls/docs/
