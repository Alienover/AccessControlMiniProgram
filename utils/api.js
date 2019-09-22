const app = getApp()
const utils = require('./utils.js')
const constants = require('./constants.js')

const PREFIX = 'https://mwsq.scities.cc'
const FIRE_FOORS_PREFIX = 'http://qrc.uclbrt.com'

const endpoints = {
  login: `${PREFIX}/mobileInterface/user/login`,
  machineInfo: `${PREFIX}/mobileInterface/terminal/machineInfo/unlockInfo`,
  unlock: `${PREFIX}/mobileInterface/sip/unlock/onlineUnLock`,
  fireDoors: `${FIRE_FOORS_PREFIX}/api/client/Home/getUsualKeyList`,
  fireKey: `${FIRE_FOORS_PREFIX}/api/client/Home/getKeyInfo`
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
          wx.setStorageSync(constants.MACHINE_KEY, machines.sort(function (a, b) {
            return a.buildingName > b.buildingName ? 1 : -1
          }))
          onSuccess(machines)
        } else { onSuccess(false) }
      },
    })
  }
}

function unlock(terminalSerial) {
  const user = utils.isLogin()
  const body = {
    terminalSerial,
    userId: user.userId,
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

function fireDoors(onSuccess) {
  const body = {
    mid: constants.MID
  }

  wx.request({
    url: endpoints.fireDoors,
    data: body,
    header: {
      'cookie': constants.COOKIE,
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    success: function(res) {
      wx.hideLoading()
      let list = false
      if (res.data.error === 0) {
        list = res.data.data.list.map(function (each) {
          const [_, room] = each.link.match(/room=(\d+)&/) || []
          return {
            ...each,
            room
          }
        })
        wx.setStorageSync(constants.FIRE_DOOR_KEY, list)
      }
      onSuccess(list)
    },
    fail: function(res) {},
    complete: function(res) {},
  })
}

function fireKey(room) {
  const body = {
    mid: constants.MID,
    room: room
  }
  wx.showLoading({
    title: 'Loading',
  })

  wx.request({
    url: endpoints.fireKey,
    data: body,
    header: {
      'cookie': constants.COOKIE,
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    dataType: 'json',
    responseType: 'text',
    success: function(res) {
      console.log(res)
    },
    fail: function(res) {},
    complete: function(res) {
      wx.hideLoading()
    },
  })
}


module.exports = {
  login,
  machineInfo,
  unlock,
  fireDoors,
  fireKey
}