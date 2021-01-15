// components/boxChoose/boxChoose.js
// import * as watch from "../../utils/watch"
// import * as watch from "../../utils/watch"
import {
  watch
} from "../../utils/watcher"
let app = getApp();


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: {
      type: Boolean,
      value: false
    },
    boxes: {
      type: Array,
      value: []
    },
    allPlan: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    BoxesStart: null,
    show: true,
    Boxes: [],
    formInline: {},
    languageFlag:'中文',
    languageName: app.globalData.language,
    language: app.globalData.language == '中文' ? require('../../utils/locales/zh/detail').default : require('../../utils/locales/en/detail').default
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleChange(event) {
      console.log(event)
      // let id = e.currentTarget.dataset.id
      console.log('id: ', event.currentTarget.dataset.id)
      let formInline = {}

      console.log('event: ', event.detail)
      console.log(this.data.Boxes)
      let Boxes = this.data.Boxes;
      Boxes.map(i => {
        if (i.id == event.currentTarget.dataset.id) {
          i[i.id] = event.detail
        }
        formInline[i.id] = i[i.id]
      })
      console.log('换算后')
      console.log('Boxes: ', Boxes)
      console.log('formInline: ', formInline)
      this.setData({
        formInline: formInline
      })
      // this.$set(this.formInline , i.id , i.boxNum)
    },
    handleOk() {
      console.log('this.data.formInline', this.data.formInline)
      this.triggerEvent('onOk', this.data.formInline);
      //*部分值恢复为默认
      app.globalData.isShipperOrConsignee = 'Shipper';
      app.globalData.incoterms = 'DAP';

    },
    handleCancel() {
      this.triggerEvent('onCancel');

    },
    onClose() {
      this.triggerEvent('onClose');
    }
  },

  attached: function () {
    if(this.data.languageFlag !=  app.globalData.language){
      this.setData({
        languageName: app.globalData.language,
        languageFlag: app.globalData.language,
        language: app.globalData.language == '中文' ? require('../../utils/locales/zh/detail').default : require('../../utils/locales/en/detail').default
      })
    }
  },


  ready: function () {
    // console.log('abcderg------------------------')
    // console.log('boxes: '   ,this.properties.boxes);
    let allPlan = this.properties.allPlan;
    // this.setData({
    //   BoxesStart: this.properties.boxes
    // })
    let boxes = this.properties.boxes;

    let shippingPlan = null
    let formInline = {}
    allPlan.map(item => {
      if (item.transportType == "ShippingFCL") {
        shippingPlan = item
      }
    })
    if (shippingPlan) {
      boxes.map(i => {
        shippingPlan.boxes.map(item => {
          //TODO  这里有存在问题 之前删除了  现在需要补全
          if (!i[i.id]) {
            i[i.id] = 0
          }
          if (i.id == item.boxDataEntry.id) {
            i[i.id] = item.number
          }
        })
      })
    }
    boxes.map(i => {
      formInline[i.id] = i[i.id]
    })

    // console.log('shippingPlan: '  ,shippingPlan)
    console.log('___________________________-')
    console.log('boxes: ', boxes)
    this.setData({
      Boxes: boxes,
      formInline: formInline
    })
    console.log('formInline: ', formInline)


    watch(this, {
      isShow: function (newVal) {
        console.log("newVal=====", newVal);
        console.log("this.data: ", this.data);
        if (!newVal) return false;
        // if(newVal){

        let formInline = {}
        let shippingPlan = null;
        let boxes = this.properties.boxes;
        let allPlan = this.data.allPlan;
        allPlan.map(item => {
          if (item.transportType == "ShippingFCL") {
            shippingPlan = item
          }
        });
        console.log("此处应该进行方案箱子数量修改");
        console.log("修改前的boxes：", boxes);
        console.log("应该修改成的boxes：", shippingPlan.boxes);
        if (shippingPlan) {
          boxes.map(i => {
            i[i.id] = 0;
            shippingPlan.boxes.map(item => {
              //TODO  这里有存在问题 之前删除了  现在需要补全
              // i[item.boxDataEntry.id] = item.number
              if (i.id == item.boxDataEntry.id) {
                i[i.id] = item.number
              }
            });
          });
        }
        console.log('修改之后的boxes：', boxes);
        boxes.map(i => {
          formInline[i.id] = i[i.id]
        })
        this.setData({
          Boxes: boxes,
          formInline: formInline
        });
        // }

      },
      allPlan: function (newVal) {
        console.log("allPlan在变化：！！！！！！！");

      }
    })
    // console.log('isShow: '  ,this.properties.isShow)

  },

})