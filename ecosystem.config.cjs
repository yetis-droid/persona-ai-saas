module.exports = {
  apps: [
    {
      name: 'persona-ai-backend',
      cwd: '/home/user/webapp/persona-ai-saas/backend',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'development',
        PORT: 3001
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    },
    {
      name: 'persona-ai-frontend',
      cwd: '/home/user/webapp/persona-ai-saas/frontend',
      script: 'npm',
      args: 'run dev -- --host',
      env: {
        NODE_ENV: 'development',
        PORT: 5173
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}
