const cluster = require('node:cluster');
const numCPUs = require('node:os').availableParallelism();
const express = require('express');

if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  const app = express();
  const apiRouter = require('./routes/api');

  app.use(express.json());
  app.use(express.urlencoded({extended: false}));
  app.use('/api', apiRouter);

  const port = 8080;
  app.listen(port, () => {
    console.log(`Worker process ${process.pid} is listening on port ${port}`);
  });
}
