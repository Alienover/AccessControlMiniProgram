// pages/index/index.js
const utils = require('../../utils/utils.js')
const constants = require('../../utils/constants.js')
const api = require('../../utils/api.js')
const app = getApp()

Page({
  handleSubmit: (e) => {
    const formData = e.detail.value

    if (formData.secret === constants.SECRET) {
      api.login(formData.mobile, formData.password, function(res) {
        if (res) {
          wx.redirectTo({
            url: '../index/index',
          })
        }
      })
    }
  },
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const user = app.globalData.user
    if (!!user) {
      app.globalData.user = user
      wx.redirectTo({
        url: '../index/index',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})