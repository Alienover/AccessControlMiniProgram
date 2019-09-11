// pages/index/index.js
const app = getApp()
const api = require('../../utils/api.js')
const qrcode = require('../../utils/qrcode.js')
const utils = require('../../utils/utils.js')
const constants = require('../../utils/constants.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    machines: {
      normal: [],
      front: []
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this
    const user = utils.isLogin()
    const machines = utils.isMachinesExist()

    if (!user) {
      wx.navigateTo({
        url: '../login/login',
      })
    }

    if(machines) {
      _this.setData({
        machines: {
          ...machineFilter(machines)
        }
      })
    } else {
      api.machineInfo(function (res) {
        if(res) {
          _this.setData({
            machines: {
              ...machineFilter(res)
            }
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
    api.machineInfo(function (res) {
      if (res) {
        _this.setData({
          machines: {
            ...machineFilter(res)
          }
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

function machineFilter(machines) {
  const [normal, front] = [[], []]

  if (Array.isArray(machines)) {
    machines.map(function(each) {
      if (each.name.includes(constants.FRONT_MARK)) {
        front.push({
          ...each,
          buildingName: each.buildingName.replace(/(F)/, '$1-'),
          style: {
            backgroundColor: utils.randomColor(each.no)
          }
        })
      } else normal.push({
        ...each,
        buildingName: each.buildingName.replace(/(F)/, '$1-'),
        style: {
          backgroundColor: utils.randomColor(each.no)
        }
      })
    })
  }

  return {normal, front}
}