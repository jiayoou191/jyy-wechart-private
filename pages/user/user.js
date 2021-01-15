import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
let app = getApp();
let language = app.globalData.language == '中文' ? require('../../utils/locales/zh/order').default : require('../../utils/locales/en/order').default;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户头像
    userPhoto: '/pages/image/icon/icon-contact.png',
    // 用户昵称
    nickName: '',
    menuList: [{
      label: language.concact,
      icon: '../image/icon/icon-service.png',
      append: true,
      code: 'contact'
    },
    {
      label: language.language,
      icon: '../image/icon/icon-language.png',
      append: true,
      code: 'language'
    },
    {
      label: language.version,
      icon: '../image/icon/icon-version.png',
      append: false,
      code: 'version'
    },

    ],
    islanguageShow: false, //! 语言切换弹出层打开
    radio: 'zh',
    version: '1.7.02',
    languageFlag: '中文',
    language: app.globalData.language == '中文' ? require('../../utils/locales/zh/order').default : require('../../utils/locales/en/order').default
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    if (options.openOrders) {
      this.jumpMyOrder();
    }
    let {
      registrationResult
    } = app.globalData;
    let {
      userPhoto
    } = this.data;
    let nickName = registrationResult.user.nickName;
    if (registrationResult.user.avatar != null) {
      let {
        id,
        storageObjectTag
      } = registrationResult.user.avatar;
      userPhoto = `https://jyy-binary-storage.oss-cn-shanghai.aliyuncs.com/${storageObjectTag}/${id}`;
    }
    this.setData({
      userPhoto,
      nickName
    });
  },
  // 查看我的订单
  jumpMyOrder() {
    wx.navigateTo({
      url: "/pages/myOrder/myOrder"
    });
  },
  //! 语言切换 菜单关闭
  handleClose() {
    this.setData({
      islanguageShow: false
    })
  },
  onChange(event) {
    this.setData({
      radio: event.detail,
    });
  },
  onClick(event) {
    const { name } = event.currentTarget.dataset;
    console.log('name:', name)
    this.setData({
      radio: name,
    });
    let pageTitle = '个人中心';


    if (name == 'zh') {
      app.globalData.language = '中文'
      wx.setStorageSync('weChartLanguage', '中文')
      console.log('app.globalData.language: ', app.globalData.language)
      this.setData({
        islanguageShow: false,
        language: app.globalData.language == '中文' ? require('../../utils/locales/zh/order').default : require('../../utils/locales/en/order').default

      }, () => {
        language = app.globalData.language == '中文' ? require('../../utils/locales/zh/order').default : require('../../utils/locales/en/order').default;
        this.setData({
          menuList: [{
            label: language.concact,
            icon: '../image/icon/icon-service.png',
            append: true,
            code: 'contact'
          },
          {
            label: language.language,
            icon: '../image/icon/icon-language.png',
            append: true,
            code: 'language'
          },
          {
            label: language.version,
            icon: '../image/icon/icon-version.png',
            append: false,
            code: 'version'
          },

          ],
        });
      })
    } else {
      pageTitle = 'Personal center';
      wx.setStorageSync('weChartLanguage', 'English')
      app.globalData.language = 'English'
      console.log('app.globalData.language: ', app.globalData.language)
      this.setData({
        islanguageShow: false,
        language: app.globalData.language == '中文' ? require('../../utils/locales/zh/order').default : require('../../utils/locales/en/order').default
      }, () => {
        language = app.globalData.language == '中文' ? require('../../utils/locales/zh/order').default : require('../../utils/locales/en/order').default;
        this.setData({
          menuList: [{
            label: language.concact,
            icon: '../image/icon/icon-service.png',
            append: true,
            code: 'contact'
          },
          {
            label: language.language,
            icon: '../image/icon/icon-language.png',
            append: true,
            code: 'language'
          },
          {
            label: language.version,
            icon: '../image/icon/icon-version.png',
            append: false,
            code: 'version'
          },

          ],
        });
      })
    }
    wx.setNavigationBarTitle({
      title: pageTitle
    });
  },
  //! 菜单点击
  menuClick(event) {
    let code = event.currentTarget.dataset.code;
    if (code == 'language') {
      console.log('language!!!!')
      this.setData({
        islanguageShow: true
      })
    }
    if (code == 'terms') {
      //!  服务条款点击
      console.log("-----------用户点击了服务条款");
      Toast.loading({
        mask: true,
        duration: 0,
        message: '服务条款加载中...',
      });
      // ! 向用户展示服务条款
      let url = 'https://jyy-binary-storage.oss-cn-shanghai.aliyuncs.com/files/tos-mobile.pdf';
      let fileID = '服务条款';
      if (app.globalData.language == '中文') {
        url = 'https://jyy-binary-storage.oss-cn-shanghai.aliyuncs.com/files/tos-mobile.pdf';
        fileID = '服务条款';
      } else {
        url = 'https://jyy-binary-storage.oss-cn-shanghai.aliyuncs.com/files/tos-mobile-en.pdf';
        fileID = 'Terms of Service';
      }
      wx.downloadFile({
        url: url,
        success: function (res) {
          const filePath = res.tempFilePath;
          console.log('-------filePath', filePath);
          wx.openDocument({
            filePath: filePath,
            success: function (res) {
              console.log('打开文档成功');
            },
            fail: res => {
              console.log('----打开失败了', res);
            },
          });
        },
        fail: () => {
          Notify({
            type: 'error',
            message: '下载文档失败'
          });
        },
        complete: () => {
          Toast.clear();
        }
      })
      // Toast.clear();
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let language = app.globalData.language
    if (language == 'English') {
      this.setData({
        radio: 'en',
      })
    } else {
      this.setData({
        radio: 'zh',
      })
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let pageTitle = '个人中心';
    if (app.globalData.language != '中文') {
      pageTitle = 'Personal center';
    }
    wx.setNavigationBarTitle({
      title: pageTitle
    });
    if (this.data.languageFlag != app.globalData.language) {
      this.setData({
        languageFlag: app.globalData.language,
        islanguageShow: false,
        language: app.globalData.language == '中文' ? require('../../utils/locales/zh/order').default : require('../../utils/locales/en/order').default
      }, () => {
        language = app.globalData.language == '中文' ? require('../../utils/locales/zh/order').default : require('../../utils/locales/en/order').default;
        this.setData({
          menuList: [{
            label: language.concact,
            icon: '../image/icon/icon-service.png',
            append: true,
            code: 'contact'
          },
          {
            label: language.language,
            icon: '../image/icon/icon-language.png',
            append: true,
            code: 'language'
          },
          {
            label: language.version,
            icon: '../image/icon/icon-version.png',
            append: false,
            code: 'version'
          },

          ],
        });
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