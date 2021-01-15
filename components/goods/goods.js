// components/goods/goods.js
import {
  watch
} from "../../utils/watcher";
let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    query: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    items: {},
    isShow: false,
    languageFlag: '中文',
    language: app.globalData.language == '中文' ? require('../../utils/locales/zh/detail').default : require('../../utils/locales/en/detail').default,
    typelanguage: app.globalData.language == '中文' ? require('../../utils/locales/zh/itemtype').default : require('../../utils/locales/en/itemtype').default,
    baselanguage: app.globalData.language == '中文' ? require('../../utils/locales/zh/base').default : require('../../utils/locales/en/base').default,


  },
  attached: function () {
    console.log(1)
    if (this.data.languageFlag != app.globalData.language) {
      this.setData({
        languageFlag: app.globalData.language,
        language: app.globalData.language == '中文' ? require('../../utils/locales/zh/detail').default : require('../../utils/locales/en/detail').default,
        typelanguage: app.globalData.language == '中文' ? require('../../utils/locales/zh/itemtype').default : require('../../utils/locales/en/itemtype').default,
        baselanguage: app.globalData.language == '中文' ? require('../../utils/locales/zh/base').default : require('../../utils/locales/en/base').default,
      })
    }
  },
  ready() {
    this.setItemType(this.properties.query);
    watch(this, {
      query(newValue) {
        console.log('-------------query改变了', newValue);
        this.setItemType(newValue);
      }
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    setItemType(query) {
      let items = {
        name: [],
        weight: 0,
        volume: 0,
        type: query.itemType.name
      }
      console.log('------goods页面------items', items);
      query.items.map(i => {
        items.name.push(i.name);
        items.weight += i.weight;
        items.volume += i.volume;
      })
      this.setData({
        items: {
          ...items
        }
      });
    },
    handleOpen() {
      //! 查看商品展示按钮
      console.log('进入！open')
      if (this.data.query.items.length > 1) {
        this.setData({
          isShow: true
        })
      }


    },
    handleClose() {
      console.log('进入！close')

      //! 关闭商品展示按钮
      this.setData({
        isShow: false
      })
    }
  }
})