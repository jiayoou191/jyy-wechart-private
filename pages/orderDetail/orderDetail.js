import * as util from '../../utils/help';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import moment from '../../utils/moment';
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_detail: null,
    modalShow: false,
    modalType: 'goods',
    remarks: '',
    prices: null,
    userItem: 'send',
    user_info_key: 'shipper',
    languageFlag: '中文',
    languageName: app.globalData.language,
    language: app.globalData.language == '中文' ? require('../../utils/locales/zh/order').default : require('../../utils/locales/en/order').default,
    languageBase: app.globalData.language == '中文' ? require('../../utils/locales/zh/base').default : require('../../utils/locales/en/base').default,
    languageType: app.globalData.language == '中文' ? require('../../utils/locales/zh/itemtype').default : require('../../utils/locales/en/itemtype').default,
    languageCountry: app.globalData.language == '中文' ? require('../../utils/locales/zh/country') : require('../../utils/locales/en/country'),
    goodsShow: false,
    currency: app.globalData.currency
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let pageTitle = '订单详情';
    if (app.globalData.language != '中文') {
      pageTitle = 'Order detail';
    }
    wx.setNavigationBarTitle({
      title: pageTitle
    });
    let order_detail = app.globalData.order_detail;
    console.log('order_detail: !!!@@@@@@@@@@@@@@@@@', order_detail)
    order_detail['createdAt'] = moment(order_detail.addedAt).format('YYYY-MM-DD HH:mm:ss');
    let shipperName = this.setUserName(order_detail.shipper.name);
    let consigneeName = this.setUserName(order_detail.consignee.name);
    let notifierName = this.setUserName(order_detail.notifier.name);
    let truckPlan = {
      one: null,
      five: null
    }
    if (order_detail.doorToPortPlan) {
      truckPlan.one = order_detail.doorToPortPlan.plan;
    }
    if (order_detail.portToDoorPlan) {
      truckPlan.five = order_detail.portToDoorPlan.plan;
    }
    await this.setData({
      order_detail,
      shipperName,
      consigneeName,
      notifierName,
      truckPlan
    });
    if (order_detail.transportType != 'Express') {
      this.setNormalData();
    } else {
      let {
        expressPlan,
      } = this.data.order_detail;
      let remarks = '';
      if (expressPlan.plan.remark != null) {
        remarks += expressPlan.plan.remark + '\n';
      }
      if (expressPlan.plan.attention != null) {
        remarks += expressPlan.plan.attention + '\n';
      }
      if (expressPlan.productDetail != null) {
        remarks += expressPlan.productDetail + '\n';
      }
      if (expressPlan.location != null) {
        remarks += expressPlan.location + '\n';
      }
      this.setData({
        remarks
      });
    }

  },
  // 普通运输方式数据处理封装
  setNormalData() {
    let {
      order_detail,
      truckPlan,
    } = this.data;
    let {
      plan,
    } = order_detail;
    let remarks = '';
    for (let i = 1; i < 6; i++) {
      let key = 'stage' + i + 'Plan';
      let stagePlan = plan[key];
      if (i == 1 && truckPlan && truckPlan.one) {
        stagePlan = truckPlan.one;
      }
      if (i == 5 && truckPlan && truckPlan.five) {
        stagePlan = truckPlan.five;
      }
      if (stagePlan) {
        remarks += stagePlan.remark + stagePlan.attention;
      }
      if (app.globalData.language == 'English') {
        if (stagePlan&&stagePlan.priceSummary) {
          let PortDeliveryFee = util.setState2and4Allfunc(
            stagePlan.priceSummary.processorResult,
            "PortDeliveryFee"
          );
          if (PortDeliveryFee.children.length > 0) {
            stagePlan.PortDeliveryFee = PortDeliveryFee;
          }
          let PortFee = util.setState2and4Allfunc(
            stagePlan.priceSummary.processorResult,
            "PortFee"
          );
          if (PortFee.children.length > 0) {
            stagePlan.PortFee = PortFee;
          }
          let DocumentationAndServiceFees = util.setState2and4Allfunc(
            stagePlan.priceSummary.processorResult,
            "DocumentationAndServiceFees"
          );
          if (DocumentationAndServiceFees.children.length > 0) {
            stagePlan.DocumentationAndServiceFees = DocumentationAndServiceFees;
          }
          let CustomsClearanceAndManifestFees = util.setState2and4Allfunc(
            stagePlan.priceSummary.processorResult,
            "CustomsClearanceAndManifestFees"
          );
          if (CustomsClearanceAndManifestFees.children.length > 0) {
            stagePlan.CustomsClearanceAndManifestFees = CustomsClearanceAndManifestFees;
          }
        }
      } else {
        if (stagePlan&&stagePlan.priceSummary) {
          let PortDeliveryFee = util.setState2and4AllfuncZh(
            stagePlan.priceSummary.processorResult,
            "PortDeliveryFee"
          );
          if (PortDeliveryFee.children.length > 0) {
            stagePlan.PortDeliveryFee = PortDeliveryFee;
          }
          let PortFee = util.setState2and4AllfuncZh(
            stagePlan.priceSummary.processorResult,
            "PortFee"
          );
          if (PortFee.children.length > 0) {
            stagePlan.PortFee = PortFee;
          }
          let DocumentationAndServiceFees = util.setState2and4AllfuncZh(
            stagePlan.priceSummary.processorResult,
            "DocumentationAndServiceFees"
          );
          if (DocumentationAndServiceFees.children.length > 0) {
            stagePlan.DocumentationAndServiceFees = DocumentationAndServiceFees;
          }
          let CustomsClearanceAndManifestFees = util.setState2and4AllfuncZh(
            stagePlan.priceSummary.processorResult,
            "CustomsClearanceAndManifestFees"
          );
          if (CustomsClearanceAndManifestFees.children.length > 0) {
            stagePlan.CustomsClearanceAndManifestFees = CustomsClearanceAndManifestFees;
          }
        }
      }
    }
    let startPortFee = 0;
    let endPortFee = 0;
    if (truckPlan && truckPlan.one) {
      startPortFee = Math.ceil(truckPlan.one.sameCurrencySummary.value + plan.stage2Plan.sameCurrencySummary.value);
    } else {
      if(plan.stage1Plan){
        startPortFee = Math.ceil(plan.stage1Plan.sameCurrencySummary.value + plan.stage2Plan.sameCurrencySummary.value);
      }
    }
    if (truckPlan && truckPlan.five) {
      endPortFee = Math.ceil(plan.stage4Plan.sameCurrencySummary.value + truckPlan.five.sameCurrencySummary.value);
    } else {
      if(plan.stage5Plan){
        endPortFee = Math.ceil(plan.stage4Plan.sameCurrencySummary.value + truckPlan.five.sameCurrencySummary.value);
      }
    }
    // 费用统计
    let prices = {
      startPort: startPortFee,
      portToPort: Math.ceil(plan.stage3Plan.sameCurrencySummary.value),
      endPort: endPortFee,
    };
    order_detail.plan = plan;
    this.setData({
      order_detail,
      remarks,
      prices
    });
  },
  showGoodsInfo() {
    if (this.data.order_detail.query.items.length <= 1) {
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
  onModalClose() {
    this.setData({
      modalShow: false
    });
  },
  showModal(event) {
    this.setData({
      modalShow: true,
      modalType: event.currentTarget.dataset.modaltype
    });
    if (event.currentTarget.dataset.modaltype == 'user') {
      let userItem = event.currentTarget.dataset.userItem;
      let user_info_key = '';
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!')
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!')
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!')
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!')
      console.log('userItem: ' , userItem)
      if (userItem == '发货人' || userItem == 'Shipper') {
        user_info_key = 'shipper';
      } else if (userItem == '收货人' || userItem == 'Consignee') {
        user_info_key = 'consignee';
      } else {
        user_info_key = 'notifier';
      }
      this.setData({
        userItem,
        user_info_key
      });
    }
  },
  // 展示完整备注信息
  showRemarks() {
    let confirmButtonText = ''
    if (app.globalData.language == '中文') {
      confirmButtonText = '确定'
    } else {
      confirmButtonText = 'OK'
    }
    Dialog.alert({
      message: this.data.remarks,
      messageAlign: 'left',
      confirmButtonText: confirmButtonText
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  setUserName(userName) {
    let beforeTxt = '';
    let afterTxt = '';
    if (userName.length <= 7) {
      beforeTxt = '';
      afterTxt = userName;
    } else {
      beforeTxt = userName.substring(0, userName.length - 6);
      afterTxt = userName.substring(userName.length - 6, userName.length);
    }
    return {
      beforeTxt,
      afterTxt
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      currency: app.globalData.currency
    });
    if (this.data.languageFlag != app.globalData.language) {
      this.setData({
        languageName: app.globalData.language,
        languageFlag: app.globalData.language,
        language: app.globalData.language == '中文' ? require('../../utils/locales/zh/order').default : require('../../utils/locales/en/order').default,
        languageBase: app.globalData.language == '中文' ? require('../../utils/locales/zh/base').default : require('../../utils/locales/en/base').default,
        languageType: app.globalData.language == '中文' ? require('../../utils/locales/zh/itemtype').default : require('../../utils/locales/en/itemtype').default,
        languageCountry: app.globalData.language == '中文' ? require('../../utils/locales/zh/country') : require('../../utils/locales/en/country'),
      })
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

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