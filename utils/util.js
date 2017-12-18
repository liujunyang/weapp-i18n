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

  let _ = self.setData
  self.setData = function(data, isSetTrans = false){
    _.call(self, data)
    if (isSetTrans) {/* 阻止翻译循环调用 setData  */return;}
    langData.setTransData && langData.setTransData.call(self)
  }
}

module.exports = {
  formatTime,
  resetSetData,
}
