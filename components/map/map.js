// components/map/map.js
import country from '../../utils/locales/zh/country'
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify'



let app = getApp()


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    local: String,
    searchContent:Array,
    loadIsShow: Boolean //!菊花是否旋转

  },

  /**
   * 组件的初始数据
   */
  data: {
    // address:'',
    // addressLine:null,
    isShow: false ,  //!  是否显示 下拉列表
    country:country,
    isFocus:false,
    address:'',
    addressInform:{
      addressLine:null,
      address:'',
      local:''
    },
    languageFlag: '中文' ,
    language: app.globalData.language == '中文' ? require('../../utils/locales/zh/map').default : require('../../utils/locales/en/map').default,

  },


  /**
   * 组件的方法列表
   */
  methods: {
    onChange(e){
      //!  监听状态变化 
      console.log('!!!!!!!!!!!!')
      console.log('e: '  , e)
      if(e.detail){
        this.setData({
          isShow: true
        })
      }else{
        this.setData({
          isShow: false
        })
      }
      //!  如果用组件 则 用这
      this.setData({
        address: e.detail
      })
      this.triggerEvent('onChange' , e.detail)

      //!  如果用input原生  则用 
      // this.setData({
      //   address: e.detail.value
      // })
      // this.triggerEvent('onChange' , e.detail.value)

    },
    handleClearable(){
        //! 清空输入内容
        this.setData({
          address:'',
          isShow: false
        })
    },
    showNotify(message) {
      Notify({
        message: message,
        // message: '\n' + message + '\n\n',
        // duration: 0,
        top: this.data.NotifyTop,
      })
    },
    handleFocus(e){
      console.log('handleFocus')
      console.log('获得焦点时')
      // this.setData({
      //   isFocus: true
      // })
      this.triggerEvent('onFocus' , true)
    },
    // doSearch(){
    //   //! 会车搜素监听
    //   console.log(123445)
    // },
    handleSearch: function(e) {
      console.log('!!!!!!!!')
      console.log('!!!!!!!!')
      console.log('!!!!!!!!')
      console.log('!!!!!!!!')
      console.log('!!!!!!!!')

      console.log(e)
      console.log(e.detail)
      console.log('value: '  ,this.data.address)
      this.triggerEvent('onChange' , this.data.address)

      
   },
    handleBlur(e){
      console.log('handleBlur')
      console.log('失去焦点时:address '   ,  this.data.address)
      console.log(e)
      console.log(e.detail)

      // this.setData({
      //   isFocus: false
      // })
      // console.log('失去焦点： '  , e)
      // this.triggerEvent('onChange' , e.detail)

      this.triggerEvent('onBlur' , false)

    },
    handleClear(){
      console.log('handleClear')
    this.setData({
          isFocus: true
        })
    },
    handleAddressChoose(e){
      console.log('e: '  ,e);
      let addressLine = e.currentTarget.dataset.address
      // addressLine = {...addressLine , local:this.data.local}
      // console.log('addressLine: ' ,addressLine)
      this.setData({
        isShow: false,
        addressInform:{
          address: addressLine.formattedAddress,
          addressLine: addressLine,
          local:this.data.local
        },
      })
      console.log('addressInform: ',this.data.addressInform);
      this.triggerEvent('onClick' , this.data.addressInform)


    }
  },
  ready:function(){
    console.log('!!!!!!!!!!!!!!!!')
    // wx.getAccountInfoSync(res=>{
    //   console.log('res:'  , res)
    // })
    wx.onNetworkStatusChange(res => {
      if(!res.isConnected){
        let message = ''
        if(app.globalData.language =='中文'){
          message =  '请检查您当前的网络环境, 当前网络不可用'
        }else{
          message =  'Please check your current network environment, the current network is not available.'
        }
        this.showNotify(message)
  
      }
    })
  },
  pageLifetimes: {
    show: function() {
      this.setData({
        isFocus: true
      })
      if(this.data.languageFlag !=  app.globalData.language){
        this.setData({
          languageFlag: app.globalData.language ,
          language: app.globalData.language == '中文' ? require('../../utils/locales/zh/map').default : require('../../utils/locales/en/map').default,
        })
     
      }
      // 页面被展示
      // console.log('++++++++++++++++++++++++++++++++++++++++++++')
      // console.log('searchContent:', this.properties.searchContent)
      // console.log('全局路由绑定from： ' , app.globalData.addressFrom)
      // console.log('local' ,this.properties.local )
      if(this.properties.local =="from" && app.globalData.addressFrom){
        console.log(' 我进来了')
        this.setData({
          addressInform:{
            addressLine:app.globalData.addressFrom,
            address:app.globalData.addressFrom.formattedAddress,
            local:'from'
          },
          address:app.globalData.addressFrom.formattedAddress

        })
      }else if(this.properties.local =="to" && app.globalData.addressTo){
        
        this.setData({
          addressInform:{
            addressLine:app.globalData.addressTo,
            address:app.globalData.addressTo.formattedAddress,
            local:'to'
          },
          address:app.globalData.addressTo.formattedAddress

        })
      }
    },
    hide: function() {
      // 页面被隐藏
    },
    resize: function(size) {
      // 页面尺寸变化
    }
  }
})
