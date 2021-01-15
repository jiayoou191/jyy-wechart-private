// components/planChoose/planChoose.js
import {
  watch
} from "../../utils/watcher"
import getSymbolFromCurrency from "currency-symbol-map";

let app = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShow: {
      type: Boolean,
      value: false
    },
    allPlan: {
      type: Array,
      value: []
    },
    needPlan: {
      type: Object,
      value: {}
    },
    checkIndex: {
      type: Number,
      value: 999
    },
    currency: {
      type: String,
      value: 'CNY'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    optionalPlans: null,
    planChoose: [],
    NeedPlan: null,
    languageFlag: '中文',
    languageName: app.globalData.language,
    language: app.globalData.language == '中文' ? require('../../utils/locales/zh/detail').default : require('../../utils/locales/en/detail').default
  },

  /**
   * 组件的方法列表
   */
  attached: function () {
    if (this.data.languageFlag != app.globalData.language) {
      this.setData({
        languageName: app.globalData.language,
        languageFlag: app.globalData.language,
        language: app.globalData.language == '中文' ? require('../../utils/locales/zh/detail').default : require('../../utils/locales/en/detail').default
      })
    }
  },
  ready() {
    let optionalPlans = app.globalData.optionalPlans
    this.setData({
      optionalPlans: optionalPlans
    })


    let needPlan = this.properties.needPlan.needPlan;
    this.getPlanChoose(needPlan)
    this.setData({
      NeedPlan: needPlan,
      checkIndex: this.properties.needPlan.index
    })
    let planChoose = this.ComparePriceTransitTime(this.data.NeedPlan, this.data.planChoose)
    this.setData({
      planChoose: planChoose
    });
    watch(this, {
      checkIndex: function (newValue) {

        let needPlan = JSON.parse(JSON.stringify(app.globalData.allPlan[newValue]))
        let optionalPlans = JSON.parse(JSON.stringify(app.globalData.optionalPlans))
        this.setData({
          optionalPlans: optionalPlans
        })
        this.getPlanChoose(needPlan);
        this.setData({
          NeedPlan: needPlan
        })
        let planChoose = this.ComparePriceTransitTime(this.data.NeedPlan, this.data.planChoose)
        this.setData({
          planChoose: planChoose
        })
      },
      allPlan(newValue) {
        let optionalPlans = app.globalData.optionalPlans;
        this.setData({
          optionalPlans: optionalPlans,
        })
        let index = 999
        if (this.data.checkIndex == 999) {
          index = 0
        } else {
          index = this.data.checkIndex
        }
        this.getPlanChoose(newValue[index])
        let planChoose = this.ComparePriceTransitTime(newValue[index], this.data.planChoose)
        this.setData({
          planChoose: planChoose,
          NeedPlan: newValue[index],
          optionalPlans: optionalPlans,
        })
      },

      needPlan(newValue) {
        console.log('-------needPlan改变了', newValue);
        this.setData({
          NeedPlan: { ...newValue }
        });
      }
    })
  },
  methods: {
    handleOk() {
      this.triggerEvent('onOk')
      console.log('optionalPlans: ', this.data.optionalPlans)

    },
    handleCancel() {
      this.triggerEvent('onCancel')
    },
    handleClick({
      currentTarget
    }) {
      console.log('currentTarget: ', currentTarget.dataset)
      let index = currentTarget.dataset.index;
      let item = currentTarget.dataset.item
      this.setData({
        NeedPlan: { ...item }
      })
      let planChoose = this.ComparePriceTransitTime(this.data.NeedPlan, this.data.planChoose)
      this.setData({
        planChoose: planChoose
      })
      this.triggerEvent('onChoose', { item: item, index: index })

    },
    getPlanChoose(needPlan) {
      //! 将所有方案录入
      this.setData({
        planChoose: []
      })
      console.log('needPlan: ', needPlan.planCardType)
      if (needPlan.planCardType == "Railway") {
        console.log('Railway: ')
        if (this.data.optionalPlans.optionalRailPlans) {
          this.setData({
            planChoose: this.data.optionalPlans.optionalRailPlans
          })
        }

      } else if (needPlan.planCardType == "Air") {
        console.log('Air: ')
        if (this.data.optionalPlans.optionalAirPlans) {
          this.setData({
            planChoose: this.data.optionalPlans.optionalAirPlans
          })
        }

      } else if (needPlan.planCardType == "Shipping") {
        console.log('Shipping: ')
        if (this.data.optionalPlans.optionalShippingPlans) {
          this.setData({
            planChoose: this.data.optionalPlans.optionalShippingPlans
          })
        }

      } else if (needPlan.planCardType == "Express") {
        console.log('Express: ')
        if (this.data.optionalPlans.optionalExpressPlans) {
          this.setData({
            planChoose: this.data.optionalPlans.optionalExpressPlans
          })
        }

      }
      let planChoose = this.data.planChoose
      planChoose.map((i, j) => i['planChoose'] = `方案${j + 1}`)
      console.log('planChoose:    ', planChoose)
      this.setData({
        planChoose: planChoose
      })

    },
    ComparePriceTransitTime(needPlan, OptionalPlan) {
      //!航程天数比较
      if (!OptionalPlan) return;
      if (needPlan.transportType != "Express") {
        if (!needPlan.stage3TransitTime) return;
        if (needPlan.stage3TransitTime.indexOf('/') != -1) {
          needPlan['newTransitTime'] = needPlan.stage3TransitTime.toString().split("/")
        } else {
          needPlan['newTransitTime'] = needPlan.stage3TransitTime.toString().split("-")
        }
      } else {
        if (!needPlan.transitTime) return;
        if (needPlan.transitTime.indexOf('/') != -1) {
          needPlan['newTransitTime'] = needPlan.transitTime.toString().split("/")
        } else {
          needPlan['newTransitTime'] = needPlan.transitTime.toString().split("-")
        }
      }

      needPlan.newTransitTime.length == 1 ? needPlan['newTransitTime'] = needPlan.newTransitTime[0] : needPlan['newTransitTime'] = needPlan.newTransitTime[1]
      // needPlan.newTransitTime.length == 1
      //   ? this.$set(needPlan, "newTransitTime", needPlan.newTransitTime[0])
      //   : this.$set(needPlan, "newTransitTime", needPlan.newTransitTime[1]);
      needPlan['newPriceValueDisplay'] = Math.floor(needPlan.priceValueDisplay * 100) / 100
      // this.$set(
      //   needPlan,
      //   "newPriceValueDisplay",
      //   Math.floor(needPlan.priceValueDisplay * 100) / 100
      // );

      OptionalPlan.map(item => {
        //第一个选择的是什么
        // item.id == needPlan.id
        //计算航程天数

        if (needPlan.transportType != "Express") {
          item['newTransitTime'] = item.stage3TransitTime.toString().split("-")
          // this.$set(
          //   item,
          //   "newTransitTime",
          //   item.stage3TransitTime.toString().split("-")
          // );
        } else {
          item['newTransitTime'] = item.transitTime.toString().split("-")
          // this.$set(
          //   item,
          //   "newTransitTime",
          //   item.transitTime.toString().split("-")
          // );
        }
        item.newTransitTime.length == 1 ? item.newTransitTime = item.newTransitTime[0] : item.newTransitTime = item.newTransitTime[1]

        // item.newTransitTime.length == 1
        //   ? this.$set(item, "newTransitTime", item.newTransitTime[0])
        //   : this.$set(item, "newTransitTime", item.newTransitTime[1]);
        item['compareTransitTime'] = item.newTransitTime - needPlan.newTransitTime;
        // this.$set(
        //   item,
        //   "compareTransitTime",
        //   item.newTransitTime - needPlan.newTransitTime
        // );
        item.compareTransitTime >= 0 ?
          (item.compareTransitTime = "+" + item.compareTransitTime) :
          item.compareTransitTime;
        //计算总价格
        // item.priceValueDisplay = Math.floor(item.priceValueDisplay * 100) / 100;
        item['newPriceValueDisplay'] = Math.floor(item.priceValueDisplay * 100) / 100;
        // this.$set(
        //   item,
        //   "newPriceValueDisplay",
        //   Math.floor(item.priceValueDisplay * 100) / 100
        // );
        item['comparePrice'] = item.newPriceValueDisplay - needPlan.newPriceValueDisplay
        // this.$set(
        //   item,
        //   "comparePrice",
        //   item.newPriceValueDisplay - needPlan.newPriceValueDisplay
        // );
        item['comparePriceColor'] = item.newPriceValueDisplay - needPlan.newPriceValueDisplay
        // this.$set(
        //   item,
        //   "comparePriceColor",
        //   item.newPriceValueDisplay - needPlan.newPriceValueDisplay
        // );

        let idx = item.comparePrice.toString().indexOf(".");
        item.comparePrice = Math.floor(item.comparePrice)

        if (item.comparePrice >= 0) {
          item.comparePrice =
            "+" + getSymbolFromCurrency(item.currency) + item.comparePrice;
        } else {
          item['comparePrice'] = needPlan.newPriceValueDisplay - item.newPriceValueDisplay
          // this.$set(
          //   item,
          //   "comparePrice",
          //   needPlan.newPriceValueDisplay - item.newPriceValueDisplay
          // );
          item.comparePrice =
            "-" +
            getSymbolFromCurrency(item.currency) +
            Math.floor(item.comparePrice * 100) / 100;
        }

        //判断方案是否为当前方案
        // item.id == needPlan.id
        //   ? this.$set(item, "comparePlanId", "当前选择方案")
        //   : this.$set(item, "comparePlanId", "别的方案");
      });

      return OptionalPlan;
      // }
      // else{

      // }
    }
  },

})