import { spawn } from 'node:child_process';

console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════════');
console.log('\x1b[36m%s\x1b[0m', '  🚀 UPRAISER DUAL-DEV SERVER: MAC + WINDOWS SIMULTANEOUS');
console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════════');
console.log('\x1b[32m%s\x1b[0m', '  🍎 Mac Server:     http://localhost:5173/ (Retina, Apple WebGL, Mac Fonts)');
console.log('\x1b[34m%s\x1b[0m', '  🪟 Windows Server: http://localhost:5174/ (ClearType, Lite CSS Chassis)');
console.log('\x1b[36m%s\x1b[0m', '═══════════════════════════════════════════════════════════\n');

const macServer = spawn('npx', ['vite', '--port', '5173', '--strictPort'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, VITE_PORT: '5173' }
});

const winServer = spawn('npx', ['vite', '--port', '5174', '--strictPort'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, VITE_PORT: '5174' }
});

function cleanup() {
  console.log('\nStopping dual dev servers...');
  macServer.kill();
  winServer.kill();
  process.exit();
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
