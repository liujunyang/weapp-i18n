# 微信小程序国际化

## 现状
小程序国际化[官方没有支持](https://developers.weixin.qq.com/blogdetail?action=get_post_info&lang=zh_CN&token=&docid=8c8af2056cdca1263aafcebc26bd180f)，也没有现成的插件。

网上有人做了国际化的[尝试](http://www.jianshu.com/p/5d0da1e43948)。但是只能替换静态文本，就是简单的键值匹配。

[vue-i18n](https://github.com/kazupon/vue-i18n) 由于是基于` html` 和 `vue`, 不同于`wxml`（尤其是不能修改dom），估计进行hack调研可能要花很多时间。

## 方案
### 介绍
如果想让翻译的内容渲染在页面中，需要把翻译的数据放在 Page 的 data 中，对于动态渲染带可变参数的数据， 在 setData 的时候加个尾巴（在其后面set 带参数的翻译的 data）。
目前基本方案是自己开发一套翻译工具：
* 功能：
	1. 翻译静态文案
	2. 翻译带参数的文案
*缺陷
	1.由于只能返回字符串，没有类似vue 通过 `v-html` 进行标签替换的能力，所以对带标签（样式）的翻译无能为力。

总结：
优先保证中文用户的使用体验，对于不带标签的类型的翻译，中英文没有区别，对于带标签的类型的翻译，将中文翻译直接放在 `wxml` 中，只是在中文的情况下显示，在非中文时直接隐藏。

### 代码
```js
// i18n.js
module.exports = {
  locale: 'en',
  locales: {},
  registerLocale (locales) {
    this.locales = locales
  },
  setLocale (code) {
    this.locale = code
  },
  /**
   * 返回带（或不带）参数的类型的翻译结果
   * @param {string} key, /util/language/en.js 中的键名，如 "curslide"
   * @param {object} data, 传入的参数，如 {num: 123}
   * @returns {string}
   *
   * @desc 如："activeno": "当前学生{activeno}位",
   *       activeno 为 key，可以输入data {activeno: 15}
   *       返回："当前学生15位"
   */
  _ (key, data) {
    let locale = this.locale
    let locales = this.locales
    let hasKey = locale && locales[locale] && locales[locale][key]
    
    if (hasKey) {
      key = locales[locale][key]

      let res = key.replace(/\{[\s\w]+\}/g, x => {
        x = x.substring(1, x.length-1).trim()
        return data[x];
      })

      return res
    }

    throw new Error(`语言处理错误${key}`)
  },
  /**
   * 返回二选一类型的翻译结果
   * @param {string} key, /util/language/en.js 中的键名，如 "curslide"
   * @param {object} data, 传入的参数，如 {first: true} 选择前面的
   * @returns {string}
   *
   * @desc 如："sendprob": "Send | Check",
   *       sendprob 为 key，可以输入data {first: true}
   *       返回："Send"
   */
  _b (key, data) {
    let locale = this.locale
    let locales = this.locales
    let hasKey = locale && locales[locale] && locales[locale][key]
    
    if (hasKey) {
      key = locales[locale][key]

      let res = key.split('|')[data.first ? 0 : 1].trim()

      return res
    }

    throw new Error(`语言处理错误${key}`)
  }
}
```