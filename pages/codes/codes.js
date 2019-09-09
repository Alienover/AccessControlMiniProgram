// pages/codes/codes.js
const utils = require('../../utils/utils.js')
const qrCodes = require('../../utils/qrcodes.js')
const constants = require('../../utils/constants.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    codes: [
      { label: '1F Courtyard', value: qrCodes.FIRE_DOOR_1F },
      { label: '3F East', value: qrCodes.FIRE_DOOR_3F },
      { label: '4F East', value: qrCodes.FIRE_DOOR_4F }
    ],
    activeIndex: undefined,
    toShow: {},
  },

  handleTap: function(e) {
    const { index } = e.currentTarget.dataset
    const qrcode = this.data.codes[index]
    this.setData({
      activeIndex: index,
      toShow: qrcode
    })

    wx.setStorage({
      key: constants.QRCODE_KEY,
      data: {
        activeIndex: index,
        toShow: qrcode
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const qrcode = wx.getStorageSync(constants.QRCODE_KEY) || {}
    
    const codes = [
      { label: '1F Courtyard', value: qrCodes.FIRE_DOOR_1F },
      { label: '3F East', value: qrCodes.FIRE_DOOR_3F },
      { label: '4F East', value: qrCodes.FIRE_DOOR_4F }
    ]

    this.setData({
      ...qrcode,
      codes: codes.map(function(each) {
        const color = utils.randomColor(each.label)
        return {
          ...each,
          backgroundColor: color
        }
      })
    })
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