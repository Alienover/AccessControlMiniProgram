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

  return '#' + colorCode
}

function colorReverse(oldColor) {
  const colorValue = "0x" + oldColor.replace(/#/g, "");
  const str = "000000" + (0xFFFFFF - colorValue).toString(16);
  return str.substring(str.length - 6, str.length);
}

module.exports = {
  isLogin,
  isMachinesExist,
  handleError,
  randomColor,
  colorReverse
}