# AWS Lightsail Deployment Guide - Nighttime Service

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
   PORT=5000
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

**Done!** Your app is now running and will auto-restart on server reboot.

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

## Setting Up Nginx (Optional but Recommended)

This allows you to access your site on port 80 (HTTP) instead of port 5000.

1. **Install Nginx**:
   ```bash
   sudo apt install -y nginx
   ```

2. **Create Nginx configuration**:
   ```bash
   sudo nano /etc/nginx/sites-available/nighttime-service
   ```
   
   Paste this:
   ```nginx
   server {
       listen 80;
       server_name YOUR_DOMAIN_OR_IP;

       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
       }
   }
   ```

3. **Enable the site**:
   ```bash
   sudo ln -s /etc/nginx/sites-available/nighttime-service /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

4. **Access your site**: `http://YOUR_IP`

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

### Port 5000 already in use
```bash
sudo lsof -i :5000  # Find what's using the port
pm2 delete nighttime-service  # Remove old process
./deploy.sh  # Redeploy
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
   - Block: Direct access to 5000 (use Nginx proxy)

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
