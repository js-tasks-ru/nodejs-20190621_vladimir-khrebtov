const Koa = require('koa');
const app = new Koa();
const broadcast = []

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

router.get('/subscribe', async (ctx, next) => {
  const message = await new Promise((resolve) => {
    broadcast.push(resolve);

    ctx.res.on('close', () => {
      if (ctx.res.finished) return;


    });
  });

  ctx.body = message;

});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;

  if (!message) ctx.throw(400, 'message is required');

  broadcast.forEach((resolve) => resolve(message));

  broadcast.length = 0;
  ctx.body = 'ok';
});

app.use(router.routes());

module.exports = app;
