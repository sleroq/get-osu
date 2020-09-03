module.exports = {
  apps: [
    {
      script: "index.js",
      watch: ".",
    },
    {
      script: "./service-worker/",
      restart_delay: 120000,
      exp_backoff_restart_delay: 150,
      watch: ["./service-worker"],
    },
  ],

  deploy: {
    production: {
      user: "SSH_USERNAME",
      host: "SSH_HOSTMACHINE",
      ref: "origin/master",
      repo: "GIT_REPOSITORY",
      path: "DESTINATION_PATH",
      "pre-deploy-local": "",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production",
      "pre-setup": "",
    },
  },
};
