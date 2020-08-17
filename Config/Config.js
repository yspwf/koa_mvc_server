module.exports = {
    'mysql': {
        database: 'blog',
        username: 'root',        //数据库用户名
        password: '123456',       //数据库密码
        host: '127.0.0.1',         //数据库主机IP  localhost
        dialect: 'mysql',
        port: 3307,
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    }
}

