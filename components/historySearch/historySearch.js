// components/historySearch/historySearch.js
import {
  watch
} from "../../utils/watcher";
import {
  getStorageAPI
} from '../../utils/help';
let app = getApp();


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    searchHistoryGetIn: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    searchHistory: null,
    isRubbishShow: false,
    isMaskShow: false,
    languageFlag: '中文',
    languageBase: app.globalData.language == '中文' ? require('../../utils/locales/zh/base').default : require('../../utils/locales/en/base').default,
    language: app.globalData.language == '中文' ? require('../../utils/locales/zh/home').default : require('../../utils/locales/en/home').default
    // searchHistory: [
    //   {
    //     item_type_id: 1,
    //     searchable_items: [{
    //       name:'额我会尽可能健康'
    //     }],
    //     from_address_json: {
    //       formattedAddress: '上海组织执行主席执行主席'
    //     },
    //     to_address_json: {
    //       formattedAddress: '意大利电话都不回电话'
    //     }
    //   },
    //   {
    //     item_type_id: 2,
    //     searchable_items: [{
    //       name:'shubiao'

    //     }],
    //     from_address_json: {
    //       formattedAddress: '上海'
    //     },
    //     to_address_json: {
    //       formattedAddress: '意大利'
    //     }
    //   }
    // ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleClick(e) {
      console.log('e: ', e)
      let data = e.currentTarget.dataset.item;
      data['index'] = e.currentTarget.dataset.index
      this.triggerEvent('onClick', data)
    },
    handleMaskClick() {
      //! 遮罩是否显示
      this.setData({
        isRubbishShow: false,
        isMaskShow: false
      })
    },
    handleRubbishShow() {

      this.setData({
        isRubbishShow: true,
        isMaskShow: true
      })
    },
    handleHistoryDeleate() {
      wx.removeStorage({
        key: 'searchHistory',
        success: (res) => {
          this.setData({
            searchHistory: null
          })
        },
      })
    },
  },
  attached: function () {
    if (this.data.languageFlag != app.globalData.language) {
      this.setData({
        languageFlag: app.globalData.language,
        language: app.globalData.language == '中文' ? require('../../utils/locales/zh/home').default : require('../../utils/locales/en/home').default,
        languageBase: app.globalData.language == '中文' ? require('../../utils/locales/zh/base').default : require('../../utils/locales/en/base').default,
      })
    }
  },

  ready: async function () {
    try {
      let res = await getStorageAPI('searchHistory');
      console.log('---------获取历史搜索记录', res)
      let searchHistory = res.data.filter((i, j) => j <= 4);
      searchHistory.map(i => {
        i.searchable_items = JSON.parse(i.searchable_items)
        i.from_address_json = JSON.parse(i.from_address_json)
        i.to_address_json = JSON.parse(i.to_address_json)
      })
      this.setData({
        searchHistory: searchHistory
      })
      console.log('searchHistory: ', this.data.searchHistory)
    } catch (e) {
      console.log('----------获取历史搜索记录失败', e);
    }
    watch(this, {
      searchHistoryGetIn: function (newValue) {
        console.log('newValue: 最新只 ', newValue)
        newValue.map(i => {
          i.searchable_items = JSON.parse(i.searchable_items)
          i.from_address_json = JSON.parse(i.from_address_json)
          i.to_address_json = JSON.parse(i.to_address_json)
        })
        this.setData({
          searchHistory: newValue
        })

      },



    })
  },
  pageLifetimes: {
    // 组件所在页面的生命周期声明对象，目前仅支持页面的show和hide两个生命周期


    show: function () {
      if (this.data.languageFlag != app.globalData.language) {
        this.setData({
          languageFlag: app.globalData.language,
          language: app.globalData.language == '中文' ? require('../../utils/locales/zh/home').default : require('../../utils/locales/en/home').default,
          languageBase: app.globalData.language == '中文' ? require('../../utils/locales/zh/base').default : require('../../utils/locales/en/base').default,

        })
      }

      this.setData({
        isRubbishShow: false
      })
    },
    hide: function () { }
  }

})