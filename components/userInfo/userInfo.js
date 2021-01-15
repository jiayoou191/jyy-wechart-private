// components/userInfo/userInfo.js
import {
  watch
} from "../../utils/watcher";
let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    contact: {
      type: Object,
      value: null
    },
    rightTitle: {
      type: String,
      value: ''
    },
    hasCheckBox: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    formData: {
      id: '',
      name: '',
      address: '',
      landlineNumber:'',
      faxNumber:'',
      phone: '',
      email: '',
      otherInfo: ''
    },
    notifyIsSame: false,
    sysScroll: false,
    focusAble: 'none',
    // errText: {
    //   userName: '姓名格式不正确!',
    //   address: '',
    //   phone: '',
    //   email: '',
    //   otherInfo: ''
    // },
    // reg: {
    //   userName: '',
    //   address: '',
    //   phone: '',
    //   email: '',
    //   otherInfo: ''
    // },
    languageFlag: '中文',
    language: app.globalData.language == '中文' ? require('../../utils/locales/zh/bookPreview').default : require('../../utils/locales/en/bookPreview').default
  },

  /**
   * 组件的方法列表
   */
  attached: function () {
    if(this.data.languageFlag !=  app.globalData.language){
      this.setData({
        languageFlag: app.globalData.language,
        language: app.globalData.language == '中文' ? require('../../utils/locales/zh/bookPreview').default : require('../../utils/locales/en/bookPreview').default
      })
    }
  },
  methods: {
    changeFormData(event) {
      let {
        formData
      } = this.data;
      let key = event.currentTarget.dataset.formItem;
      formData[key] = event.detail.value;
      this.setData({
        formData
      });
      this.triggerEvent('changeFormData');
    },
    selectUser() {
      if (this.data.notifyIsSame) {
        return false;
      }
      this.triggerEvent('selectUser');
    },
    checkedChange() {
      this.setData({
        notifyIsSame: !this.data.notifyIsSame
      });
      this.triggerEvent('checkedChange');
    },
    handleFocus() {
      this.setData({
        sysScroll: false
      })
    },
    handleBlur() {
      this.setData({
        sysScroll: true
      })
    },
    nextFocus(event) {
      let key = event.currentTarget.dataset.formItem;
      console.log('当前输入框确认了，下一个输入框要获取焦点', key);
      let focusAble = 'none';
      switch (key) {
        case 'name': {
          focusAble = 'address';
          break;
        }
        case 'address': {
          focusAble = 'phone';
          break;
        }
        case 'phone': {
          focusAble = 'landlineNumber';
          break;
        }
        case 'landlineNumber': {
          focusAble = 'faxNumber';
          break;
        }
        case 'faxNumber': {
          focusAble = 'email';
          break;
        }
        case 'email': {
          focusAble = 'otherInfo';
          break;
        }
        case 'otherInfo': {
          focusAble = 'none';
          break;
        }
      }
      this.setData({
        focusAble
      });
    }
  },
  ready() {
    this.setData({
      notifyIsSame: this.data.hasCheckBox
    });
    watch(this, {
      contact(newValue) {
        let formData = {
          id: '',
          name: '',
          address: '',
          landlineNumber:'',
          faxNumber:'',
          phone: '',
          email: '',
          otherInfo: '',
        };
        if (newValue != null) {
          formData = {
            id: newValue.id,
            name: newValue.name,
            address: newValue.address,
            landlineNumber:newValue.landlineNumber,
            faxNumber:newValue.faxNumber,
            phone: newValue.phone,
            email: newValue.email,
            otherInfo: newValue.otherInfo,
          };
        }
        this.setData({
          formData
        });
      },
    })
  }
})