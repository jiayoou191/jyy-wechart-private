// pages/moreGoods/moreGoods.js
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    formInline: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let pageTitle = '添加货物';
    if (app.globalData.language != '中文') {
      pageTitle = 'Add goods';
    }
    wx.setNavigationBarTitle({
      title: pageTitle
    });
    console.log('我进来了 moregoods')
    console.log('moregoods: ', app.globalData.formInline)
    this.setData({
      formInline: app.globalData.formInline
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
  onShow: function () {

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