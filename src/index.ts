import 'dotenv/config';
import cluster from 'node:cluster';
import { cpus } from 'os';
import app from './app';

if (cluster.isPrimary && process.env.START_MODE === 'multi') {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < cpus().length; i += 1) {
    cluster.fork();
  }

  cluster.on('fork', (worker) => {
    console.log(`worker ${worker.process.pid} is running`);
  });
} else {
  const defaultPort = '4000';

  app.start(process.env.PORT || defaultPort);
}
