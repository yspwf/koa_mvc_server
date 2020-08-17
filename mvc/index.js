const Application = require('koa');
const fs = require('fs');
const path = require('path');

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
    App,
    BaseController,
    BaseServer
}
