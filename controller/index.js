module.exports = {
    // 约定大于配置
    getIndexHandler(req, res) {
      res.render('index', {
        userInfo: req.session.userInfo,
        isLogin: req.session.isLogin
      })
    }
  }