// components/itemTypeChoose/itemTypeChoose.js
let app = getApp();
import internetDocument from '../../utils/internetDocument'
import {
  watch
} from "../../utils/watcher"



Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemTypes: Array,
    getLanguage:String
    // language: {
    //   type: Object,
    //   value: null
    // }
  },
  /**
   * 组件的初始数据
   */
  data: {
    accessibleItemTypes: null,
    loading: true,
    radio: '1',
    checkIndex: 0,
    internetDocument: internetDocument,
    formInline: [{
      name: '',
      weight: '',
      volume: '',
    }],
    isBack: false,
    sysScroll: false,
    languageFlag: '中文',
    language:  app.globalData.language == '中文'?require('../../utils/locales/zh/itemtype').default:require('../../utils/locales/en/itemtype').default
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleFocus() {
      this.setData({
        sysScroll: false
      })

    },
    handleBlur() {
      this.setData({
        sysScroll: true
      })

    },
    handleTabsChange({
      detail
    }) {
      console.log('----------------切换tab页', detail);
      console.log('formType: ', app.globalData.formType)
      let formType = app.globalData.formType
      if (formType.name == '国际文件' || formType.name == 'Documentations') {
        this.setData({
          isBack: false
        })
      }
      console.log('-----------------------')
      console.log('-----------------------')
      console.log('-----------------------')
      console.log('-----------------------')
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!')
      console.log('isBack: ', this.data.isBack)

      if (!this.data.isBack) {
        console.log('我被滑动')
        console.log('detail: ', detail)
        this.setData({
          checkIndex: detail.index
        })
        console.log('index: ', this.data.checkIndex)

        if (detail.title == '国际文件' || detail.title == 'Documentations') {
          let formInline = [internetDocument[Number(this.data.radio) - 1]]
          this.setData({
            formInline: formInline
          })
          app.globalData.formInline = this.data.formInline
          console.log('formInline: ', this.data.formInline)
        } else {
          this.setData({
            formInline: [{
              name: '',
              weight: '',
              volume: '',
              flag: false
            }]
          })
          app.globalData.formInline = this.data.formInline
          console.log('formInline: ', this.data.formInline)


        }
        this.setData({
          isBack: false,
          checkIndex: detail.index
        })
      } else {
        console.log('formType: ', app.globalData.formType)
        console.log('detail: ', detail)
        if (detail.title == '国际文件' || detail.title == 'Documentations') {
          let internetDocument = this.data.internetDocument
          let radio = this.data.radio
          let formInline = [{
            name: '国际文件',
            weight: internetDocument[Number(radio) - 1].weight,
            volume: internetDocument[Number(radio) - 1].volume,
            flag: false
          }];
          console.log('radio:', this.data.radio)
          console.log('internetDocument: ', this.data.internetDocument)
          this.setData({
            formInline: formInline
          })
          app.globalData.formInline = this.data.formInline
          console.log('formInline: ', formInline)
        }
        this.setData({
          isBack: false
        })
      }


    },
    handleDocumentClick(e) {
      console.log('e: ', e)
      const {
        name
      } = e.currentTarget.dataset;
      this.setData({
        radio: name,
      });
      let internetDocument = this.data.internetDocument;
      let needDocument = internetDocument.filter(i => i.id == name);
      needDocument = needDocument[0];
      // let formInline =''
      let {
        weightShow,
        id,
        ...formInline
      } = needDocument
      console.log('needDocument: ', needDocument)
      console.log('formInline: ', formInline)
      this.setData({
        formInline: [formInline]
      })
      console.log('formInline: ', this.data.formInline)
      app.globalData.formInline = this.data.formInline
    },
    handleTabsClick({
      detail
    }) {
      console.log('detail: ', detail.title);
      let title = '';
      if (detail.title == '国际文件' || detail.title == 'Documentations') {
        title = '国际文件';
      } else {
        title = '普通货物';
      }
      let itemTypes = this.data.itemTypes
      let item = itemTypes.filter(i => i.name == title)
      console.log('item :', item)
      app.globalData.formType = item[0]
      console.log('app', app.globalData.formType)
    },
    handleChange(e) {
      console.log('e name: ', e)
      let formInline = this.data.formInline;
      let name = e.currentTarget.dataset.name;
      let index = e.currentTarget.dataset.index;
      if (name == '名称') {
        formInline[index].name = e.detail
        app.globalData.formInline[index].name = e.detail

      } else if (name == '重量') {
        console.log('e:  ', e)
        formInline[index].weight = e.detail.value
        app.globalData.formInline[index].weight = e.detail.value

      } else if (name == '体积') {
        console.log('e:  ', e)
        formInline[index].volume = e.detail.value;
        app.globalData.formInline[index].volume = e.detail.value

      }
      this.setData({
        formInline: formInline
      })
      console.log('formInline: ', this.data.formInline)
    },
    handleMore() {
      console.log(123)
      this.triggerEvent('onClick', this.data.formInline);
    }
  },
  attached(){
    console.log('app.globalData.language!!!: '   , app.globalData.language)

  },
  ready() {
    let language = null;
    console.log('22222222222222')
    console.log('app.globalData.language: '   , app.globalData.language)
    if (app.globalData.language == '中文') {
      language = require('../../utils/locales/zh/itemtype').default;
    } else {
      language = require('../../utils/locales/en/itemtype').default;
    }
    let getStorageSync  =  wx.getStorageSync('weChartLanguage')
    console.log('getStorageSync' , getStorageSync)
    this.setData({
      isBack: false,
      language
    })
    console.log('我进来了： itemType')
    console.log('重要的： ', this.properties.itemTypes);
    let accessibleItemTypes = this.properties.itemTypes.filter(i => i.accessible == "Accessible")
    console.log('accessibleItemTypes: ', accessibleItemTypes);
    this.setData({
      accessibleItemTypes: accessibleItemTypes,
      loading: false
    })
    app.globalData.accessibleItemTypes = accessibleItemTypes
    app.globalData.formType = accessibleItemTypes[0];
    console.log('app.globalData.formType: ', app.globalData.formType)



    watch(this, {
      // getLanguage: function (newValue) {
        
      // },
    })

  },

  watchBack(formType) {
    console.log(22222);
    console.log('this.formType==' + formType)
  },
  pageLifetimes: {
    show: function () {
      // 页面被展示
      console.log('app.global',  app.globalData.language)
      // if(this.data.languageFlag !=  app.globalData.language){
        let language = null;
        if (app.globalData.language == '中文') {
          language = require('../../utils/locales/zh/itemtype').default;
        } else {
          language = require('../../utils/locales/en/itemtype').default;
        }
        this.setData({
          languageFlag: app.globalData.language,
          language: language
        })
      // }
      
      console.log('++++++++++++++++++=')
      console.log('itemType页面 我进来了')
      console.log('app.globalData.formInline: ', app.globalData.formInline)
      console.log('this.formType==', app.globalData.formType)
      console.log('accessibleItemTypes: ', this.data.accessibleItemTypes)
      let idx = 999;
      let interDocumentIdx = 999;
      let accessibleItemTypes = this.data.accessibleItemTypes
      let formInline = app.globalData.formInline;
      accessibleItemTypes.map((i, j) => {
        if (i.id == '200602151639hY0VBhhU') {
          interDocumentIdx = j
        }
        if (i.id == app.globalData.formType.id) {
          idx = j
        }
      })
      if (idx == interDocumentIdx) {
        formInline.map((i, j) => {
          if (i.name == '国际文件' || i.name == 'Documentations') {
            if (i.weight == 0.5) {
              this.setData({
                radio: '1'
              })
            } else if (i.weight == 1) {
              this.setData({
                radio: '2'
              })
            } else if (i.weight == 1.5) {
              this.setData({
                radio: '3'
              })
            } else if (i.weight == 2) {
              this.setData({
                radio: '4'
              })
            }
          }
        })
      }
      console.log('+++++++++++++++++')
      console.log('+++++++++++++++++')
      console.log('+++++++++++++++++')
      console.log('+++++++++++++++++')

      console.log('isBack: ', this.data.isBack)
      this.setData({
        checkIndex: idx,
        formInline: formInline,
        isBack: true
      })
      console.log('isBack: ', this.data.isBack)

      // if(app.globalData.formInline ){
      //   console.log('我进来了嘛')
      //   this.setData({
      //     formInline: app.globalData.formInline
      //   })
      // }
      console.log('app.globalData.formInline: ', app.globalData.formInline)
      if (app.globalData.formInline.length > 1) {
        let formInline = app.globalData.formInline;
        formInline = formInline.filter((i, j) => {
          return (i.name && i.weight && i.volume)
        })
        app.globalData.formInline = formInline
        if (formInline.length == 0) {
          formInline = [{
            name: '',
            weight: '',
            volume: '',
            flag: false
          }]
        }
        this.setData({
          formInline: formInline
        })
        console.log('app.globalData.formInline: ', app.globalData.formInline)
        console.log('data.formInline: ', this.data.formInline)


      }

    },
    hide: function () {
      // 页面被隐藏
      console.log('页面被隐藏')
      // if(app.globalData.formInline.length >1){
      //   let formInline = app.globalData.formInline;
      //   formInline = formInline.filter((i , j)=>{
      //     return ( i.name && i.weight && i.volume)
      //   })
      //   app.globalData.formInline = formInline
      // }

    },
    resize: function (size) {
      // 页面尺寸变化
    }
  }

})