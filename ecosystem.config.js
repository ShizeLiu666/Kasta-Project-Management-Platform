module.exports = {
    apps: [{
      name: "kasta-frontend",
      script: "http-server",
      env: {
        PM2_SERVE_PATH: "./build",
        PM2_SERVE_PORT: 3000,
        PM2_SERVE_SPA: "true",
        PM2_SERVE_HOMEPAGE: "/index.html"
      },
      instances: "max",
      exec_mode: "cluster",
      out_file: "/root/.pm2/logs/kasta-frontend-out.log",
      error_file: "/root/.pm2/logs/kasta-frontend-error.log",
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss"
    }]
  }