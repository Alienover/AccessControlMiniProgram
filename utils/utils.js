const constants = require('./constants.js')

function isLogin() {
  const userInfo = wx.getStorageSync(constants.USER_KEY)

  if (!!userInfo) {
    return userInfo
  } else return false
}

function isMachinesExist() {
  const machines = wx.getStorageSync(constants.MACHINE_KEY)

  if (!!machines) {
    return machines
  } else return false
}

function isFireDoorsExist() {
  const fireDoors = wx.getStorageSync(constants.FIRE_DOOR_KEY)

  if (!!fireDoors) {
    return fireDoors
  } else return false
}

function handleError(res, message = 'Error') {
  try {
    if (res.data.result === '1') {
      wx.showToast({
        title: message,
        icon: 'none'
      })
      return false
    } else {
      return true
    }
  } catch(e) {
    return false
  }
}

function randomColor(original = '') {
  // const r = (Math.round(Math.random()* 127) + 127).toString(16);
  // const g = (Math.round(Math.random()* 127) + 127).toString(16);
  // const b = (Math.round(Math.random()* 127) + 127).toString(16);

  function soften(color) {
    return (Math.round(((parseInt(color, 16) % 255) / 255) * 127) + 127).toString(16)
  }

  let colorCode = ('00000' + (Math.random() * 0x1000000 << 0).toString(16)).substr(-6)
  if (!!original) {
    colorCode = (
      (original.split('').reduce((prev, curr) => {
        const a = (prev << 5) - prev + curr.charCodeAt(0)
        return a & a
      }, 0) *
        0xffffff) <<
      0
    )
      .toString(16)
      .slice(-6)
  }
  // return '#' + colorCode
  const { h, s, l} = RGB2HSL(colorCode)

  return `hsl(${h} ${s} ${l})`
}

function RGB2HSL(rgb) {
  const r = parseInt(rgb.slice(0, 2), 16) / 255
  const g = parseInt(rgb.slice(2, 4), 16) / 255
  const b = parseInt(rgb.slice(4, 6), 16) / 255

  const h = colorH(r, g, b)
  const s = colorS(r, g, b)
  const l = colorL(r, g, b)

  return { 
    h: h * 0.8,
    s: (s * 100).toFixed(0) + '%',
    l: (l * 100).toFixed(0) + '%'
  }
}

function colorH(r, g, b) {
  let h = 0
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)

  if (max === min) h = 0
  else if (max === r && g >= b) h = Math.round(60 * ((g - b) / (max - min)))
  else if (max === r && g < b) h = Math.round(60 * ((g - b) / (max - min))) + 360
  else if (max === g) h = Math.round(60 * ((b - r) / (max - min))) + 120
  else if (max === b) h = Math.round(60 * ((r - g) / (max - min))) + 240

  return h
}

function colorL(r, g, b) {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)

  return (max + min) / 2
}

function colorS(r, g, b) {
  let s = 0
  const l = colorL(r, g, b)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)

  if (l > 0 && l <= 0.5) s = (max - min) / (max + min)
  else if (l > 0.5) s = (max - min) / (2 - max - min)
  else s = 0

  return s
}

module.exports = {
  isLogin,
  isMachinesExist,
  isFireDoorsExist,
  handleError,
  randomColor
}