// components/machineItem/machineItem.js
const api = require('../../utils/api.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    header: {
      type: String,
      value: 'Doors:'
    },
    machines: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleTap: function(e) {
      const { terminalSerial } = e.currentTarget.dataset

      api.unlock(terminalSerial)
    }
  }
})
