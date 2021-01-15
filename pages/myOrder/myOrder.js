// pages/myOrder/myOrder.js
import libs from '../../utils/index';
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
import {
  toFixed
} from '../../utils/help';
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    registrationResult: null,
    page: 0,
    pageSize: 20,
    tabs: ['all', 'doing', 'complete', 'cancel'],
    orders: {
      'all': [],
      'doing': [],
      'complete': [],
      'cancel': [],
    },
    containerHeight: 0,
    // 是否还有下一页
    next: null,
    loading: {
      'all': false,
      'doing': false,
      'complete': false,
      'cancel': false,
    },
    code: 'all',
    moveStart: 0,
    refresh: {
      'all': {
        touchTop: true,
        topLoading: false,
        refresh: false,
        topLoadingSuccess: false,
        refreshAble: true,
      },
      'doing': {
        touchTop: true,
        topLoading: false,
        refresh: false,
        topLoadingSuccess: false,
        refreshAble: true,
      },
      'complete': {
        touchTop: true,
        topLoading: false,
        refresh: false,
        topLoadingSuccess: false,
        refreshAble: true,
      },
      'cancel': {
        touchTop: true,
        topLoading: false,
        refresh: false,
        topLoadingSuccess: false,
        refreshAble: true,
      },
    },
    refreshCode: 'all',
    // 定时器
    time: null,
    languageFlag: '中文',
    currency: app.globalData.currency,
    language: app.globalData.language == '中文' ? require('../../utils/locales/zh/order').default : require('../../utils/locales/en/order').default,
    languageBase: app.globalData.language == '中文' ? require('../../utils/locales/zh/base').default : require('../../utils/locales/en/base').default,
    languageCountry: app.globalData.language == '中文' ? require('../../utils/locales/zh/country') : require('../../utils/locales/en/country'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let pageTitle = '我的订单';
    if (app.globalData.language != '中文') {
      pageTitle = 'My order';
    }
    wx.setNavigationBarTitle({
      title: pageTitle
    });
    wx.getSystemInfo({
      success: res => {
        this.setData({
          containerHeight: (res.windowHeight - 44) * 2
        });
      },
      fail: err => {
        console.log('--------获取设备信息失败', err);
      }
    });
    // !获取当前用户所有订单
    this.getAllOrder();
  },
  // 查询全部订单封装函数
  async getAllOrder(code = 'all', statuses = '', isLoadMore = false) {
    var app = getApp();
    let {
      registrationResult
    } = app.globalData;
    // ! 是否是初次查询，若是显示加载中动画
    if (this.data.orders[code].length === 0) {
      this.setData({
        [`loading.${code}`]: true
      });
    }
    let res = await libs.request(
      'post',
      '/user/orders/status', {
      "page": this.data.page,
      "size": this.data.pageSize,
      "statuses": statuses
    }, registrationResult
    );

    if (res.statusCode == 200) {
      let orders = res.data.orders;
      let next = res.data.next;
      orders.map(order => {
        let transportType = '';
        // 设置价格显示文本
        if (order.plan != null) {
          // 计算贸易条款总价格
          let price = toFixed(order.plan.priceValueDisplay, 2);
          if (order.orderMeta != null) {
            if (order.orderMeta.serviceType === 'DDP') {
              let total_tariff = 0;
              let total_VAT = 0;
              // ! DDP还要加上123段费用作为关税增值税的计算基数
              let other_price = 0;
              if(order.doorToPortPlan){
                other_price += Number(order.doorToPortPlan.plan.sameCurrencySummary.value);
              }else{
                other_price += Number(order.plan.stage1Plan.sameCurrencySummary.value);
              }
              other_price += Number(order.plan.stage2Plan.sameCurrencySummary.value);
              other_price += Number(order.plan.stage3Plan.sameCurrencySummary.value);
              order.orderMeta.dCategoryList.map(item => {
                total_tariff += Number(item.productValue + other_price) * Number(item.importTaxRate) / 100;
                total_VAT += Number(item.productValue + other_price + total_tariff) * Number(item.valueAddedTaxRate) / 100;
              });
              price = `${toFixed(price, 2)} + ${order.orderMeta.dCategoryList[0].currency} ${toFixed((total_tariff + total_VAT), 2)}`;
            } else if (order.orderMeta.serviceType === 'CIF' || order.orderMeta.serviceType === 'CIP目的港') {
              let insuranceRate = Number(order.orderMeta.dCategoryList[0].productValue) * 1.1 * Number(order.orderMeta.dCategoryList[0].insuranceRate) / 1000;
              if (insuranceRate < 100) {
                insuranceRate = 100;
              }
              price = `${toFixed(price, 2)} + ${order.orderMeta.dCategoryList[0].currency} ${toFixed(insuranceRate, 2)}`;
            }
          }
          order.priceValueText = price;
          transportType = order.plan.transportType;
        } else {
          order.priceValueText = toFixed(order.expressPlan.priceValueDisplay, 2);
          transportType = order.expressPlan.transportType;
        }
        // 运输方式和图标控制
        switch (transportType) {
          case "ShippingFCL": {
            order.transportType = 'ShippingFCL';
            order.iconUrl = '/pages/image/icon/icon-shipping.png';
            break;
          }
          case "Air": {
            order.transportType = 'Air';
            order.iconUrl = '/pages/image/icon/icon-air_go.png';
            break;
          }
          case "ShippingLCL": {
            order.transportType = 'ShippingLCL';
            order.iconUrl = '/pages/image/icon/icon-shipping.png';
            break;
          }
          case "RailwayFCL": {
            order.transportType = 'RailwayFCL';
            order.iconUrl = '/pages/image/icon/icon-railway.png';
            break;
          }
          case "RailwayLCL": {
            order.transportType = 'RailwayLCL';
            order.iconUrl = '/pages/image/icon/icon-railway.png';
            break;
          }
          case "Express": {
            order.transportType = 'Express';
            order.iconUrl = '/pages/image/icon/icon-express.png';
            break;
          }
        }
      });
      if (isLoadMore) {
        // ! 使用二维数组代替一维数组，底部刷新只动态添加新的一页数组，避免setData数据过大
        this.setData({
          [`orders.${code}[${this.data.page}]`]: orders
        });
      } else {
        if(res.data.orders.length>0){
          this.setData({
            [`orders.${code}`]: [res.data.orders],
          });
        }
      }
      this.setData({
        next,
        [`loading.${code}`]: false
      });
    } else {
      Notify({
        type: 'danger',
        message: "很抱歉,查询出错了..."
      });
      this.setData({
        orders: [],
        next: null,
        [`loading.${code}`]: false
      });
    }
  },
  async changeBar(event) {
    console.log('----------标签页name', event);
    let code = event.detail.name;
    await this.setData({
      page: 0,
    });
    let statuses = '';
    if (code == 'all') {
      statuses = "";
    } else if (code == 'doing') {
      statuses = 'Created,LeavingFactory,ProductLoading,ShippingInTransit,ProductUnloading,Delivery,RequestCancel,AdminCancelDenied';
    } else if (code == 'complete') {
      statuses = 'Completed';
    } else {
      statuses = 'AdminCancelAgreed';
    }

    // let code = '';
    // if (title == '全部' || title == 'All orders') {
    //   statuses = "";
    //   code = 'all';
    // } else if (title == '进行中' || title == 'In Progress') {
    //   statuses = 'Created,LeavingFactory,ProductLoading,ShippingInTransit,ProductUnloading,Delivery,RequestCancel,AdminCancelDenied';
    //   code = 'doing';
    // } else if (title == '已完成' || title == 'Completed') {
    //   statuses = 'Completed';
    //   code = 'complete';
    // } else {
    //   statuses = 'AdminCancelAgreed';
    //   code = 'cancel';
    // }
    this.setData({
      code,
      [`refresh.${code}`]: {
        touchTop: true,
        topLoading: false,
        refresh: false,
        topLoadingSuccess: false,
        refreshAble: true,
      }
    });
    this.getAllOrder(code, statuses);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  orderDetail(event) {
    let {
      orders,
      code
    } = this.data;
    let index = event.currentTarget.dataset.index;
    let pageNumber = event.currentTarget.dataset.pageNumber;
    let order = orders[code][pageNumber][index];
    var app = getApp();
    app.globalData.order_detail = order;
    wx.navigateTo({
      url: "/pages/orderDetail/orderDetail"
    });
  },
  scrollToLower(event) {
    if (this.data.next != null) {
      if (this.data.loading[this.data.code]) {
        return false;
      }
      this.setData({
        page: this.data.page + 1,
        [`loading.${this.data.code}`]: true
      }, async () => {
        console.log('----------下一页是', this.data.page);
        let code = this.data.code;
        let statuses = '';
        if (code == 'all') {
          statuses = "";
        } else if (code == 'doing') {
          statuses = 'Created,LeavingFactory,ProductLoading,ShippingInTransit,ProductUnloading,Delivery,RequestCancel,AdminCancelDenied';
        } else if (code == 'complete') {
          statuses = 'Completed';
        } else {
          statuses = 'AdminCancelAgreed';
        }
        // if (title == '全部' || title == 'All orders') {
        //   statuses = "";
        // } else if (title == '进行中' || title == 'In Progress') {
        //   statuses = 'Created,LeavingFactory,ProductLoading,ShippingInTransit,ProductUnloading,Delivery,RequestCancel,CancelRequestDenied';
        // } else if (title == '已完成' || title == 'Completed') {
        //   statuses = 'Completed';
        // } else {
        //   statuses = 'AdminCancelAgreed';
        // }
        await this.getAllOrder(code, statuses, true);
        this.setData({
          [`loading.${this.data.code}`]: false
        });
      });
    }
  },
  scroll(event) {
    // ! 监听滚轮是否到达顶部
    this.setData({
      [`refresh.${this.data.code}.touchTop`]: event.detail.scrollTop < 20
    });
  },
  touchStart(event) {
    console.log('------触屏了', event);
    this.setData({
      moveStart: event.changedTouches[0].pageY
    });
  },
  async touchMove(event) {
    let {
      moveStart
    } = this.data;
    let now = event.changedTouches[0].pageY;
    if ((now - moveStart) > 40) {
      // ! 此时已到达顶部，并且是下拉执行刷新动作
      this.setData({
        [`refresh.${this.data.code}.refresh`]: true,
        [`refresh.${this.data.code}.topLoading`]: true,
        refreshCode: this.data.code
      });
    }
  },
  async touchEnd() {
    let {
      refreshCode,
      refresh
    } = this.data;
    if (refresh[refreshCode].touchTop && refresh[refreshCode].refreshAble && !this.data.loading.refreshCode) {
      this.setData({
        [`refresh.${this.data.refreshCode}.refreshAble`]: false
      });
      let statuses = '';
      if (refreshCode == 'all') {
        statuses = "";
      } else if (refreshCode == 'doing') {
        statuses = 'Created,LeavingFactory,ProductLoading,ShippingInTransit,ProductUnloading,Delivery,RequestCancel,CancelRequestDenied';
      } else if (refreshCode == 'complete') {
        statuses = 'Completed';
      } else {
        statuses = 'AdminCancelAgreed';
      }
      await this.getAllOrder(refreshCode, statuses);
      this.setData({
        [`refresh.${this.data.refreshCode}.topLoading`]: false,
        [`refresh.${this.data.refreshCode}.topLoadingSuccess`]: true
      });
      clearTimeout(this.data.time);
      let time = setTimeout(() => {
        this.setData({
          [`refresh.${this.data.refreshCode}.topLoadingSuccess`]: false,
          [`refresh.${this.data.refreshCode}.refresh`]: false,
          [`refresh.${this.data.refreshCode}.refreshAble`]: true
        });
      }, 1000);
      this.setData({
        time,
      });
    } else {
      this.setData({
        [`refresh.${this.data.refreshCode}.refresh`]: false,
      });
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
        languageFlag: app.globalData.language,
        language: app.globalData.language == '中文' ? require('../../utils/locales/zh/order').default : require('../../utils/locales/en/order').default,
        languageBase: app.globalData.language == '中文' ? require('../../utils/locales/zh/base').default : require('../../utils/locales/en/base').default,
        languageCountry: app.globalData.language == '中文' ? require('../../utils/locales/zh/country') : require('../../utils/locales/en/country'),
      })

    }
    this.setData({
      refresh: {
        'all': {
          touchTop: true,
          topLoading: false,
          refresh: false,
          topLoadingSuccess: false,
          refreshAble: true,
        },
        'doing': {
          touchTop: true,
          topLoading: false,
          refresh: false,
          topLoadingSuccess: false,
          refreshAble: true,
        },
        'complete': {
          touchTop: true,
          topLoading: false,
          refresh: false,
          topLoadingSuccess: false,
          refreshAble: true,
        },
        'cancel': {
          touchTop: true,
          topLoading: false,
          refresh: false,
          topLoadingSuccess: false,
          refreshAble: true,
        },
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    clearTimeout(this.data.time);
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