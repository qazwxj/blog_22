module.exports={
    getArticleAddHandler(req,res){
        if(!req.session.isLogin)return res.redirect('/')
        res.render('article/add',{
            isLogin:req.session.isLogin,
            userInfo:req.session.userInfo
        })
    }
}