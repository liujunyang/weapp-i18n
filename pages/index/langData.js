const i18n = getApp().i18n

// 不会动态变化的翻译放这里
let data = {
  'fanyi1': i18n._('fanyi1'),
  'fanyi2': i18n._('fanyi2'),
}


module.exports  = {
  data: {
  	T_D: data
  },
  // 有参数会变化的翻译放下面的尾部函数里
  setTransData () {
    console.log('去翻译带参数的内容')
    let self = this
    self.setData({
      'T_D.erxuanyi': i18n._b('erxuanyi', {first: !self.data.isBtn1Tapped}),
      'T_D.dongtaichuancan': i18n._('dongtaichuancan', {num1: self.data.num1, num2: self.data.num2}),
    }, true)
  }
};
