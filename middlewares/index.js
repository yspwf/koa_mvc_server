exports.auth = async (ctx, next) => {
    console.log(ctx.request.body);
    await next();
}


exports.json = async (ctx, next) => {
    console.log('json');
    await next();
}


