// pages/bookPreview/bookPreview.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import {
  timeTransform
} from '../../utils/help';
import libs from '../../utils/index';
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendUserName: '',
    getUserName: '',
    notifyUserName: '',
    modalShow: false,
    time: 0,
    timeOut: false,
    timeText: '',
    registrationResult: null,
    contacts: null,
    contact: {
      "send_user": null,
      "get_user": null,
      "notify_user": null,
    },
    selectContactId: '',
    notifyIsSame: true,
    timeDel: null,
    languageFlag:'中文',
    languageName : app.globalData.language,
    language: app.globalData.language == '中文' ? require('../../utils/locales/zh/bookPreview').default : require('../../utils/locales/en/bookPreview').default
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let pageTitle = '收发货人信息';
    if (app.globalData.language != '中文') {
      pageTitle = 'Shipper/CNEE information';
    }
    wx.setNavigationBarTitle({
      title: pageTitle
    });
    console.log("----------全局变量", app.globalData);
    let {
      needPlan,
      registrationResult
    } = app.globalData;
    let now = new Date();
    let time = needPlan.addedAt + 24 * 3600 * 1000 - now.getTime();
    // let time = needPlan.addedAt + 30 * 1000 - now.getTime();
    let timeDel = setInterval(() => {
      time -= 500;
      let timeText = '';
      let timeOut = false;
      if (time <= 0) {
        timeOut = true;
        clearInterval(this.data.timeDel);
      } else {
        timeText = timeTransform(time);
      }
      this.setData({
        time,
        timeOut,
        timeText
      });
    }, 500);
    this.setData({
      registrationResult,
      timeDel
    });
  },
  refreshQuery() {
    // !当方案失效时，用户点击提交会跳转到推荐方案页面重新查询方案
    console.log('当方案失效时，用户点击提交会跳转到推荐方案页面重新查询方案');
    Dialog.alert({
      message: "当前查价方案已失效，是否需要重新查价？",
      messageAlign: 'left',
      confirmButtonText: '重新查价',
      showCancelButton: true,
      cancelButtonText: "返回首页"
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  async createOrder() {
    var app = getApp();
    let sendUser = this.selectComponent("#send_user").data.formData;

    let getUser = this.selectComponent("#get_user").data.formData;
    let notifyUser = this.selectComponent("#notify_user").data.formData;
    if (sendUser.id === '') {
      delete sendUser.id;
    }
    if (getUser.id === '') {
      delete getUser.id;
    }
    if (notifyUser.id === '') {
      delete notifyUser.id;
    }
    if (this.checkFormData(sendUser).failed || this.checkFormData(getUser).failed || this.checkFormData(notifyUser).failed) {
      // submit the order within
      // Please input Shipper Cosignee Notify information correctly
      let message = '';
      if(app.globalData.language == '中文'){
        message = '请填写完整的收发货人以及通知人信息(传真可不填写)'
      }else{
        message = 'Please input Shipper Cosignee Notify information correctly(Fax may be left blank).'
      }
      Notify({
        type: 'danger',
        message: message
      });
      return;
    }
    if (this.checkFormData(sendUser).emailWrong || this.checkFormData(getUser).emailWrong || this.checkFormData(notifyUser).emailWrong) {
      // submit the order within
      // Please input Shipper Cosignee Notify information correctly
      let message = '';
      if(app.globalData.language == '中文'){
        message = '您填写的邮箱有误'
      }else{
        message = 'Your email address is incorrect.'
      }
      Notify({
        type: 'danger',
        message: message
      });
      return;
    }

    // !此处应该请求创建订单接口
    let {
      needPlan,
      queryId,
    } = app.globalData;
    console.log("------------------创建订单，先查看一下全局变量", app.globalData);
    console.log('sendUser:1 ' , sendUser)
    sendUser.type = 'Shipper';
    getUser.type = 'Consignee';
    notifyUser.type = 'Notifier'
    console.log('sendUser:2 ' , sendUser)

    let formData = {
      "transport_type": needPlan.transportType,
      "plan_id": needPlan.id,
      "query_id": queryId,
      "shipper_contact_obj": JSON.stringify(sendUser),
      "consignee_contact_obj": JSON.stringify(getUser),
      "notifier_contact_obj": JSON.stringify(notifyUser),
      "platform": "WechatMiniProgram"
    };
    if (this.data.transportType != '国际快递') {
      let order_meta = app.globalData.order_meta;
    // "orderUserRole":"Shipper"
    order_meta.orderUserRole = app.globalData.isShipperOrConsignee
    console.log('order_meta: ' ,  order_meta)


      formData['order_meta'] = JSON.stringify(order_meta);
    }
    let message = '';
    if(app.globalData.language == '中文'){
      message = '加载中...'
    }else{
      message = 'Loading...'
    }
    Toast.loading({
      duration: 0,
      mask: true,
      message: message,
    });
    let res = await libs.request(
      'post',
      "/order/create", formData, this.data.registrationResult
    );
    console.log('----------response', res);
    Toast.clear();
    if (res.statusCode == 200) {
      app.globalData.order_info = res.data;
      let confirmButtonText ='';
      let cancelButtonText=''
      //*完成订单后 一些值设回为默认值
      app.globalData.isShipperOrConsignee = 'Shipper'
      app.globalData.incoterms = 'DAP'

      if(app.globalData.language == '中文'){
        confirmButtonText = '查看订单';
        cancelButtonText= "返回首页"
      }else{
        confirmButtonText = 'View order';
        cancelButtonText= "Back to home"
      }
      let message = '';
      if(app.globalData.language =='中文'){
        message = `您已成功下单，从${res.data.query.from.formattedAddress}到${res.data.query.to.formattedAddress}的物流服务，订单号为${res.data.displayId?res.data.displayId:res.data.id}，我们客服会尽快联系您，请保持电话通畅。您可在简宜运官网实时查询订单进度。如有疑问请拨打全国24小时客服电话400-070-5156`
      }else{
        message = `
        You have successfully placed an order for the logistics service from ${res.data.query.from.formattedAddress} to ${res.data.query.to.formattedAddress}, the order number is ${res.data.displayId?res.data.displayId:res.data.id}.
        Our customer service will contact you ASAP. You can check the order progress on the official website of EZtrans as well.
        If you have any questions can contact our 24-hour customer service number 400-070-5156 (Domestic) or +86-21-56876568 `
      }
      Dialog.alert({
        message: message,
        messageAlign: 'left',
        confirmButtonText: confirmButtonText,
        showCancelButton: true,
        cancelButtonText: cancelButtonText
      });
    } else if (res.statusCode == 409) {
      Notify({
        type: 'danger',
        message: '请求超时'
      });
    } else {
      Notify({
        type: 'danger',
        message: '很抱歉,系统出错了...'
      });
    }
  },
  // 检测数据是否为空封装函数
  checkFormData(obj) {
    console.log('------------obj', obj);
    // let success = true;
    // let emailWrong = true;
    let wrong ={
      emailWrong: false,
      failed: false
    }
    console.log('obj: ' ,  obj)
    // if(!obj.phone  && !obj.landlineNumber){
    //   success = false;
    // }
 
    Object.keys(obj).map(item => {
      if (item != 'otherInfo' && item !='faxNumber' && item != 'landlineNumber' && item != 'phone' && obj[item] === '') {
        // success = false;
        wrong.failed = true;
      }
     
      if (item == 'email' && !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(obj[item])) {
        // success = false;
        wrong.emailWrong = true;
      }
    });
    if(obj.phone==='' && obj.landlineNumber===''){
      wrong.failed = true
    }
    return wrong;
  },
  // 选择通讯录联系人
  selectUser(event) {
    console.log("--------此时应该选择通讯录联系人", event);
    let id = event.currentTarget.dataset.id;
    this.getContacts(event);
    this.setData({
      selectContactId: id
    });

    // if (this.data.contacts === null) {
    //   this.getContacts(event);
    //   this.setData({
    //     selectContactId: id
    //   });
    // } else {
    //   this.setData({
    //     modalShow: true,
    //     selectContactId: id
    //   });
    // }
  },
  // 异步请求联系人列表
  async getContacts(event) {
    let message = '';
    if(app.globalData.language == '中文'){
      message = '加载中...'
    }else{
      message = 'Loading...'
    }
    Toast.loading({
      duration: 0,
      mask: true,
      message: message,
    });
    let type = '';
    if(event.target.id == 'send_user'){
      type = 'Shipper'
    }else if(event.target.id == 'get_user'){
      type = 'Consignee'
    }else if(event.target.id == 'notify_user'){
      type = 'Notifier'
    }
    const res = await libs.request(
      'get',
      "/user/contacts", {type}, this.data.registrationResult
    );
    Toast.clear();
    console.log('查询到的所有联系人', res);
    if (res.statusCode == 200) {
      this.setData({
        modalShow: true,
        contacts: res.data.contacts
      });
    } else {
      let danger = ''
      if(app.globalData.language == '中文'){
        danger = '很抱歉,查询出错了...'
      }else{
        danger = 'Sorry, there was an error in the query'
      }
      // 
      Notify({
        type: 'danger',
        message: danger
      });
    }
  },
  // 关闭弹出层
  onModalClose() {
    this.setData({
      modalShow: false
    });
  },
  // 用户点击了取消
  handleCancel() {
    console.log("用户点击了取消，应该返回首页（清空路由栈）");
    wx.navigateBack({
      delta: 4
    })
  },
  // 用户点击了确认
  handleConfirm() {
    if (this.data.timeOut) {
      console.log("当前方案已经超时，应该跳转到方案详情页面重新查询");
      let app = getApp();
      let query_id = app.globalData.queryId;
      wx.navigateBack({
        delta: 4,
        complete: () => {
          wx.navigateTo({
            url: `/pages/price/price?query_id=${query_id}`
          });
        }
      });

    } else {
      console.log("用户点击了确认，应该前往个人中心查看订单详情（清除当前路由栈）");
      wx.navigateBack({
        delta: 4,
        complete: () => {
          console.log("----------页面已经回到了首页");
          wx.navigateTo({
            url: '/pages/user/user?openOrders=true'
          });
        }
      })
    }
  },
  // 用户选择了通讯录里的联系人
  async selectedUser(event) {
    let index = event.currentTarget.dataset.index;
    let contact = this.data.contact;
    // ! 重新获取所有表单信息
    contact['send_user'] = this.selectComponent("#send_user").data.formData;
    contact['get_user'] = this.selectComponent("#get_user").data.formData;
    contact['notify_user'] = this.selectComponent("#notify_user").data.formData;
    await this.setData({
      contact,
    });
    contact[this.data.selectContactId] = this.data.contacts[index];
    if (this.data.notifyIsSame && this.data.selectContactId == "get_user") {
      contact['notify_user'] = this.data.contacts[index];
    }
    this.setData({
      contact,
      modalShow: false
    });
  },
  // 通知人默认与发货人一致勾选切换
  checkedChange() {
    let contact = this.data.contact;
    let notifyIsSame = !this.data.notifyIsSame;
    if (!notifyIsSame) {
      contact['notify_user'] = null;
    } else {
      contact['notify_user'] = contact['get_user'];
    }
    this.setData({
      notifyIsSame,
      contact
    });
  },
  // 收货人信息修改监听
  changeFormData() {
    let getUser = this.selectComponent("#get_user").data.formData;
    let sendUser = this.selectComponent("#send_user").data.formData;
    if (this.data.notifyIsSame) {
      let contact = this.data.contact;
      contact['notify_user'] = getUser;
      contact['get_user'] = getUser;
      contact['send_user'] = sendUser;
      this.setData({
        contact
      });
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('booking on show')
    if(this.data.languageFlag !=  app.globalData.language){
      this.setData({
        languageFlag: app.globalData.language,
        languageName : app.globalData.language,
        language: app.globalData.language == '中文' ? require('../../utils/locales/zh/bookPreview').default : require('../../utils/locales/en/bookPreview').default
      })
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    clearInterval(this.data.timeDel);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.data.timeDel);
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