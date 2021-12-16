import app from './app';

const throng = require('throng');

const WORKERS = process.env.WEB_CONCURRENCY || 1;

function start() {
  app.listen(app.get('port'), () => {
    console.log(
      '  App is running at http://localhost:%d in %s mode',
      app.get('port'),
      app.get('env'),
    );
  });
}

throng({
  workers: WORKERS,
  lifetime: Infinity,
  start,
});

export default start;
