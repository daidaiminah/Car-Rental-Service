import { spawn } from 'node:child_process';

const NODE_OPTIONS_FLAG = 'NODE_OPTIONS=--experimental-specifier-resolution=node';
const MIGRATION_ARGS = ['npx', 'sequelize-cli', 'db:migrate'];

function sh(cmd, args = []) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', shell: true });
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${cmd} ${args.join(' ')} exited with code ${code}`));
      }
    });
  });
}

async function main() {
  try {
    console.log('Running database migrations...');
    await sh('cross-env', [NODE_OPTIONS_FLAG, ...MIGRATION_ARGS]);

    console.log('Database setup complete.');
  } catch (error) {
    console.error('Database setup failed:', error?.message ?? error);
    process.exit(1);
  }
}

main();
