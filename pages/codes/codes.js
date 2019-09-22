// pages/codes/codes.js
const api = require('../../utils/api.js')
const utils = require('../../utils/utils.js')
const qrCode = require('../../utils/qrcode.js')
const constants = require('../../utils/constants.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    doors: [],
    activeIndex: undefined,
    toShow: '',
  },

  handleTap: function(e) {
    const _this = this
    const { index } = e.currentTarget.dataset
    const door = this.data.doors[index]
    
    api.fireKey(door.room, function(res) {
      wx.vibrateShort()
      _this.setData({
        activeIndex: index,
        toShow: qrCode(utils.fireKeyDecoder(res))
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this
    const fireDoors = utils.isFireDoorsExist()

    if (fireDoors) {
      _this.setData({
        doors: fireDoors
      })
    } else {
      api.fireDoors(function(res) {
        if (res) {
          _this.setData({
            doors: res
          })
        }
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
    const _this = this
    api.fireDoors(function (res) {
      if (res) {
        _this.setData({
          doors: res
        })
      }
    })
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