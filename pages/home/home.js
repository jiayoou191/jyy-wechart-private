// pages/home/home.js
import libs from '../../utils/index'
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import {
  getStorageAPI,
  getSystemInfoAPI,
  getSettingAPI,
} from '../../utils/help';


let app = getApp()



Page({

  /**
   * 页面的初始数据
   */
  data: {

    registrationResult: null,
    itemTypes: null,
    searchHistoryGetIn: null,
    userPhoto: '/pages/image/icon/icon-contact.png',
    totalBar: 64,
    navBarHeight: 44,
    toolBarHeight: 20,
    NotifyTop: 84,
    languageFlag: '中文',
    language: null,
    localFlag: false,
    totalBarPx: 64,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    var that = this;
    try {
      let rr = await getStorageAPI('weChartLanguage');
      console.log('rr: ', rr)
      if (rr.data == '中文') {
        app.globalData.language = '中文'
      } else {
        app.globalData.language = 'English'
      }
      let language = null;
      if (app.globalData.language == '中文') {
        console.log('zh')

        language = require('../../utils/locales/zh/home').default;
      } else {
        console.log('eng')
        language = require('../../utils/locales/en/home').default;
      }
      that.setData({
        localFlag: true,
        language,
      })
    } catch (e) {
      console.log('----------------', e);
      try {
        let res = await getSystemInfoAPI();
        if (res.language == 'zh_CN') {
          wx.setStorageSync('weChartLanguage', '中文')
          app.globalData.language = '中文'
        } else {
          wx.setStorageSync('weChartLanguage', 'English')
          app.globalData.language = 'English'
        }
      } catch (e) {
        console.log('------------获取设备信息出错', e);
      }
      let language = null;
      if (app.globalData.language == '中文') {
        language = require('../../utils/locales/zh/home').default;
      } else {
        language = require('../../utils/locales/en/home').default;
      }
      that.setData({
        localFlag: true,
        language: language
      })
    }
    // 获取胶囊的数据
    // !wx.getMenuButtonBoundingClientRect从2.1.0开始支持
    var data = wx.getMenuButtonBoundingClientRect();
    this.setData({
      totalBar: data.top + data.height + 10,
      NotifyTop: data.top + data.height + 10
    });
    try {
      // wx.getSystemInfo获取statusBarHeight支持的最低版本为1.9.0
      let res = await getSystemInfoAPI();
      this.setData({
        toolBarHeight: res.statusBarHeight,
        navBarHeight: this.data.totalBar - res.statusBarHeight,
      });
      app.globalData.windowHeight = res.windowHeight;
    } catch (e) {
      console.log('-------------获取设备信息异常', e);
    }
    wx.onNetworkStatusChange(res => {
      if (!res.isConnected) {
        Notify({
          message: this.data.language.checkNetwork,
          top: this.data.NotifyTop
        })
      }
    })
    //! 验证是否已经获取到了 用户信息
    try {
      let rr = await getStorageAPI('registrationResult');
      if (rr.data == null) {
        console.log(1)
        console.log('asdfgh')
        //TODO 静默查询
        this.userLoinFunc();
      } else {
        app.globalData.registrationResult = rr.data;
        let {
          id,
          storageObjectTag
        } = rr.data.user.avatar;
        let userPhoto = `https://jyy-binary-storage.oss-cn-shanghai.aliyuncs.com/${storageObjectTag}/${id}`;
        this.setData({
          registrationResult: rr.data,
          userPhoto
        })

      }
    } catch (e) {
      console.log('------------获取用户信息异常', e);
      //TODO 静默查询
      this.userLoinFunc();
    }
    let registrationResult = app.globalData.registrationResult
    let {
      data: itemData
    } = await libs.request('get', '/item_type/list', {}, registrationResult)
    console.log('itemData: ', itemData)
    this.setData({
      itemTypes: itemData.itemTypes,
      // language
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log('language change')
    // console.log('language: '  ,  this.data.language)
    if (this.data.languageFlag != app.globalData.language) {
      let language = null;
      if (app.globalData.language == '中文') {
        language = require('../../utils/locales/zh/home').default;
      } else {
        language = require('../../utils/locales/en/home').default;
      }
      this.setData({
        languageFlag: app.globalData.language,
        language: language
      })
    }
    console.log('进来之后重新出发')
    Toast.clear();
    console.log('this.data.statusBarHeight', this.data.statusBarHeight);

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

  },


  getUserInfo() {
    // console.log('123')
    // wx.getUserInfo().then((res) => {
    //   console.log('res 123获取到用户信息', res)

    // })
    this.userLoinFuncButton()

  },
  // 弹出通知信息模块封装函数
  showNotify(message) {
    Notify({
      message: message,
      // message: '\n' + message + '\n\n',
      // duration: 0,
      top: this.data.NotifyTop,
    })
  },
  async getPhoneNumber(e) {
    //! 获取用户手机号 之后一键查价
    console.log(e.detail);
    const iv = e.detail.iv;
    const encryptedData = e.detail.encryptedData
    //TODO  现在已经globaldata存储了 registrationResult
    let registrationResult = app.globalData.registrationResult
    // let registrationResult = wx.getStorageSync('registrationResult');
    console.log('registrationResult need StorageSync: ', registrationResult);
    console.log('registrationResult need globalData: ', registrationResult);
    //TODO  测试手机号
    const {
      code
    } = await wx.login()
    console.log("code: ", code)
    const res = await libs.request(
      'post',
      '/oauth/wechat_mini_program/update/phone', {
        code: code,
        iv: iv,
        encrypted_data: encryptedData
      }, registrationResult
    )
    if (res.statusCode == 200) {
      console.log('important: ', '---------------------------------------------------')
      console.log('res: ', res.data);
      console.log('registrationResult: ', registrationResult)
      registrationResult.user = res.data;
      wx.setStorageSync('registrationResult', registrationResult)
      app.globalData.registrationResult = registrationResult;

      this.setData({
        registrationResult: registrationResult
      })

      console.log('registrationResult!!!!:   ', registrationResult)
      this.searchFunc()
    } else {
      // error
      Notify({
        message: '手机号授权失败，请稍后再试',
        top: this.data.NotifyTop
      })
    }

  },
  handleSearch() {
    // wx.getNetworkType({
    //   success(res){
    //     console.log('res 判断当前有无网络: '  ,res)
    //   }
    // })
    this.searchFunc()
  },
  async searchFunc() {
    let formInline = app.globalData.formInline;
    app.globalData.formInline = formInline;
    let message_v2 = ''
    let flagGoods = this.goodsCheckUp(app.globalData.formInline);
    if (!flagGoods) {
      if (app.globalData.language == "中文") {
        message_v2 = '请将商品信息填写完整后查价'
      } else {

        message_v2 = 'Cargo must be filled in'
      }
      return this.showNotify(message_v2);
    }

    let flagAddress = this.addressCheckUp(app.globalData.addressFrom, app.globalData.addressTo);
    if (flagAddress == "from为空") {
      if (app.globalData.language == "中文") {
        message_v2 = '提货地址必须填写'
      } else {
        message_v2 = 'Pick-up address must be filled in'
      }
      return this.showNotify(message_v2);

    } else if (flagAddress == "to为空") {
      if (app.globalData.language == "中文") {
        message_v2 = '收货地址必须填写'
      } else {
        message_v2 = 'Delivery address address must be filled in'
      }
      return this.showNotify(message_v2);
    } else if (flagAddress == "地址都不是中国") {
      if (app.globalData.language == "中文") {
        message_v2 = '我们暂时只做中国的进出口代理'
      } else {
        message_v2 = 'Only support the IMP&EXP from China now.'
      }
      return this.showNotify(message_v2);
    } else if (flagAddress == "地址都为中国") {
      // 
      if (app.globalData.language == "中文") {
        message_v2 = '我们暂时只做中国的进出口代理'
      } else {
        message_v2 = 'Only supports cross-border transportation now.'
      }
      return this.showNotify(message_v2);
    }
    let data = {
      item_type_id: app.globalData.formType.id,
      searchable_items: JSON.stringify(app.globalData.formInline),
      from_address_json: JSON.stringify(app.globalData.addressFrom),
      to_address_json: JSON.stringify(app.globalData.addressTo)
    };
    let message = '';
    if (app.globalData.language == '中文') {
      message = '加载中...'
    } else {
      message = 'Loading...'
    }
    Toast.loading({
      duration: 0,
      mask: true,
      message: message,
    });
    try {
      let res = await getStorageAPI('searchHistory');
      res.data.unshift(data);
      console.log('我这里出现问题了1');
      wx.setStorageSync('searchHistory', res.data);
      this.setData({
        searchHistoryGetIn: res.data
      });
    } catch (e) {
      console.log('---------获取历史搜索记录异常', e);
      //! 没找到的情况下
      wx.setStorageSync('searchHistory', [data])
      this.setData({
        searchHistoryGetIn: [data]
      })
    }
    let registrationResult = app.globalData.registrationResult
    libs.request('post', '/search', {
      from_address_json: data.from_address_json,
      to_address_json: data.to_address_json,
      item_type_id: data.item_type_id,
      searchable_items: data.searchable_items,
      opt_currencies: 'EUR,USD'
    }, registrationResult).then(res => {
      Toast.clear();
      if (res.statusCode == 200) {
        app.currency = res.data.baseCurrency;
        app.globalData.currencies = [res.data.baseCurrency];
        if (res.data.optionalCurrencies) {
          app.globalData.currencies = [...app.globalData.currencies, ...res.data.optionalCurrencies];
        }
        wx.navigateTo({
          url: '../price/price?query_id=' + res.data.id,
        })
      } else if (res.statusCode == 429) {
        console.log('res: ', res.statusCode)
        let err_message = '';
        if (app.globalData.language == '中文') {
          err_message = '您搜索的过于频繁, 请休息会再试'
        } else {
          err_message = 'Your search request is too frequent, please try again later'
        }
        this.showNotify(err_message);
      } else if (res.statusCode == 500) {
        let err_message = '';
        if (app.globalData.language == '中文') {
          err_message = '请您输入合法文字，简宜运无法识别您的文字！'
        } else {
          err_message = 'The commodity infomation is invalid.'
        }
        this.showNotify(err_message);
      }

      // console.log('跳转到查价页面price')
    }).catch(err => {
      Toast.clear();
      // console.log('跨域出错11223344： ', err)
      // let err_message = '';
      // if (app.globalData.language == '中文') {
      //   err_message = '您搜索的过于频繁, 请休息会再试'
      // } else {
      //   err_message = 'Your search request is too frequent, please try again later'
      // }
      // this.showNotify(err_message);

    })

  },
  //!  历史记录的搜索
  histotySearchFunc(index) {
    let formInline = app.globalData.formInline;
    app.globalData.formInline = formInline;
    let flagGoods = this.goodsCheckUp(app.globalData.formInline);
    if (!flagGoods) {
      return this.showNotify('请将商品信息填写完整后查价');
    }

    let flagAddress = this.addressCheckUp(app.globalData.addressFrom, app.globalData.addressTo);
    if (flagAddress == "from为空") {
      return this.showNotify('提货地址必须填写');

    } else if (flagAddress == "to为空") {

      return this.showNotify('收货地址必须填写');
    } else if (flagAddress == "地址都不是中国") {

      return this.showNotify('我们暂时只做中国的进出口代理');
    } else if (flagAddress == "地址都为中国") {
      return this.showNotify('我们暂时只做进出口代理');
    }
    let data = {
      item_type_id: app.globalData.formType.id,
      searchable_items: JSON.stringify(app.globalData.formInline),
      from_address_json: JSON.stringify(app.globalData.addressFrom),
      to_address_json: JSON.stringify(app.globalData.addressTo)
    };
    let message = '';
    if (app.globalData.language == '中文') {
      message = '加载中...'
    } else {
      message = 'Loading...'
    }
    Toast.loading({
      duration: 0,
      mask: true,
      message: message,
    });
    wx.getStorage({
      key: 'searchHistory',
      success: (res) => {
        console.log('qwerty')
        console.log('res: ', res)
        // res.data.unshift(data)
        console.log('我这里出现问题了1')
        console.log('index: ', index)
        let data_v2 = res.data
        data_v2 = data_v2.filter((i, j) => j != index);
        data_v2.unshift(data)

        wx.setStorageSync('searchHistory', data_v2)
        this.setData({
          searchHistoryGetIn: data_v2
        })
      }
    })

    let registrationResult = app.globalData.registrationResult
    libs.request('post', '/search', {
      from_address_json: data.from_address_json,
      to_address_json: data.to_address_json,
      item_type_id: data.item_type_id,
      searchable_items: data.searchable_items,
      opt_currencies: 'EUR,USD'
    }, registrationResult).then(res => {
      Toast.clear();
      app.currency = res.data.baseCurrency;
      app.globalData.currencies = [res.data.baseCurrency];
      if (res.data.optionalCurrencies) {
        app.globalData.currencies = [...app.globalData.currencies, ...res.data.optionalCurrencies];
      }
      // console.log('查询啦： ', res.data);
      //TODO 历史搜索完成后 放开
      if (res.statusCode == 200) {
        wx.navigateTo({
          url: '../price/price?query_id=' + res.data.id,
        })
      } else if (res.statusCode == 429) {
        let err_message = null;
        if (app.globalData.language == '中文') {
          err_message = '您搜索的过于频繁, 请休息会再试'
        } else {
          err_message = 'Your search request is too frequent, please try again later'
        }
        this.showNotify(err_message);
      } else if (res.statusCode == 500) {
        let err_message = '';
        if (app.globalData.language == '中文') {
          err_message = '请您输入合法文字，简宜运无法识别您的文字！'
        } else {
          err_message = 'The commodity infomation is invalid.'
        }
        this.showNotify(err_message);
      }

      // console.log('跳转到查价页面price')
    }).catch(err => {
      Toast.clear();
      // console.log('跨域出错： ', err)
      // let err_message = null
      // if (app.globalData.language == '中文') {
      //   err_message = '您搜索的过于频繁, 请休息会再试'
      // } else {
      //   err_message = 'Your search request is too frequent, please try again later'
      // }
      // this.showNotify(err_message);

    })

  },

  async handleGetUserinfo() {
    //! 获取个人信息
    const res = await wx.getUserInfo()
    console.log('res456 获取到用户信息', res)
    // wx.setStorageSync('registrationResult', res)
    this.userLoinFuncButton()
  },





  //! 获取登陆用户的所有信息 查看该用户是否已经登陆
  async userLoinFunc() {
    let {
      code
    } = await wx.login()
    console.log('code: ', code);
    let registrationResult = app.globalData.registrationResult
    const res = await libs.request('post', '/oauth/wechat_mini_program', {
      code: code,
    }, registrationResult)
    console.log('res', res)
    if (res.statusCode === 200) {
      console.log('已经存在该用户')
      wx.setStorageSync('registrationResult', res.data)
      let registrationResult = wx.getStorageSync('registrationResult');
      console.log('registrationResult123:  ', registrationResult)
      app.globalData.registrationResult = registrationResult;

      // !修改头像代码
      let userPhoto = this.data.userPhoto;
      if (res.data.user.avatar != null) {
        let {
          id,
          storageObjectTag
        } = res.data.user.avatar;
        userPhoto = `https://jyy-binary-storage.oss-cn-shanghai.aliyuncs.com/${storageObjectTag}/${id}`;
      }
      this.setData({
        registrationResult: registrationResult,
        userPhoto
      })

    } else {
      try {
        let authSetting = await getSettingAPI();
        console.log('authSetting: ', authSetting.authSetting)
        if (authSetting && authSetting.authSetting['scope.userInfo']) {
          // todoZ: getuserinfo
          console.log(123)
          this.userLoinFuncButton()
        } else {
          console.log(456)
          // todo: show auth btn
          wx.setStorageSync('registrationResult', null)
          app.globalData.registrationResult = null;
          this.setData({
            registrationResult: null
          })
        }
      } catch (e) {
        console.log('-------------获取用户授权信息失败', e);
        // todo: show auth btn
        console.log(err)
        wx.setStorageSync('registrationResult', null)
        app.globalData.registrationResult = null
        this.setData({
          registrationResult: null
        })
      }
    }

  },

  async userLoinFuncButton() {

    let {
      code: newcode
    } = await wx.login()
    console.log('重新登陆拿到的newcode:', newcode)
    let result = await wx.getUserInfo()
    console.log('result:', result)
    const {
      iv,
      encryptedData
    } = result
    console.log('获取用户信息', result)
    let registrationResult = app.globalData.registrationResult
    // 注册用户
    const res = await libs.request('post', '/oauth/wechat_mini_program', {
      code: newcode,
      iv: iv,
      encrypted_data: encryptedData,
    }, registrationResult)
    console.log('拿到注册的结果', res)
    const {
      statusCode
    } = res

    if (statusCode === 200) {

      let registrationResult = res.data;
      wx.setStorageSync('registrationResult', registrationResult)
      app.globalData.registrationResult = registrationResult
      console.log('registrationResult456:  ', registrationResult)

      // !修改头像代码
      let userPhoto = this.data.userPhoto;
      if (res.data.user.avatar != null) {
        let {
          id,
          storageObjectTag
        } = res.data.user.avatar;
        userPhoto = `https://jyy-binary-storage.oss-cn-shanghai.aliyuncs.com/${storageObjectTag}/${id}`;
      }
      this.setData({
        registrationResult: registrationResult,
        userPhoto
      })
    } else {

    }


  },
  handleLanguage(lang) {

    console.log('lang: ', lang.detail)
    // let language = null;
    // let language = lang.detail;
    app.globalData.formInline = [{
      name: '',
      weight: '',
      volume: '',
      flag: false
    }]
    // this.onLoad();
    wx.reLaunch({
      url: 'home'
    })
    // this.setData({
    //   language
    // })
  },
  handleMore({
    detail
  }) {
    //! 添加更多
    console.log('detail: ', detail)
    console.log('获取数据 添加更多')

    app.globalData.formInline = detail;
    // console.log(app.globalData.formInline)
    wx.navigateTo({
      url: '../moreGoods/moreGoods',
    })

  },

  handleMapClick({
    detail
  }) {
    //! 地图跳转
    console.log('detail: ', detail)
    wx.navigateTo({
      url: '../selectMap/selectMap?local=' + detail,
    })
  },
  handleHistoryClick({
    detail
  }) {
    //! 历史搜索 点击事件
    console.log('_________')
    console.log('_________')
    console.log('_________')
    console.log('_________')

    console.log('e home页面 历史搜索: ', detail)
    app.globalData.formInline = detail.searchable_items
    app.globalData.addressFrom = detail.from_address_json,
      app.globalData.addressTo = detail.to_address_json
    let accessibleItemTypes = app.globalData.accessibleItemTypes
    let formType = accessibleItemTypes.filter(i => i.id == detail.item_type_id)
    formType = formType[0]
    // console.log('formType: '  ,formType)
    app.globalData.formType = formType
    console.log('detail: ', detail)
    // let data = detail
    // data.from_address_json = JSON.stringify(data.from_address_json);
    // data.to_address_json = JSON.stringify(data.to_address_json);
    // data.searchable_items = JSON.stringify(data.searchable_items);
    this.histotySearchFunc(detail.index)



  },
  handleCallPhone() {
    //! 拨打电话号码
    wx.makePhoneCall({
      phoneNumber: '021-56876568'
    })
  },

  goodsCheckUp(goods) {
    let flag = true
    goods.map(i => {
      if (!i.name || !i.weight || !i.volume) {
        flag = false
      }
    })
    console.log('flag: ', flag)
    return flag
  },
  addressCheckUp(from, to) {
    console.log('from: ', from);
    console.log('to: ', to)
    if (from == null) {
      return 'from为空'
    }
    if (to == null) {
      return 'to为空'
    }
    if (from.countryRegionIso2 == "CN" && to.countryRegionIso2 == "CN") {
      return '地址都为中国'
    }
    if (from.countryRegionIso2 != "CN" && to.countryRegionIso2 != "CN") {
      return '地址都不是中国'
    }
  }



})