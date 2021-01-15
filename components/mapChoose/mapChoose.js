// components/mapChoose/mapChoose.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    languageFlag:'中文',
    addressFrom: app.globalData.language == '中文' ? '提货地址' : 'Pick up address',
    addressTo: app.globalData.language == '中文' ? '收货地址' : 'Delivery Address',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleClick(e) {
      console.log('e: ', e)
      this.triggerEvent('onClick', e.currentTarget.dataset.title)
    }
  },
  attached: function () {
    console.log('--------------')
    console.log('--------------')
    console.log('--------------')
    console.log('--------------')
    console.log('app.globaldata' , app.globalData.language)
    // if(this.data.languageFlag !=  app.globalData.language){
      this.setData({
        languageFlag:app.globalData.language,
        addressFrom: app.globalData.language == '中文' ? '提货地址' : 'Pick up address',
        addressTo: app.globalData.language == '中文' ? '收货地址' : 'Delivery Address',
      })
    // }

    if (app.globalData.addressFrom) {
      console.log('addressFrom: ', app.globalData.addressFrom);
      this.setData({
        addressFrom: app.globalData.addressFrom.formattedAddress
      })
    }
    if (app.globalData.addressTo) {
      console.log('addressTo: ', app.globalData.addressTo);
      console.log('我进来了')
      this.setData({
        addressTo: app.globalData.addressTo.formattedAddress
      })
    }

  },
  pageLifetimes: {
    show: function () {
      console.log('!!!!!!!')
      console.log('!!!!!!!')
      console.log('!!!!!!!')
      console.log('!!!!!!!')
      console.log('!!!!!!!')
      console.log('mapchoose 页面的globalData： ' , app.globalData.language)
      if(this.data.languageFlag !=  app.globalData.language){
        this.setData({
          languageFlag:app.globalData.language,
          addressFrom: app.globalData.language == '中文' ? '提货地址' : 'Pick up address',
          addressTo: app.globalData.language == '中文' ? '收货地址' : 'Delivery Address',
        })
      }

      if (app.globalData.addressFrom) {
        console.log('addressFrom: ', app.globalData.addressFrom);
        this.setData({
          addressFrom: app.globalData.addressFrom.formattedAddress
        })
      }
      if (app.globalData.addressTo) {
        console.log('addressTo: ', app.globalData.addressTo);
        console.log('我进来了')
        this.setData({
          addressTo: app.globalData.addressTo.formattedAddress
        })
      }
    },
    hide: function () {
      // 页面被隐藏
    },
    resize: function (size) {
      // 页面尺寸变化
    }
  }
})