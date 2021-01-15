// components/priceDetail/priceDetail.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    needPlan: {
      type: Object,
      value: null
    },
    truckPlan:{
      type: Object,
      value: null
    },
    currency: {
      type: String,
      value: 'CNY'
    },
    language: {
      type: Object,
      value: null
    },
    languageFlag: {
      type: String,
      value: '中文'
    },
    totalPrice: {
      type: Number,
      value: null
    },
    queryType: {
      type: String,
      default: 'All'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    modalShow: false,
    modalType: 'prices_start'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showModal(event) {
      this.setData({
        modalShow: true,
        modalType: event.currentTarget.dataset.modaltype
      });
    },
    onModalClose() {
      this.setData({
        modalShow: false
      });
    }
  }
})
