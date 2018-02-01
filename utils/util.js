const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


/**
 * 代理小程序的 setData，在更新数据后，翻译传参类型的字符串
 *
 * @param {object} langData 当页的翻译模块
 */
function resetSetData (langData) {
  let self = this

  /**
   * 在小程序中，使用子组件的页面， this.setData configurable 和 writable 都是 false
   * 所以不能重置 setData 方法，只能另起一个函数名，这里用了 setComData，
   * 另外，由于在 langData.js 中 setTransData 方法调用的是 setData，
   * 所以，另外给使用子组件的页面，定义了个 setComTransData 方法，去调用 setComData
   */

  let isUsingComponents = !self.__proto__.hasOwnProperty('setData') && self.__proto__.__proto__.hasOwnProperty('setData')
  let _ = self.setData

  if (!isUsingComponents) {
    self.setData = function(data, isSetTrans = false){
      _.call(self, data)
      if (isSetTrans) {/* 阻止翻译循环调用 setData  */return;}
      langData.setTransData && langData.setTransData.call(self)
    }
  } else {
    self.setComData = function(data, isSetTrans = false){
      _.call(self, data)
      if (isSetTrans) {/* 阻止翻译循环调用 setData  */return;}
      langData.setComTransData && langData.setComTransData.call(self)
    }
  }
  
}

module.exports = {
  formatTime,
  resetSetData,
}
