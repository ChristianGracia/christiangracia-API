// import dotenv from 'dotenv';
// const express = require('express');
// const app = express();

// dotenv.config();
// const port = process.env.port;

// app.get('/', (req, res) => {
//   res.send('Welcome to my API back-end');
// });

// app.listen(port, () => {
//   console.log(`server started at http://localhost:${port}`);
// });

import app from './app';

const server = app.listen(app.get('port'), () => {
  console.log(
    '  App is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env'),
  );
  console.log('  Press CTRL-C to stop\n');
});

export default server;
