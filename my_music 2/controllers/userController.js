`use strict`;

const db = require('../models/db');
let userController = {

};

userController.doTest = (req, res, next) => {
    db.q('select * from album_dir', [], (err, data) => {
        if (err) return next(err);
        res.render('test.html', {
            text: data[0].dir
        })
})};

//检查用户名是否存在
userController.checkUser = (req, res, next) => {
        //1:获取请求体中的数据 req.body
        let username = req.body.username;
        //2:查询用户名是否存在于数据库中
        db.q('select * from users where username = ?', [username], (err, data) => {
            if (err) return next(err);
            // console.log(data);
            //判断是否有数据
            console.log(data);
            if (data.length == 0) {
                //可以注册
                res.json({
                    code: '001',
                    msg: '可以注册'
                })
            } else {
                res.json({
                    code: '002',
                    msg: '用户名已经存在'
                })
            }
});};

//用户注册
userController.doRegister =  (req, res, next) => {
        //1、接收数据
        let userData = req.body;
        let username = userData.username;
        let password = userData.password;
        let v_code = userData.v_code;
        let email = userData.email;
        //2、处理数据(验证)
        let regex = /^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/;
        if (!regex.test(email)) {
            //不满足邮箱字符串
            res.json({
                code: '004',
                msg: '邮箱不合法'
            })
            return;
        }
        //验证用户名或邮箱是否存在
        db.q('select * from users where username = ? or email = ?', [username, email], (err, data) => {
            if (err) return next(err);
            if (data.length != 0) {
                let user = data[0];
                if (user.email == email) {
                    return res.json({
                        code: '002',
                        msg: '邮箱已经注册'
                    });
                } else if (user.username == username) {
                    return res.json({
                        code: '002',
                        msg: '邮箱已经注册'
                    });
                }
            } else {
                //用户名和邮箱都不存在，可以注册
                db.q('insert into users (username,password,email) values (?,?,?)', [username, password, email], (err, result) => {
                    if (err) return next(err);
                    console.log(result);
                    //响应json对象
                    res.json({
                        code: '001', msg: '注册成功'
                    })
                })
            }
})};

//登录验证
userController.doLogin = (req, res, next) => {

        let username = req.body.username;
        let password = req.body.password;
        let remember_me = req.body.remember_me;

        db.q('select * from users where username = ?', [username], (err, data) => {
            if (err) return next(err);
            // let msg = {};
            // if(data.length == 0){
            //     //没有改用户
            //     msg.code = '002',
            //     msg.msg = '用户名或密码不正确'
            // }else {
            //     //判断密码
            //    let dbUser = data[0];
            //    if(dbUser.password != password){
            //        msg.code = '002',
            //         msg.msg = '用户名或密码不正确' 
            //    }else {
            //        //用户名密码正确
            //        msg.code = '001',
            //        msg.msg = '登录成功'
            //    }
            // }
            // //给session上存储用户数据
            // req.session.user = dbUser;

            // //统一res.json
            // res.json(msg)

            if (data.length == 0) {
                return res.json({
                    code: '002',
                    msg: '用户名或密码不正确'
                });
            }
            //找到用户
            let dbUser = data[0];
            if (dbUser.password != password) {
                return res.json({
                    code: '002',
                    msg: '用户名或密码不正确'
                })
            }
            //个session上存储用户数据
            req.session.user = dbUser;

            res.json({
                code: '001',
                msg: '登录成功'
            })
})};

//向外导出
module.exports = userController;