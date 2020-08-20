const { BaseController } = require('../Yoa');
module.exports = class HomeController extends BaseController {



    async index(ctx, next) {
        //console.log(ctx.services.UserServer.index());
        ctx.body = await ctx.services.UserServer.index();
    }

    async test(ctx, next) {
        ctx.body = "post test";
    }



}

