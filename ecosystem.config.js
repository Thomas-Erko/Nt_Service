// PM2 Ecosystem Configuration
// This file configures how PM2 manages your application

module.exports = {
  apps: [{
    name: 'nighttime-service',
    script: './server/server.js',
    
    // Environment variables
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    
    // Process management
    instances: 1,
    exec_mode: 'fork',
    
    // Auto-restart configuration
    autorestart: true,
    watch: false,  // Set to true if you want PM2 to restart on file changes
    max_memory_restart: '500M',
    
    // Logging
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Advanced features
    min_uptime: '10s',
    max_restarts: 10,
    
    // Graceful shutdown
    kill_timeout: 5000
  }]
};
