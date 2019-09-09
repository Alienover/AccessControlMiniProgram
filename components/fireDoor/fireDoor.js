// components/fireDoor/fireDoor.js


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    icon: {
      type: String,
      value: ''
    },
    doors: {
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
    handleTap: function() {
      wx.navigateTo({
        url: '../../pages/codes/codes',
      })
    }
  }
})
