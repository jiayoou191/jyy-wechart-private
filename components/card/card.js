// components/card/card.js
let app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    minHeight: {
      type: Number,
      value: 200
    },
    title: {
      type: String,
      value: ""
    },
    rightTitle: {
      type: String,
      value: ""
    },
    icon: {
      type: String,
      value: ""
    },
    needAppend: {
      type: Boolean,
      value: false
    },
    rightTitleColor: {
      type: String,
      value: "rgba(67, 67, 67, 1)"
    },
    hasCheckBox: {
      type: Boolean,
      value: false
    },
    cardClickable: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    checked: true,
    languageName: app.globalData.language,
    language: app.globalData.language == '中文' ? require('../../utils/locales/zh/review').default : require('../../utils/locales/en/review').default,
    baselanguage: app.globalData.language == '中文' ? require('../../utils/locales/zh/base').default : require('../../utils/locales/en/base').default
  },
  options: {
    multipleSlots: true,
  },
  /**
   * 组件的方法列表
   */
  methods: {
    showDetail() {
      if (this.data.needAppend) {
        // console.log("需要展示详情");
        this.triggerEvent("showDetail");
      }
    },
    onChange(event) {
      console.log('event', event);
      this.setData({
        checked: event.detail
      });
      this.triggerEvent("checkedChange");
    }
  }
})