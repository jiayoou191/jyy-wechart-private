// pages/selectMap/selectMap.js
import libs from '../../utils/index'
import { getSettingAPI, openSettingAPI ,bindChange } from '../../utils/help'

let app = getApp()
const mapMarkerWidth = 23
const mapMarkerHeight = 38

Page({

  /**
   * 页面的初始数据
   */
  data: {
    err: '有问题',
    local: '',
    // 显示地图
    showMap: false,
    language: app.globalData.language == '中文' ? require('../../utils/locales/zh/map').default : require('../../utils/locales/en/map').default,

    // 显示搜索列表
    showSearchList: false,
    // 经度
    longitude: 121.56464385986328,
    // 纬度
    latitude: 31.230369567871094,
    //! 实验使用
    markers: [{
      iconPath: "../image/icon/icon-tuding.png",
      id: 0,
      zIndex:1,
      callout: {
        content: '设为收货点'
      },
      latitude: 23.099994,
      longitude: 113.324520,
      width: mapMarkerWidth,
      height: mapMarkerHeight
    }],
    addressFromTo: {
      addressFrom: null,
      addressTo: null
    },
    searchContent: '',
    loadIsShow: false, //! 菊花是否旋转
    addressInform: null,
    isConnected: true, //! 判断是否有网络连接
    isFocus: true,//!是否获取到了焦点，
    isHeight: 48 //! 自动判断页面高度


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //! 获取当前位置的api接口  
    // wx.getLocation().then(res=>{
    //   console.log('resssssss: '  , res)
    // })

    // console.log('mapOption: '  ,options)
    this.setData({
      local: options.local
    })

    // let pageTitle = '推荐方案';
    // if (app.globalData.language != '中文') {
    //     pageTitle = 'Recommended plan';
    // }
    // wx.setNavigationBarTitle({
    //     title: pageTitle
    // });
    if (this.data.local == "from") {
      let title = ''
      if (app.globalData.language != "中文") {
        title = 'Pick up address';
      } else {
        title = '提货地址';
      }
      wx.setNavigationBarTitle({
        title: title
      })
    } else if (this.data.local == "to") {
      let title = ''
      if (app.globalData.language != "中文") {
        title = 'Delivery address';
      } else {
        title = '收货地址';
      }
      wx.setNavigationBarTitle({
        title: title
      })
    }
    // this.getMap();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let flag = wx.canIUse('onKeyboardHeightChange');
    console.log('flag:  ', flag)
    if (flag == true) {
      wx.onKeyboardHeightChange(res => {
        console.log('res', res.height)
        this.setData({
          isHeight: res.height * 2 + 30
        })
      })
    } else {
      this.setData({
        isHeight: 48
      })
    }


    this.setData({
      isFocus: true
    })
    if (this.properties.local == "from" && app.globalData.addressFrom) {
      let markers = {
        iconPath: "../image/icon/icon-tuding.png",
        id: 0,
        zIndex:1,
        callout: this.getCallout(),
        latitude: app.globalData.addressFrom.latLng.latitude,
        longitude: app.globalData.addressFrom.latLng.longitude,
        width: mapMarkerWidth,
        height: mapMarkerHeight
      };
      markers = [markers]
      // longitude: addressInform.addressLine.latLng.longitude,
      // latitude: addressInform.addressLine.latLng.latitude,
      let addressInform = {
        address: app.globalData.addressFrom.formattedAddress,
        addressLine: app.globalData.addressFrom,
        local: 'from',
      }
      this.setData({
        latitude: app.globalData.addressFrom.latLng.latitude,
        longitude: app.globalData.addressFrom.latLng.longitude,
        markers: markers,
        addressInform: addressInform

      })
    } else if (this.properties.local == "to" && app.globalData.addressTo) {
      let markers = {
        iconPath: "../image/icon/icon-tuding.png",
        id: 0,
        zIndex:1,
        callout: this.getCallout(),
        latitude: app.globalData.addressTo.latLng.latitude,
        longitude: app.globalData.addressTo.latLng.longitude,
        width: mapMarkerWidth,
        height: mapMarkerHeight
      };
      markers = [markers];
      let addressInform = {
        address: app.globalData.addressTo.formattedAddress,
        addressLine: app.globalData.addressTo,
        local: 'to',
      }
      this.setData({
        latitude: app.globalData.addressTo.latLng.latitude,
        longitude: app.globalData.addressTo.latLng.longitude,
        markers: markers,
        addressInform: addressInform
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

  },


  handleMapChooseChange(e) {
    console.log('eeeeeeee:', e)
    this.setData({
      loadIsShow: true
    })
    let registrationResult = app.globalData.registrationResult
    if (e.detail == null || e.detail.length <= 0) {
      this.setData({
        loadIsShow: false,
        searchContent: []
      })
    }
    let lang = 'zh'
    if (app.globalData.language == '中文') {
      lang = 'zh'
    } else {
      lang = 'en'
    }
    console.log('problem: ' )
    console.log('eng: ' , app.globalData.language)
    let language = 'zh-Hans';
    app.globalData.language=='中文'? language = 'zh-Hans': language = 'en'
    libs.request('get', `https://dev.virtualearth.net/REST/v1/Locations/${e.detail}?include=queryParse,ciso2&key=Ale77js9zOT7TWyDZpbTwrNf7kDuDllOStIxLYRKueXrN3XFWZMgZFm7V8r5vM93&culture=${language}`, {}, registrationResult , false).then(res => {
      console.log('res: ', res)
      this.setData({
        loadIsShow: false,
        searchContent: bindChange(res.data.resourceSets[0].resources)
      })
    }).catch(err=>{
      console.log('err: ' , err)
   
      this.setData({
        err: JSON.stringify(err)
      })
    })

    // console.log('eeee: '  ,e)
    // console.log(this.data.local)
    // if(this.data.local == 'from'){
    //   console.log('from: '  ,e)
    // }else if(this.data.local == 'to'){
    //   console.log('to: '  ,e)
    // }
  },

  getCallout() {
    let calloutContent = ""
    let language = app.globalData.language;
    if (this.data.local == "from") {
      if (language == '中文') {
        calloutContent = "设为提货地址"
      } else {
        calloutContent = 'Set as pick-up address'
      }
    } else if (this.data.local == "to") {
      if (language == '中文') {
        calloutContent = "设为收货地址"
      } else {
        calloutContent = "Set as delivery address"
      }
    }
    return {
      content: calloutContent,
      fontSize: 14,
      padding: 12,
      color: '#434343',
      display: 'ALWAYS',
      borderRadius: 10,
      anchorY: -8
    }
  },

  async handleGetLocal() {
    //! 点击当前目的地地址获取地方位置
    try {
      let res = await getSettingAPI();
      if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
        console.log('未授权地理位置信息');
        wx.showModal({
          title: '是否授权当前位置',
          content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
          success: async function (res) {
            if (res.cancel) {
              console.info("1授权失败返回数据");
            } else if (res.confirm) {
              //village_LBS(that);
              try {
                let data = await openSettingAPI();
                console.log(data);
                if (data.authSetting["scope.userLocation"] == true) {
                  wx.showToast({
                    title: '授权成功',
                    icon: 'success',
                    duration: 5000
                  })
                } else {
                  wx.showToast({
                    title: '授权失败',
                    icon: 'success',
                    duration: 5000
                  })
                }
              } catch (e) {
                console.log('---------------打开授权失败', e);
              }
            }
          }
        });
      } else {
        console.log('已授权地理位置信息');
      }
    } catch (e) {
      console.log('---------------获取用户授权信息失败', e);
    }
    let res = await wx.getLocation({ type: 'gcj02' })

    let markers = {
      iconPath: "../image/icon/icon-tuding.png",
      id: 0,
      zIndex:1,
      callout: this.getCallout(),
      latitude: res.latitude,
      longitude: res.longitude,
      width: mapMarkerWidth,
      height: mapMarkerHeight
    };

    markers = [markers]
    // wx.getLocation().then(res=>{
    //   console.log('resssssss: '  , res)
    // })
    console.log('res: ', res)
    this.setData({
      longitude: res.longitude,
      latitude: res.latitude,
      markers: markers
    })
    let registrationResult = app.globalData.registrationResult
    let getParams={
      data: null
    };
    let language = 'zh-Hans';
    console.log('语言：' , app.globalData.language)
    app.globalData.language=='中文'? language = 'zh-Hans': language ='en';
    console.log('language: ' ,  language)
    let resd = await libs.request('get', `https://dev.virtualearth.net/REST/v1/Locations/${this.data.latitude},${this.data.longitude}?include=ciso2&key=Ale77js9zOT7TWyDZpbTwrNf7kDuDllOStIxLYRKueXrN3XFWZMgZFm7V8r5vM93&culture=${language}&userIp=127.0.0.1`, {}, registrationResult ,false);
    console.log('getParams: ', getParams)
    getParams.data= bindChange(resd.data.resourceSets[0].resources)[0];
    console.log('getParams: ' , getParams )
    // addressInform:{
    //   addressLine:null,
    //   address:'',
    //   local:''
    // }
    let addressInform = {
      addressLine: getParams.data,
      address: getParams.data.formattedAddress,
      local: this.data.local
    }
    this.setData({
      addressInform: addressInform
    })
    console.log('addressInform:'   , addressInform)

  },
  handleMapClick(e) {
    //! 点击搜索 获取位置
    console.log('---------------------------')
    console.log('地图选择:', e);
    let addressInform = e.detail;

    console.log('addressInform: ', addressInform)
    this.setData({
      addressInform: addressInform
    })
    let markers = {
      iconPath: "../image/icon/icon-tuding.png",
      id: 0,
      zIndex:1,
      callout: this.getCallout(),
      latitude: 0,
      longitude: 0,
      width: mapMarkerWidth,
      height: mapMarkerHeight
    }
    if (addressInform.local == "from") {
      // app.globalData.addressFrom = addressInform.addressLine;
      // console.log('addressFrom: '  ,app.globalData.addressFrom)
      markers = { ...markers, latitude: addressInform.addressLine.latLng.latitude, longitude: addressInform.addressLine.latLng.longitude }
      markers = [markers]
      console.log('markers: ', markers)
      this.setData({
        longitude: addressInform.addressLine.latLng.longitude,
        latitude: addressInform.addressLine.latLng.latitude,
        markers: markers
      })
    } else if (addressInform.local == "to") {
      // app.globalData.addressTo = addressInform.addressLine;
      markers = { ...markers, latitude: addressInform.addressLine.latLng.latitude, longitude: addressInform.addressLine.latLng.longitude }
      markers = [markers]
      this.setData({
        longitude: addressInform.addressLine.latLng.longitude,
        latitude: addressInform.addressLine.latLng.latitude,
        markers: markers
      })
    }
    // console.log('address!!!!!: '  ,this.data.addressFromTo)
    // app.globalData.addressFromTo = this.data.addressFromTo;
    console.log('全局路由绑定from： ', app.globalData.addressFrom)
    console.log('全局路由绑定to： ', app.globalData.addressTo)


  },
  handleFocus(e) {
    console.log('获得焦点时')

    wx.onKeyboardHeightChange(res => {
      console.log('res', res.height)
      this.setData({
        isHeight: res.height * 2 + 30
      })
      if (res.height == 0) {
        this.setData({
          isHeight: 48
        })
      }
    })
    this.setData({
      isFocus: true
    })
  },
  handleBlur(e) {
    console.log('失去焦点时')

    this.setData({
      isFocus: false,
      isHeight: 48
    })
  },


  markertap(e) {
    console.log(e.detail.markerId)
  },
  async handleCallOut() {
    // console.log(e)
    console.log('你好')
    console.log('this.data.', this.data.addressInform)
    let addressInform = this.data.addressInform
    //! 是用 正常搜索获取的地址
    if (addressInform.local == 'from') {
      app.globalData.addressFrom = addressInform.addressLine;
      wx.navigateBack()
    }
    if (addressInform.local == 'to') {
      app.globalData.addressTo = addressInform.addressLine;
      wx.navigateBack()
    }


  }

})