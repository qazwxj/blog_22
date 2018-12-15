const express=require('express')
const bodyParser=require('body-parser')
const mysql=require('mysql')
const moment=require('moment')
const conn=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'root',
    database:'blog'
})
const app=express()
app.use(bodyParser.urlencoded({extended:false}))
//设置默认采用的模板引擎名称
app.set('view engine','ejs')
//设置模板页面存放路径
// app.set('views','./views')
app.use('/node_modules', express.static('./node_modules'))
app.get('/',(req,res)=>{
    //res.render函数，一定要保证安装和配置了ejs模板引擎
    res.render('index',{})
})

app.get('/register',(req,res)=>{
    res.render('./user/register',{})
})
app.post('/register',(req,res)=>{
    let userInfo=req.body
    //表单校验
    if(!userInfo.username||!userInfo.nickname||!userInfo.password)return res.status(400).send({status:400,msg:'请输入正确的表单信息！'})
    //2.查重，判断用户名是否已经存在，连接数据库
    const chachongSql='select count(*)as count from blog_users where username=?'
    conn.query(chachongSql,userInfo.username,(err,result)=>{
    if(err)return res.status(500).send({status:500,msg:'查重失败！请重试'})
    //result[0].count 为0表示没有重复，可以用
    if(result[0].count!==0)return res.status(400).send({status:400,msg:'用户名重复！请重试'})
    //能到此处说明可以注册
    //添加ctime字段
    userInfo.ctime=moment().format('YYY-MM-DD HH:mm:ss')
    //执行注册Sql语句，使用mySql模块，注意insert into xxx set
    const registerSql='insert into blog_users set?'
    conn.query(registerSql,userInfo,(err,result)=>{
        if(err)return res.status(500).send({status:500,msg:"注册失败！请重试"})
        res.send({status:200,msg:'注册成功！'})
        })
    })
})
app.get('/login',(req,res)=>{
    res.render('./user/login',{})
})
app.post('/login',(req,res)=>{
    //直接去数组库执行查询语句，条件username和password
    const loginSql='select *from blog_users where username=? and password=?'
    conn.query(loginSql,[req.body.username,req.body.password],(err,result)=>{
        if(err||result.length===0)return res.status(400).send({
        status:400,msg:'查询失败!请重试！'
        })
        //登录成功
        res.send({status:200,msg:'登录成功！'})
    })
})

app.listen(80,()=>{
    console.log('server running at http://127.0.0.1')
})
