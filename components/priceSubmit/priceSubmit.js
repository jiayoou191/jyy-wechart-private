// components/priceSubmit/priceSubmit.js
import {
  watch
} from "../../utils/watcher"
import getSymbolFromCurrency from "currency-symbol-map";
let app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    price: Number,
    needPlan: Object,
    hasPriceDetail: {
      type: Boolean,
      value: false
    },
    priceModalShow: {
      type: Boolean,
      value: false
    },
    isSubmit: {
      type: Boolean,
      value: false
    },
    zIndex: {
      type: Boolean,
      value: false
    },
    currencySwitch: {
      type: Boolean,
      value: false
    },
    totalPrice: {
      type: Number,
      value: null
    },
    priceChange:{
      type: Boolean,
      value: false 
      //! 在review页 显示的收发货方价格是review页自己的
      //! 现在必须要通知到内部无论是true false 都可以 但是必须要监听到价格的变化
    }


  },

  /**
   * 组件的初始数据
   */
  data: {
    NeedPlan: null,
    languageFlag: '中文',
    currencies: app.globalData.currencies,
    currencyShow: false,
    currency: app.globalData.currency,
    isShipperOrConsignee: app.globalData.isShipperOrConsignee,
    incoterms: app.globalData.incoterms,
    shipperVisible: false,
    language: app.globalData.language == '中文' ? require('../../utils/locales/zh/detail').default : require('../../utils/locales/en/detail').default
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleClick() {
      console.log('needPlan: ', this.properties.needPlan)
      var app = getApp();
      app.globalData.price = this.data.price;
      app.globalData.needPlan = this.properties.needPlan;
      this.triggerEvent('onClick', this.properties.needPlan);
    },
    handleShipperChange(){
      //* 打开选择收发货方弹出框
      this.setData({
        zIndex:true,

        shipperVisible: true
      })
    },
    handleTypeChoose(e){
      console.log('e: ' ,  e);
      this.setData({
        isShipperOrConsignee: e.currentTarget.dataset.type
      });
      app.globalData.isShipperOrConsignee = this.data.isShipperOrConsignee;
      console.log('isShipperOrConsignee' , app.globalData.isShipperOrConsignee)
      this.handleShipperVisibleClose();
    },
    handleShipperVisibleClose(){
      //*关闭收发货方弹出框
      this.setData({
        zIndex:false,
        shipperVisible: false

      })
    },
    priceDetailShow() {
      if (!this.data.hasPriceDetail) {
        return false;
      }
      this.triggerEvent('priceDetailShow');
    },
    selectCurrency() {
      if (!this.data.currencySwitch) {
        return false;
      }
      this.setData({
        currencyShow: true
      });
    },
    handleCurrencyClose() {
      this.setData({
        currencyShow: false
      });
    },
    currencyChange(event) {
      this.handleCurrencyClose();
      app.globalData.currency = event.currentTarget.dataset.currency;
      this.setData({
        currency: event.currentTarget.dataset.currency
      });
      this.triggerEvent('currencyChange', event.currentTarget.dataset.currency);
    }
  },
  attached: function () {
    if (this.data.languageFlag != app.globalData.language) {
      this.setData({
        languageFlag: app.globalData.language,
        language: app.globalData.language == '中文' ? require('../../utils/locales/zh/detail').default : require('../../utils/locales/en/detail').default
      })
    }
  },
  pageLifetimes: {
    show: function() {
      // 页面被展示
      console.log('????????    submit页面');
      this.setData({
        isShipperOrConsignee: app.globalData.isShipperOrConsignee,
        incoterms: app.globalData.incoterms,
      })
      
    },
  
  },
  ready: function () {
    this.setData({
      NeedPlan: this.data.needPlan,
      currencies: app.globalData.currencies,
      currency: app.globalData.currency,
      isShipperOrConsignee: app.globalData.isShipperOrConsignee,
      incoterms: app.globalData.incoterms,
    });
    watch(this, {
      needPlan: function (newValue) {
        console.log('newValue!!!: ', newValue)
        let needPlan = newValue;
        // needPlan['CURRENCY'] = getSymbolFromCurrency(newValue.currency);
        needPlan['CURRENCY'] = newValue.currency;
        this.setData({
          NeedPlan: needPlan
        }, () => {
          console.log('********************NeedPlan', this.data.NeedPlan);
        })
      },
      priceChange:function(newValue){
        console.log('pricechange  了' ,newValue)
        console.log('app.globalData.isShipperOrConsignee',app.globalData.isShipperOrConsignee)
        console.log('incoterms: ' ,app.globalData.incoterms )
        this.setData({
          isShipperOrConsignee: app.globalData.isShipperOrConsignee,
          incoterms: app.globalData.incoterms,
        })
      }
 
      
    });

  }
})