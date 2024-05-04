const express = require('express');
const logger = require('morgan');

const apiRouter = require('./routes/api');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', apiRouter);
const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


module.exports = app;
