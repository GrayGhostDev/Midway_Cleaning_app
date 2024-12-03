import { spawn } from 'child_process';

process.env.NODE_OPTIONS = '--loader ts-node/esm';

const seed = spawn('node', ['--experimental-specifier-resolution=node', 'prisma/seed.ts'], {
  stdio: 'inherit',
  shell: true
});

seed.on('exit', (code) => {
  process.exit(code);
});
