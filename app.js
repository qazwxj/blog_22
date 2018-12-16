const express=require('express')
const bodyParser=require('body-parser')
const fs=require('fs')
const path=require('path')
const session=require('express-session')
const app=express()

// app.use() : 注册中间件
// app.set() : 设置一些配置的  例如 views 设置模板存放目录  view engine 设置默认的模板引擎
// app.get / post / delete / option / head / put  监听不同请求方式的方法
// app.get('/')  app.post('/')
// res.render() : 渲染, 必须设置好模板引擎后才可以使用
// res.send() : 响应数据(对象数组字符串, 不能是number)  如果传入数组字符串, express内部执行了JSON.stringfy() 将对象序列化为字符串
// res.status() : 改变响应的状态码
// res.redirect() : 重定向

app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized:true,
    //如果不设置过期时间，默认关闭浏览即过期，无法存储有效的cookie
    cookie:{maxAge:1000*60*60*24*30}
}))

app.use(bodyParser.urlencoded({extended:false}))
//设置默认采用的模板引擎名称
app.set('view engine','ejs')
//设置模板页面存放路径
// app.set('views','./views')
app.use('/node_modules', express.static('./node_modules'))

// app.use(require('./router/index'))
// app.use(require('./router/user'))

fs.readdir('./router',(err,files)=>{
    if(err)return console.log(err.message)
    files.forEach(filename=>{
        //相对路径引入
        // console.log('./router/'+filename)
        // app.use(require('./router/'+filename))
        //绝对路径引入
        const filePath=path.join(__dirname,'./router/'+filename)
        //console.log(filePath)
        app.use(require(filePath))
    })
})
app.listen(80,()=>{
    console.log('server running at http://127.0.0.1')
})

