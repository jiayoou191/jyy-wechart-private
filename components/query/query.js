import country from '../../utils/locales/zh/country'
import country_en from '../../utils/locales/en/country'

import * as util from '../../utils/help'
import {
  watch
} from "../../utils/watcher"
import {
  getSystemInfoAPI
} from '../../utils/help';
let app = getApp()




Component({


  /**
   * 组件的属性列表
   */
  properties: {
    allPlan: Array,
    needPlan: Object,
    query: Object,
    currency: {
      type: String,
      value: 'CNY'
    },
    planChooseIndex: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    AllPlan: null,
    NeedPlan: null,
    clickIndex: 0,
    price: 0,
    currency: "CNY",
    Query: null,
    padding_bottom: null,
    windowHeight: 800,
    windowWidth: 0,
    dialogShow: false, //! 注意事项
    attentionContent: [],
    languageName: app.globalData.language,
    languageFlag: '中文',
    country: app.globalData.language == '中文' ? country : country_en,
    language: app.globalData.language == '中文' ? require('../../utils/locales/zh/query').default : require('../../utils/locales/en/query').default,
    languageBase: app.globalData.language == '中文' ? require('../../utils/locales/zh/base').default : require('../../utils/locales/en/base').default,
    attentionContents: {
      shipper: [],
      consignee: [],
      Express: []
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    calculateStage(allPlan) {
      // let AllPlan = this.data.AllPlan;
      let AllPlan = allPlan;

      AllPlan.map(i => {
        if (i.transportType != 'Express') {
          i['stage1PlanPrice'] = {};
          i['stage2PlanPortFee'] = {}
          i['stage2PlanDocument'] = {}
          i['stage2PlanCutums'] = {}
          i['stage5PlanPrice'] = {}
          i['stage4PlanPortFee'] = {}
          i['stage4PlanDocument'] = {}
          i['stage4PlanCutums'] = {}
          i['stage3PlanPrice'] = {}

          if (i.stage1Plan && i.stage1Plan.priceSummary) {
            i['stage1PlanPrice'] = util.setState2and4Allfunc(
              i.stage1Plan.priceSummary.processorResult,
              "PortDeliveryFee"
            );
          }
          if (i.stage2Plan && i.stage2Plan.priceSummary) {
            i['stage2PlanPortFee'] = util.setState2and4Allfunc(
              i.stage2Plan.priceSummary.processorResult,
              "PortFee"
            );
            i['stage2PlanDocument'] = util.setState2and4Allfunc(
              i.stage2Plan.priceSummary.processorResult,
              "DocumentationAndServiceFees"
            );
            i['stage2PlanCutums'] = util.setState2and4Allfunc(
              i.stage2Plan.priceSummary.processorResult,
              "CustomsClearanceAndManifestFees"
            );
          }
          if (i.stage3Plan && i.stage3Plan.priceSummary) {
            // console.log('第三段价格:' ,i.stage3Plan)
            i.stage3PlanPrice['value'] = i.stage3Plan.priceSummary.value;
            console.log('i.stage3PlanPrice: ', i.stage3PlanPrice)
          }
          if (i.stage5Plan && i.stage5Plan.priceSummary) {
            i['stage5PlanPrice'] = util.setState2and4Allfunc(
              i.stage5Plan.priceSummary.processorResult,
              "PortDeliveryFee"
            );
          }
          if (i.stage4Plan && i.stage4Plan.priceSummary) {
            i['stage4PlanPortFee'] = util.setState2and4Allfunc(
              i.stage4Plan.priceSummary.processorResult,
              "PortFee"
            );
            i['stage4PlanDocument'] = util.setState2and4Allfunc(
              i.stage4Plan.priceSummary.processorResult,
              "DocumentationAndServiceFees"
            );
            i['stage4PlanCutums'] = util.setState2and4Allfunc(
              i.stage4Plan.priceSummary.processorResult,
              "CustomsClearanceAndManifestFees"
            );
          }
        }
      })
      console.log('AllPlan: ', AllPlan)
      console.log('AllPlan[0]: ', AllPlan[0].stage1PlanPrice)
      this.setData({
        AllPlan: AllPlan
      })
    },
    handleChangeBox() {
      console.log(12345)
      this.triggerEvent('onClick');

    },
    handlePlanChoose() {
      this.triggerEvent('onPlanChoose');
    },
    handleTabChange(e) {
      console.log('e: ', e)
      let price = Number(this.properties.allPlan[e.detail.index].priceValueDisplay)
      console.log('++++++++++++++++++++++')
      console.log('price变化钱: ', price)
      price = Math.floor(price * 100) / 100
      console.log('price变化后: ', price)
      this.setData({
        price: price,
        clickIndex: e.detail.index,
        NeedPlan: this.data.AllPlan[e.detail.index]
      });
      this.triggerEvent('onTabChange', e.detail.index)
    },
    handleSubmit() {
      console.log('clickIndex: ', this.data.clickIndex)
      this.triggerEvent('onKeFuHelp', this.data.AllPlan[this.data.clickIndex]);
    },
    contact() {
      console.log('1222')
    },
    handleCreate(e) {
      // console.log('e!!!: '   ,e)
      // console.log('planid:' , e.detail)
      this.triggerEvent('onCreate', e.detail)
      // let formData = new FormData();

      // formData.append("plan_id", plan_id);
      // formData.append("query_id", query_id);
      // formData.append("transport_type", transportType);
    },
    handleAttention(e) {
      console.log('问题1')
      this.setData({
        dialogShow: true
      })
      console.log(e)
      let name = e.currentTarget.dataset.name;
      let item = e.currentTarget.dataset.item
      let attentionContent = []
      if (name == 2) {
        if (item.stage1Plan) {
          if (item.stage1Plan.attention) {
            attentionContent.push(item.stage1Plan.attention)
          }
          if (item.stage1Plan.remark) {
            attentionContent.push(item.stage1Plan.remark)
          }
        }
        if (item.stage2Plan) {
          if (item.stage2Plan.attention) {
            attentionContent.push(item.stage2Plan.attention)
          }
          if (item.stage2Plan.remark) {
            attentionContent.push(item.stage2Plan.remark)
          }
        }
        // attentionContent = this.data.attentionContents.shipper;
      }
      if (name == 5) {
        if (item.stage4Plan) {
          if (item.stage4Plan.attention) {
            attentionContent.push(item.stage4Plan.attention)
          }
          if (item.stage4Plan.remark) {
            attentionContent.push(item.stage4Plan.remark)
          }
        }
        if (item.stage5Plan) {
          if (item.stage5Plan.attention) {
            attentionContent.push(item.stage5Plan.attention)
          }
          if (item.stage5Plan.remark) {
            attentionContent.push(item.stage5Plan.remark)
          }
        }
        console.log('attention:', attentionContent)
        // attentionContent = this.data.attentionContents.consignee;
      }
      if (name == 3) {
        // ! 国际快递的注意事项
        console.log('-------------国际快递的注意事项', item);
        if (item.productDetail) {
          attentionContent.push(item.productDetail)
        }
        if (item.location) {
          attentionContent.push(item.location)
        }
      }
      else if (name == 6) {
        if (item.stage3Plan.remark) {
          attentionContent.push(item.stage3Plan.remark)
        }
        if (item.stage3Plan.attention) {
          attentionContent.push(item.stage3Plan.attention)
        }
      }
      this.setData({
        attentionContent: attentionContent
      })
      console.log('attentionContent:!!!!! ', attentionContent)
    },
    handleDialogClose() {
      this.setData({
        dialogShow: false
      })
    },
    currencyChange(currency) {
      this.triggerEvent('currencyChange', currency);
    }
  },

  attached: function () {
    // console.log('12345')
    // console.log('query 组件内:  ' , this.properties);
    if (this.data.languageFlag != app.globalData.language) {
      this.setData({
        country: app.globalData.language == '中文' ? country : country_en,
        languageName: app.globalData.language,
        languageFlag: app.globalData.language,
        language: app.globalData.language == '中文' ? require('../../utils/locales/zh/query').default : require('../../utils/locales/en/query').default,
        languageBase: app.globalData.language == '中文' ? require('../../utils/locales/zh/base').default : require('../../utils/locales/en/base').default
      })
    }
  },
  getRect() {
    wx.createSelectorQuery().select('.stage3Content').boundingClientRect(function (rect) {
      // rect.id      // 节点的ID
      // rect.dataset // 节点的dataset
      // rect.left    // 节点的左边界坐标
      // rect.right   // 节点的右边界坐标
      // rect.top     // 节点的上边界坐标
      // rect.bottom  // 节点的下边界坐标
      // rect.width   // 节点的宽度
      // rect.height  // 节点的高度
      console.log('------------rect', rect);
    }).exec();
  },
  ready: async function () {
    try {
      let res = await getSystemInfoAPI();
      console.log('res:  ', res);
      let {
        windowHeight,
        windowWidth,
      } = res;
      // ! 全部转成px单位进行计算
      let goodsHeight = util.rpx2Px(180, windowWidth);
      let titleHeight = util.rpx2Px(88, windowWidth);
      let submitHeight = util.rpx2Px(112, windowWidth);
      this.setData({
        windowHeight: windowHeight - (goodsHeight + titleHeight + submitHeight),
        windowWidth: windowWidth
      })
    } catch (e) {
      console.log('-----------获取设备信息异常', e);
    }
    // console.log('windowHeight: '  ,windowHeight)
    // console.log('query 组件内 需要的:  ', this.properties.allPlan);
    // console.log('query 组件内 需要的:  ', this.data.Query);
    let price = Number(this.properties.allPlan[this.properties.needPlan.index].priceValueDisplay)
    price = Math.floor(price * 100) / 100
    this.properties.allPlan.map(i => {
      if (i.transportType == 'Express') {
        i['CURRENCY'] = i.currency;
      }
    })
    this.setData({
      AllPlan: [...this.properties.allPlan],
      NeedPlan: {
        ...this.properties.needPlan.needPlan
      },
      clickIndex: this.properties.needPlan.index,
      price: price,
      Query: {
        ...this.properties.query
      }
    })
    // this.calculateStage()
    this.calculateStage(this.data.AllPlan)

    watch(this, {
      allPlan: function (newValue) {
        // clickIndex
        // console.log('我进来变化了allPlan', newValue)
        let index = 999;
        newValue.map((i, j) => {
          if (i.planCardType == "Shipping") {
            index = j
          }
          if (i.transportType == 'Express') {
            i['CURRENCY'] = i.currency;
            // console.log('国际快递的价格变化:id : ' ,  i.id)
            // console.log('国际快递的价格变化:' ,  i.priceValueDisplay)

          }
        })
        console.log('clickIndex: ', this.data.clickIndex)
        let price = Number(newValue[this.data.clickIndex].priceValueDisplay)
        price = Math.floor(price * 100) / 100
        this.setData({
          AllPlan: [...newValue],
          // clickIndex: index,
          NeedPlan: newValue[index],
          price: price
        })
        this.calculateStage(newValue)
        let planWhitchChoose = app.globalData.planWhitchChoose
        console.log('----------planWhitchChoose: ' ,  planWhitchChoose)
        if(planWhitchChoose == 'box'){
          //! 如果是切换箱型 自动定位到 海运
          let setIndex = 999
          newValue.map((i,j)=>{
            console.log('i: ' ,  i)
            if(i.planCardType == 'Shipping'){
              setIndex =j
            }
          })
          this.setData({
            clickIndex : setIndex
          })
        }

      },
      query: function (newValue) {
        // console.log('我进来变化了！query', newValue)
        this.setData({
          Query: {
            ...newValue
          }

        })
      },
      needPlan: function (newValue) {
        // console.log('我进来变化了！query', newValue);
        console.log('---query组件----needPlan改变了', newValue);
        this.setData({
          NeedPlan: { ...newValue }
        });
      },

    })

  }
})