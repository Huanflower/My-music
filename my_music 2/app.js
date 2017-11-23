'use strict';
// 1:引入express对象
const express = require('express');
// 2:创建服务器
let app = express();
// 3:开启服务器监听端口
app.listen(9999,()=>{
    console.log('34期服务器启动在9999端口');
});
//引入处理post请求体对象
const bodyParser = require('body-parser');
//session
const session = require('express-session');
const router = require('./web_router');
//配置模板引擎
app.engine('html', require('express-art-template') );

//中间件配置行为列表
//-1件事 在路由使用session之前，先生产session
app.use(session({
    secret: 'itcast',//唯一标识，必填
    resave: false,
    saveUninitialized: true,
    // cookie: {secure:true}
}));
//第0件事:处理post请求体数据
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
//第一件事: 路由
app.use('/api',router);
// 第二件事: 错误处理
app.use((err,req,res,next)=>{
    console.log(err);
    res.send(`
        <div style="background-color:yellowgreen;">
            您要访问的页面，暂时去医院了..请稍后再试..
            <a href="/">去首页</a>
        </div>
    `)
});