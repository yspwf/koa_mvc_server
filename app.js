const { App } = require('./mvc');
const appObj = new App();

const KoaRouter = require('koa-router');
const router = new KoaRouter();

const routerConfig = require('./router');
const routers = routerConfig();

routers.forEach((item) => {
    const { action } = item;
    const args = [item.path];
    args.push(async (context, next) => {
        const arr = action.split('.');
        if (arr && arr.length) {
            const obj = new appObj.Controller[arr[0]](context, next);
            if (obj && obj[arr[1]]) {
                await obj[arr[1]](context, next);
            }
        } else {
            await next();
        }
    });
    router[item.method].apply(router, args);
});



appObj.use(router.routes()).use(router.allowedMethods());


appObj.listen(9006, () => {
    console.log('server is starting ... 9006');
});