// components/coverInput/coverInput.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    inputInfo:'请输入地址',
    inputFocus:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapInput() {
      this.setData({
          //在真机上将焦点给input
          inputFocus:true,
          //初始占位清空
          inputInfo: ''
      });
  },
  blurInput(e) {
    console.log('edetail: '  , e.detail.value)
    this.setData({
        inputInfo: e.detail.value || '请输入地址'
    });
}
  }

})
