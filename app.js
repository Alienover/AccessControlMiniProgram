//app.js
const utils = require('./utils/utils.js')
App({
  onLaunch: function() {
    const user = utils.isLogin()

    if (user) {
      this.globalData.user = user
      wx.navigateTo({
        url: 'pages/index/index',
      })
    }
  },
  globalData: {
    user: null
  }
})