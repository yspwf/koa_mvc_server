const { BaseServer } = require('../Yoa');
module.exports = class UserServer extends BaseServer {

    async index() {
        //const res = await this.ctx.app.Model.test.find();
        const res = await this.ctx.app.Model.UserModel.findAll();
        return res;
    }

}