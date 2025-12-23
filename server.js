const { exec } = require('child_process');
const path = require('path');

// Simple wrapper to run next start
const port = process.env.PORT || 3000;
const cmd = `npx next start -p ${port}`;

console.log('Starting Next.js server...');
console.log('Command:', cmd);
console.log('Working directory:', __dirname);

const server = exec(cmd, { cwd: __dirname });

server.stdout.on('data', (data) => {
  console.log(data.toString());
});

server.stderr.on('data', (data) => {
  console.error(data.toString());
});

server.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code);
});
