const app = getApp()
const utils = require('./utils.js')
const constants = require('./constants.js')

const PREFIX = 'https://mwsq.scities.cc'

const endpoints = {
  login: `${PREFIX}/mobileInterface/user/login`,
  machineInfo: `${PREFIX}/mobileInterface/terminal/machineInfo/unlockInfo`,
  unlock: `${PREFIX}/mobileInterface/sip/unlock/onlineUnLock`
}

const defaultHeaders = {
  'content-type': 'application/json'
}

function login(mobile, password, onSuccess) {
  const body = {
    mobile,
    password,
    loginType: constants.LOGIN_TYPE,
    code: constants.CODE
  }
  wx.showLoading({
    title: 'Connecting ...',
    mask: true
  })

  wx.request({
    url: endpoints.login,
    data: body,
    header: {},
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    complete: function() {
      wx.hideLoading()
    },
    fail: utils.handleError,
    success: function(res) {
      wx.hideLoading()
      if (utils.handleError(res)) {
        const user = res.data.data[0]
        wx.setStorageSync(constants.USER_KEY, user)
        onSuccess(user)
      } else { onSuccess(false) }
    }
  })
}

function machineInfo(onSuccess) {
  const user = utils.isLogin()

  if(!!user) {
    const { userId, newSmallCommunityCode } = user
    const body = {
      userId,
      apiVersion: constants.API_VERSION,
      xiaoQuCode: newSmallCommunityCode
    }

    wx.showLoading({
      title: 'Loading Machines List...',
    })
    wx.request({
      url: endpoints.machineInfo,
      data: body,
      header: {},
      method: 'POST',
      dataType: 'json',
      responseType: 'text',
      complete: function() {
        wx.hideLoading()
      },
      fail: utils.handleError,
      success: function(res) {
        wx.hideLoading()
        if (utils.handleError(res)) {
          const machines = res.data.data.list
          wx.setStorageSync(constants.MACHINE_KEY, machines)
          onSuccess(machines)
        } else { onSuccess(false) }
      },
    })
  }
}

function unlock(terminalSerial) {
  const { userId } = app.globalData.user
  const body = {
    userId,
    terminalSerial,
    apiVersion: utils.API_VERSION,
    unlockType: utils.UNLOCK_TYPE,
  }

  wx.showLoading({
    title: 'Unlocking Door...',
    mask: "true"
  })
  wx.request({
    url: endpoints.unlock,
    data: body,
    header: {},
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    success: function(res) {
      wx.hideLoading()
      if (utils.handleError(res)) {
        wx.showToast({
          title: 'Unlock Successfully',
        })
      } 
    },
    fail: utils.handleError,
    complete: function() {
      wx.hideLoading()
    },
  })
}

module.exports = {
  login,
  machineInfo,
  unlock
}