// components/selectCard/selectCard.js
import country from '../../utils/locales/zh/country'
let app = getApp();


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    allPlan: Array,
    currency: {
      type: String,
      value: 'CNY'
    },
    isShipperOrConsignee:{
      type: String,
      value: 'Shipper'
    },
    incoterms:{
      type: String,
      value: 'DAP'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    country: country,
    languageFlag: '中文',
    languageName: app.globalData.language,
    language: app.globalData.language == '中文' ? require('../../utils/locales/zh/price').default : require('../../utils/locales/en/price').default,
    languageBase: app.globalData.language == '中文' ? require('../../utils/locales/zh/base').default : require('../../utils/locales/en/base').default,
    languageCountry: app.globalData.language == '中文' ? require('../../utils/locales/zh/country') : require('../../utils/locales/en/country'),

    // isShipperOrConsignee: app.globalData.isShipperOrConsignee,
    // incoterms: app.globalData.incoterms,
  },
  attached: function () {
    console.log('allPlan 组件内:  ', this.properties.allPlan);
    if (this.data.languageFlag != app.globalData.language) {
      this.setData({
        languageName: app.globalData.language,
        languageFlag: app.globalData.language,
        language: app.globalData.language == '中文' ? require('../../utils/locales/zh/price').default : require('../../utils/locales/en/price').default,
        languageBase: app.globalData.language == '中文' ? require('../../utils/locales/zh/base').default : require('../../utils/locales/en/base').default,
        languageCountry: app.globalData.language == '中文' ? require('../../utils/locales/zh/country') : require('../../utils/locales/en/country'),
      })
    }


  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleCardClick({
      currentTarget
    }) {
      // console.log('currentTarget: '  ,currentTarget.dataset.index)
      // console.log('currentTarget: '  ,currentTarget.dataset.item)
      let target = {
        index: currentTarget.dataset.index,
        needPlan: currentTarget.dataset.item
      }

      this.triggerEvent('onClick', target);
    }
  },

})