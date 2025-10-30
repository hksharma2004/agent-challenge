import { spawn, type ChildProcess } from 'child_process';

function startServer(command: string, args: string[], name: string): ChildProcess {
  console.log(`Starting ${name}...`);
  
  const serverProcess = spawn(command, args, {
    stdio: 'inherit',
    shell: true,
    cwd: process.cwd() 
  });

  serverProcess.on('error', (error: Error) => {
    console.error(`${name} failed to start:`, error);
  });

  serverProcess.on('exit', (code: number | null) => {
    if (code !== 0) {
      console.error(`${name} exited with code ${code}`);
    }
  });

  return serverProcess;
}

console.log('Starting development servers...');


const nextServer = startServer('npx', ['next', 'dev'], 'Frontend');


const mastraServer = startServer('npx', ['mastra', 'dev'], 'Mastra Server');


process.on('SIGINT', () => {
  console.log('\nShutting down servers...');
  nextServer.kill();
  mastraServer.kill();
  process.exit(0);
});

console.log('\nServers started! Access them at:');
console.log('- Frontend: http://localhost:3000');
console.log('- Mastra Server: http://localhost:4000');
