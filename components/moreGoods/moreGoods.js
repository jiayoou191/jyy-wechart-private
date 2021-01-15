// components/moreGoods/moreGoods.js
let app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    formInline: Array

  },

  /**
   * 组件的初始数据
   */
  data: {
    isRubbishCheckShow: false,
    isMaskShow: false,
    sysScroll: false,
    language: app.globalData.language == '中文' ? require('../../utils/locales/zh/itemtype').default : require('../../utils/locales/en/itemtype').default,

  },

  /**
   * 组件的方法列表
   */

  methods: {

    handleFocus(e) {
      console.log(1111)
      this.setData({
        sysScroll: false
      })
      // let u = navigator.userAgent, app = navigator.appVersion;  
      // let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1;  
      // if(isAndroid){  
      //   setTimeout(function() {  
      //    document.activeElement.scrollIntoViewIfNeeded();  
      //    document.activeElement.scrollIntoView();  
      //   }, 500);         
      // }  

    },
    handleBlur() {
      this.setData({
        sysScroll: true
      })

      // e.target.parentNode.className = 'input input-fixed';
      // clearInterval(timer)
    },
    handleMore() {
      console.log(123)
      let form = {
        name: '',
        weight: '',
        volume: '',
        flag: false
      }
      let formInline = this.data.formInline;
      formInline = [...formInline, form]
      formInline.map(i => {
        i.flag = false
      })
      this.setData({
        formInline: formInline
      })
      console.log('formInline: ', this.data.formInline)
    },
    handleChange(e) {
      console.log('e name: ', e)
      let formInline = this.data.formInline;
      formInline.map(i => {
        i.flag = false
      })
      let name = e.currentTarget.dataset.name;
      let index = e.currentTarget.dataset.index;
      if (name == '名称') {
        formInline[index].name = e.detail
      } else if (name == '重量') {
        formInline[index].weight = e.detail.value
      } else if (name == '体积') {
        formInline[index].volume = e.detail.value
      }
      this.setData({
        formInline: formInline
      })
      app.globalData.formInline = this.data.formInline;
      console.log('formInline: ', app.globalData.formInline)
    },
    handleCheckDeleate(e) {
      //! 点击垃圾桶
      console.log("e: ", e)
      let index = e.currentTarget.dataset.index;
      console.log('index: ', index)
      let formInline = this.data.formInline;
      formInline.map(i => {
        i.flag = false
      })
      formInline[index].flag = true;
      this.setData({
        formInline: formInline,
        isMaskShow: true
      })
      console.log('formInline: ', this.data.formInline)
    },
    handleDeleate(e) {
      //! 点击确认

      console.log('e: ', e)
      const index = e.currentTarget.dataset.index;
      let formInline = this.data.formInline;
      formInline = formInline.filter((i, j) => j != index)
      this.setData({
        formInline: formInline,
        isMaskShow: false
      })
      app.globalData.formInline = this.data.formInline;
      console.log('globalData.formInline', app.globalData.formInline)
    },
    handleMaskClick() {
      let formInline = this.data.formInline;
      formInline.map(i => {
        i.flag = false
      })
      this.setData({
        formInline: formInline,
        isMaskShow: false
      })
    }
  },
  ready() {
    let language = null;
    if (app.globalData.language == '中文') {
      language = require('../../utils/locales/zh/moreGoods').default;
    } else {
      language = require('../../utils/locales/en/moreGoods').default;
    }
    let formInline = this.data.formInline;
    formInline.map(i => {
      i['flag'] = false
    })
    this.setData({
      formInline: formInline,
      language
    })
    console.log('formInline:', formInline)


  }
})