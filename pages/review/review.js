import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
import * as util from '../../utils/help';
// pages/review.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 当前方案价格
    price: 0,
    // 当前方案
    needPlan: null,
    // 货物类型
    formType: null,
    // 所有货物信息
    formInline: null,
    // 出发地址
    addressFrom: null,
    // 目的地址
    addressTo: null,
    // 运输方式
    transportType: '',
    // 图标路径
    iconUrl: '',
    // 出发港
    pol: "",
    // 目的港
    pod: "",
    // 备注信息
    remarks: '',
    // 备注详情展示控制
    showRemarks: false,
    // 模态框展示控制
    modalShow: false,
    // 模态框类型
    modalType: 'goods',
    // 贸易条款类型
    // tradeTerms: ['不选择', 'EXW', 'FOB', 'CFR', 'CIF', 'DAP', 'DDP'],
    tradeTerms: [ 'EXW', 'FOB', 'CFR', 'DAP'],

    // 当前选中的贸易条款
    tradeTermsSlected: 'DAP',
    // 输入货物总价滑动控制(none:不进行滑动或者恢复初始状态,left:左滑动)
    tradeTermsSliper: 'none',
    // 所有费用
    prices: {
      startProt: 0,
      portToPort: 0,
      endPort: 0
    },
    // 贸易条款表单数据
    formData: {
      'CIF': '',
      'DDP': []
    },
    timer: null , //! 定时器 
    priceSubmitZindex: false,
    // ! 上次选择好的条款,用于用户选择条款的异常恢复,也可以理解为当前真正选择的贸易条款
    lastTradeTermsSlected: 'DAP',
    // 货物类型
    formType: null,
    windowHeight: 0,
    languageFlag: '中文',
    languageName: app.globalData.language,
    language: app.globalData.language == '中文' ? require('../../utils/locales/zh/review').default : require('../../utils/locales/en/review').default,
    typelanguage: app.globalData.language == '中文' ? require('../../utils/locales/zh/itemtype').default : require('../../utils/locales/en/itemtype').default,
    baselanguage: app.globalData.language == '中文' ? require('../../utils/locales/zh/base').default : require('../../utils/locales/en/base').default,
    languageCountry: app.globalData.language == '中文' ? require('../../utils/locales/zh/country') : require('../../utils/locales/en/country'),
    goodsShow: false,
    currency: app.globalData.currency,

    priceChange: false, //! 价格是否有变化 无论是true false 都可 每次变化后需要取反 传递给 pricesubmit通知他修改价格
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var app = getApp();
    let pageTitle = '订单确认';
    if (app.globalData.language != '中文') {
      pageTitle = 'Order confirmation';
    }
    wx.setNavigationBarTitle({
      title: pageTitle
    });
    this.setData({
      windowHeight: app.globalData.windowHeight
    });
    if (app.globalData.needPlan.transportType != "Express") {
      this.setNormalData();
    } else {
      console.log("全局变量", app.globalData);
      let {
        needPlan,
        price,
        formInline,
        query,
      } = app.globalData;
      let {
        col,
        cod
      } = needPlan;
      let transportType = "国际快递";
      let iconUrl = '/pages/image/icon/icon-express.png';
      let remarks = '';
      if (needPlan.plan.remark != null) {
        remarks += needPlan.plan.remark + '\n';
      }
      if (needPlan.plan.attention != null) {
        remarks += needPlan.plan.attention + '\n';
      }
      if (needPlan.productDetail != null) {
        remarks += needPlan.productDetail + '\n';
      }
      if (needPlan.location != null) {
        remarks += needPlan.location + '\n';
      }
      this.setData({
        needPlan,
        price,
        transportType,
        iconUrl,
        addressFrom: col,
        addressTo: cod,
        formInline,
        formType: query.itemType,
        remarks,
      });
    }
  },
  // 普通运输方式数据处理封装
  setNormalData() {
    var app = getApp();
    let {
      price,
      needPlan,
      formInline,
      formType,
      addressFrom,
      addressTo,
    } = app.globalData;
    console.log('进入订单确认页面时的全局变量', app.globalData);
    let transportType = app.globalData.needPlan.transportType;
    let iconUrl = '';
    let ports = [];
    let pol = app.globalData.needPlan.pol;
    let pod = app.globalData.needPlan.pod;
    let remarks = '';
    let tradeTerms = [];
    //! 英文版  用中文  ，  中文版 用中文
    if (app.globalData.language == '中文') {
      for (let i = 1; i < 6; i++) {
        let key = 'stage' + i + 'Plan';
        remarks += needPlan[key].remark + needPlan[key].attention;
        if (needPlan[key].priceSummary) {
          let PortDeliveryFee = util.setState2and4AllfuncZh(
            needPlan[key].priceSummary.processorResult,
            "PortDeliveryFee"
          );
          if (PortDeliveryFee.children.length > 0) {
            needPlan[key].PortDeliveryFee = PortDeliveryFee;
          }
          let PortFee = util.setState2and4AllfuncZh(
            needPlan[key].priceSummary.processorResult,
            "PortFee"
          );
          if (PortFee.children.length > 0) {
            needPlan[key].PortFee = PortFee;
          }
          let DocumentationAndServiceFees = util.setState2and4AllfuncZh(
            needPlan[key].priceSummary.processorResult,
            "DocumentationAndServiceFees"
          );
          if (DocumentationAndServiceFees.children.length > 0) {
            needPlan[key].DocumentationAndServiceFees = DocumentationAndServiceFees;
          }
          let CustomsClearanceAndManifestFees = util.setState2and4AllfuncZh(
            needPlan[key].priceSummary.processorResult,
            "CustomsClearanceAndManifestFees"
          );
          if (CustomsClearanceAndManifestFees.children.length > 0) {
            needPlan[key].CustomsClearanceAndManifestFees = CustomsClearanceAndManifestFees;
          }
        }
      }
    } else {
      for (let i = 1; i < 6; i++) {
        let key = 'stage' + i + 'Plan';
        remarks += needPlan[key].remark + needPlan[key].attention;
        if (needPlan[key].priceSummary) {
          let PortDeliveryFee = util.setState2and4Allfunc(
            needPlan[key].priceSummary.processorResult,
            "PortDeliveryFee"
          );
          if (PortDeliveryFee.children.length > 0) {
            needPlan[key].PortDeliveryFee = PortDeliveryFee;
          }
          let PortFee = util.setState2and4Allfunc(
            needPlan[key].priceSummary.processorResult,
            "PortFee"
          );
          if (PortFee.children.length > 0) {
            needPlan[key].PortFee = PortFee;
          }
          let DocumentationAndServiceFees = util.setState2and4Allfunc(
            needPlan[key].priceSummary.processorResult,
            "DocumentationAndServiceFees"
          );
          if (DocumentationAndServiceFees.children.length > 0) {
            needPlan[key].DocumentationAndServiceFees = DocumentationAndServiceFees;
          }
          let CustomsClearanceAndManifestFees = util.setState2and4Allfunc(
            needPlan[key].priceSummary.processorResult,
            "CustomsClearanceAndManifestFees"
          );
          if (CustomsClearanceAndManifestFees.children.length > 0) {
            needPlan[key].CustomsClearanceAndManifestFees = CustomsClearanceAndManifestFees;
          }
        }
      }
    }

    // 贸易条款内容控制
    if (transportType == 'ShippingFCL' || transportType == 'ShippingLCL') {
      // tradeTerms = ['不选择', 'EXW', 'FOB', 'CFR', 'CIF', 'DAP', 'DDP'];
      tradeTerms = [ 'EXW', 'FOB', 'CFR',  'DAP'];

    } else {
      tradeTerms = [ 'EXW', 'FCA起运港', 'CPT目的港',  'DAP'];
      // tradeTerms = ['不选择', 'EXW', 'FCA起运港', 'CPT目的港', 'CIP目的港', 'DAP', 'DDP'];

    }
    // 运输方式和图标控制
    switch (transportType) {
      case "ShippingFCL": {
        transportType = 'ShippingFCL';
        iconUrl = '/pages/image/icon/icon-shipping.png';
        break;
      }
      case "Air": {
        transportType = 'Air';
        iconUrl = '/pages/image/icon/icon-air_go.png';
        break;
      }
      case "ShippingLCL": {
        transportType = 'ShippingLCL';
        iconUrl = '/pages/image/icon/icon-shipping.png';
        break;
      }
      case "RailwayFCL": {
        transportType = 'RailwayFCL';
        iconUrl = '/pages/image/icon/icon-railway.png';
        break;
      }
      case "RailwayLCL": {
        transportType = 'RailwayLCL';
        iconUrl = '/pages/image/icon/icon-railway.png';
        break;
      }
    }
    // 费用统计
    let prices = {
      startPort: Math.ceil(needPlan.stage1Plan.sameCurrencySummary.value + needPlan.stage2Plan.sameCurrencySummary.value),
      portToPort: Math.ceil(needPlan.stage3Plan.sameCurrencySummary.value),
      endPort: Math.ceil(needPlan.stage4Plan.sameCurrencySummary.value + needPlan.stage5Plan.sameCurrencySummary.value),
    };
    this.setData({
      price,
      needPlan,
      formInline,
      formType,
      transportType,
      addressFrom,
      addressTo,
      iconUrl,
      pol,
      pod,
      remarks,
      tradeTerms,
      prices,
      buyerFee: price
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  // 展示模态框
  showModal(event) {
    console.log('event', event);
    this.setData({
      modalShow: true,
      modalType: event.currentTarget.dataset.modaltype,
      priceSubmitZindex: event.currentTarget.dataset.modaltype == 'sellerFee'
    });
  },
  showGoodsInfo() {
    if (this.data.formInline.length <= 1) {
      return false;
    }
    this.setData({
      goodsShow: true
    });
  },
  handleClose() {
    this.setData({
      goodsShow: false
    });
  },
  // 关闭模态框
  onModalClose() {
    let {
      tradeTermsSlected,
      lastTradeTermsSlected,
      formData
    } = this.data;
    if ((tradeTermsSlected == 'CIF' || tradeTermsSlected == 'CIP目的港') && formData['CIF'] == '') {
      tradeTermsSlected = lastTradeTermsSlected;
    } else if (tradeTermsSlected == 'DDP' && !this.checkFormData(formData['DDP'])) {
      tradeTermsSlected = lastTradeTermsSlected;
    }
    this.setData({
      priceChange: !this.data.priceChange,
      modalShow: false,
      tradeTermsSliper: 'none',
      tradeTermsSlected,
    });
    setTimeout(() => {
      this.setData({
        priceSubmitZindex: false
      });
    }, 500);

  },
  // 展示完整备注信息
  showRemarks() {
    let message = ''
    if (app.globalData.language == "中文") {
      message = '确定'
    } else {
      message = 'OK'
    }
    Dialog.alert({
      message: this.data.remarks,
      messageAlign: 'left',
      confirmButtonText: message
    });
  },
  // 贸易条款切换
  tradeTermsSlected(event) {
    //TODO
    console.log('???????')
    console.log('???????')
    console.log('???????')
    console.log('???????')
    let {
      code
    } = event.currentTarget.dataset;
    if (code === 'DDP' || code === 'CIF' || code === 'CIP目的港') {
      // 如果选择了DDP切换到货物总价、关税、增值税输入界面,如果选择了CIF切换到货物总价输入界面
      // 设置表单结构
      if (code === 'DDP') {
        let formData = this.data.formData;
        if (formData['DDP'].length == 0) {
          formData['DDP'] = [];
          this.data.formInline.map(item => {
            formData['DDP'].push({
              totalPrice: '',
              tariff: '',
              VAT: '',
              name: item.name,
              weight: item.weight,
              volume: item.volume,
            });
          });
        }
        this.setData({
          tradeTermsSliper: 'left',
          tradeTermsSlected: code,
          formData,
        });
      } else {
        this.setData({
          tradeTermsSliper: 'left',
          tradeTermsSlected: code,
        });
      }
    }
    this.setData({
      tradeTermsSlected: code,
    });
    if (code == '不选择') {
      this.setData({
        lastTradeTermsSlected: code,
        modalShow: false,
      });
      return;
    }
    if (code != 'DDP' && code != 'CIF' && code != 'CIP目的港') {
      this.setData({
        lastTradeTermsSlected: code,
        modalType: 'sellerFee',
        priceSubmitZindex: true
      });
    }
    app.globalData.incoterms = this.data.lastTradeTermsSlected;
    this.setData({
      priceChange: !this.data.priceChange,
    });
    console.log('在这里就设置完了')
  },
  // 由货物总价、关税、增值税输入界面返回到贸易条款选择界面
  tradeTermsSliperBack() {
    this.setData({
      tradeTermsSliper: 'none'
    });
  },
  // 贸易条款关税增值税设置完毕
  tradeTermsPriceConfirm() {
    if (this.data.tradeTermsSlected === 'DDP') {
      if (this.checkFormData(this.data.formData['DDP'])) {
        this.setData({
          showRemarks: true,
          modalType: 'sellerFee',
          tradeTermsSliper: 'none',
          lastTradeTermsSlected: this.data.tradeTermsSlected,
          priceSubmitZindex: true
        });
      } else {
        let message = ''
        if (app.globalData.language == '中文') {
          message = '请填写正确完整的DDP!'
        } else {
          message = 'Please fill in the correct and complete DDP!'
        }
        Notify({
          type: 'danger',
          message: message
        });
      }
    } else {
      if (!/^\d+(.\d+)?$/.test(this.data.formData['CIF'])) {
        let message = ''
        if (app.globalData.language == '中文') {
          message = '请填写正确完整的CIF!'
        } else {
          message = 'Please fill in the correct and complete CIF!'
        }
        Notify({
          type: 'danger',
          message: message
        });
      } else {
        this.setData({
          showRemarks: true,
          tradeTermsSliper: 'none',
          priceSubmitZindex: true,
          modalType: 'sellerFee',
          lastTradeTermsSlected: this.data.tradeTermsSlected,
        });
      }
    }
   
  },
  // 贸易条款表单数据改变
  changePriceItem(event) {
    if (this.data.tradeTermsSlected === 'DDP') {
      console.log("此时应该将新的数值赋值给对应字段");
      let {
        formData
      } = this.data;
      let {
        index,
        priceItem
      } = event.currentTarget.dataset;
      formData['DDP'][index][priceItem] = event.detail.value;
      this.setData({
        formData
      });
    } else {
      let {
        formData
      } = this.data;
      formData['CIF'] = event.detail.value;
      this.setData({
        formData
      });
    }
  },
  // 检测数组数据是否正常
  checkFormData(array) {
    let success = true;
    array.map(item => {
      if (item.totalPrice === '' || item.tariff === '' || item.VAT === '') {
        success = false;
      }
      if (!/^\d+(.\d+)?$/.test(item.totalPrice) || !/^\d+(.\d+)?$/.test(item.tariff) || !/^\d+(.\d+)?$/.test(item.VAT)) {
        success = false;
      }
    });
    return success;
  },
  // 展示买家和卖家价格
  priceDetailShow() {
    // let timer = null;
    console.log('modalShow: '  , this.data.modalShow)
    if (this.data.modalShow) {
      this.setData({
        modalShow: false,
        modalType: 'sellerFee',
      });
      this.setData({
        timer: setTimeout(()=>{
          this.setData({
            priceSubmitZindex: false
          });
        },500)
      })
      // this.data.timer = setTimeout(() => {
      //   this.setData({
      //     priceSubmitZindex: false
      //   });
      // }, 500);

    } else {
      clearTimeout(this.data.timer)
      this.setData({
        modalShow: true,
        modalType: 'sellerFee',
        priceSubmitZindex: true
      });
      console.log('priceSubmitZindex: '  ,  this.data.priceSubmitZindex)
    }
  },
  handleTypeChoose(e){
    //TODO
    console.log('e: ' ,  e);
    // this.setData({
    //   isShipperOrConsignee: e.currentTarget.dataset.type
    // });
    app.globalData.isShipperOrConsignee = e.currentTarget.dataset.type;
    console.log('isShipperOrConsignee' , app.globalData.isShipperOrConsignee)
    // this.handleShipperVisibleClose();
    this.onModalClose();
  },
  // !创建订单
  handleCreate() {
    console.log("创建订单");
    let order_meta = {
      serviceType: this.data.tradeTermsSlected,
      dCategoryList: []
    };
    //! 这里需要不同方案 给不同的数值
    if (
      this.data.tradeTermsSlected == "EXW" ||
      this.data.tradeTermsSlected == "FOB" ||
      this.data.tradeTermsSlected == "CFR" ||
      this.data.tradeTermsSlected == "DAP"
    ) {
      order_meta.OrderDCategoryMetaJson = [];
    } else if (this.data.tradeTermsSlected == "CIF" || this.data.tradeTermsSlected == "CIP目的港") {
      let obj = {
        hscode: "",
        currency: this.data.currency,
        productValue: Number(this.data.formData['CIF']),
        insuranceRate: 1.5,
        minInsuranceValue: 100,
        importTaxRate: 0,
        valueAddedTaxRate: 0
      };
      order_meta.dCategoryList.push(obj);
    } else if (this.data.tradeTermsSlected == "DDP") {
      this.data.formData['DDP'].map(i => {
        // let tariff = i.tariff / 100;
        // let VAT = i.VAT / 100;
        let obj = {
          hscode: "",
          currency: this.data.currency,
          productValue: Number(i.totalPrice),
          insuranceRate: 0,
          minInsuranceValue: 0,
          importTaxRate: i.tariff,
          valueAddedTaxRate: i.VAT
        };
        order_meta.dCategoryList.push(obj);
      });
    }
    var app = getApp();
    app.globalData.order_meta = order_meta;
    wx.navigateTo({
      url: "/pages/bookPreview/bookPreview"
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      currency: app.globalData.currency,
      lastTradeTermsSlected: app.globalData.incoterms
    });
    if (this.data.languageFlag != app.globalData.language) {
      this.setData({
        languageFlag: app.globalData.language,
        languageName: app.globalData.language,
        language: app.globalData.language == '中文' ? require('../../utils/locales/zh/review').default : require('../../utils/locales/en/review').default,
        typelanguage: app.globalData.language == '中文' ? require('../../utils/locales/zh/itemtype').default : require('../../utils/locales/en/itemtype').default,
        baselanguage: app.globalData.language == '中文' ? require('../../utils/locales/zh/base').default : require('../../utils/locales/en/base').default,
        languageCountry: app.globalData.language == '中文' ? require('../../utils/locales/zh/country') : require('../../utils/locales/en/country'),
      })

    }


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var app = getApp();
    app.globalData.isSubmit = false;
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})