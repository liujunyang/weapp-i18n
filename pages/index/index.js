//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util')
const langData = require('./langData')

Page({
  // 使用 Object.assign 补充翻译的 data
  data: Object.assign({}, langData.data, {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    isBtn1Tapped: false,
    num1: 10,
    num2: 100,
  }),
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  // 触发修改二选一的和动态传参的内容的变化
  changeTrans () {
    console.log('点击了改变翻译内容按钮')
    this.setData({
      isBtn1Tapped: !this.data.isBtn1Tapped,
      num1: this.data.num1 + 5,
      num2: this.data.num2 + 10,
    })
  },
  onLoad: function () {
    // 代理小程序的 setData，在更新数据后，翻译传参类型的字符串
    util.resetSetData.call(this, langData)

    // 在这里强制调用一回 setData 触发执行翻译的 setData
    this.setData({
      num1: 20
    })

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
