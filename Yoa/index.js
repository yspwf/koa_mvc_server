const Application = require('koa');
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

const Sequelize = require('sequelize');

class Controllerloader {

    constructor(option) {
        const ROOT = process.cwd();
        const fileDir = ROOT + "/Controller/";
        const files = fs.readdirSync(fileDir);
        files.forEach(function (item, index) {
            const filename = item.split('.');
            const file = fileDir + item;
            const ControllerObj = require(file);
            option.Controller[filename[0]] = ControllerObj;
        });
    }

}


class ServiceLoader {

    constructor(servicePath) {
        this.services = {};
        this.controllers = {};
        const ROOR_PATH = process.cwd();
        const files = fs.readdirSync(servicePath);
        files.forEach((file) => {
            const path = ROOR_PATH + "/server/" + file;
            const [fileName, extname] = file.split('.');
            this.controllers[fileName] = path;
            const _this = this;
            Object.defineProperty(this.services, fileName, {
                get() {
                    const Server = require(_this.controllers[fileName]);
                    // 每次new一个新的Service实例
                    // 传入context
                    return new Server(_this.context);
                }
            })
        });
    }

    getServices(context) {
        // 更新context
        this.context = context;
        return this.services;
    }
}



class Modelloader {

    constructor(option) {
        const { config } = option;
        const ROOT = process.cwd();
        const fileDir = ROOT + "/Model/";
        const files = fs.readdirSync(fileDir);
        files.forEach(function (item, index) {
            const [filename, extname] = item.split('.');
            const file = fileDir + item;
            const ModelObj = require(file);

            const sequelize = new Sequelize(config.mysql);
            sequelize.authenticate().then(function () {
                console.log("数据库连接成功");
            }).catch(function (err) {
                //数据库连接失败时打印输出
                console.error(err);
                throw err;
            });
            option.Model[filename] = ModelObj({ sequelize, Sequelize });
        });
    }

}


const BaseController = require('./Controller');
const BaseServer = require('./Server');



const KoaRouter = require('koa-router');
const router = new KoaRouter();



class App extends Application {

    constructor() {
        super();
        //this.config = {};
        this.Controller = {};
        this.Server = {};
        this.Model = {};

        this.initConfig();
        this.initModel();
        this.initServer();
        this.initController(this);

        this.initRouter();
    }

    createContext(req, res) {
        const context = super.createContext(req, res);
        this.injectUtil(context);

        // this.use(async (context, next) => {
        //     await next();
        // });

        this.injectService(context);

        return context
    }


    injectService(context) {
        const serviceLoader = this.ServerLoaderobj;
        Object.defineProperty(context, 'services', {
            get() {
                return serviceLoader.getServices(context);
            }
        });
    }


    injectUtil(context) {
        context.sayHello = () => {
            return 'hello';
        }
    }


    initRouter() {


    }


    initConfig() {
        const ROOT = process.cwd();
        const fileDir = ROOT + "/Config/";
        this.config = require(fileDir + "Config.js");
    }

    initController(context) {
        this.controllerLoader = new Controllerloader(context);
    }

    initServer() {
        const ROOT_PATH = process.cwd();
        const serverPath = path.join(ROOT_PATH, 'Server')
        this.ServerLoaderobj = new ServiceLoader(serverPath);
    }


    initModel() {
        this.Modelloader = new Modelloader(this);
    }

}


module.exports = {
    BaseController,
    BaseServer
}



const appObj = new App();

const KoaBodyparser = require('koa-bodyparser');
appObj.use(KoaBodyparser());

const KoaStatic = require('koa-static');
appObj.use(KoaStatic(path.join(ROOT, 'Static')));





middleware = require(ROOT + '/middlewares/index');

const fileDir = ROOT + "/router.js";
routers = require(fileDir)(middleware);

routers.forEach((item) => {
    const { action } = item;
    const args = [item.path];
    if (typeof item.middleware == 'function') {
        args.push(item.middleware);
    }

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


