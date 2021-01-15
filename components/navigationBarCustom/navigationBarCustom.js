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
        userPhoto: {
            type: String,
            value: ''
        },
        totalBar: {
            type: Number,
            value: 64
        },
        navBarHeight: {
            type: Number,
            value: 44
        },
        toolBarHeight: {
            type: Number,
            value: 20
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        // languageName:app.globalData.language=='中文'?'语言':'language',
        language:  app.globalData.language == '中文'?require('../../utils/locales/zh/order').default:require('../../utils/locales/en/order').default,
        languagePic: '../../pages/image/icon/language.svg'


    },
    options: {
        multipleSlots: true,
    },

    /**
     * 组件的方法列表
     */
    ready() {
        console.log('组件渲染时间测试');
        this.setData({
            language:  app.globalData.language == '中文'?require('../../utils/locales/zh/order').default:require('../../utils/locales/en/order').default
        })
    },
    methods: {
        jumpUser() {
            console.log("跳转到个人中心页面");
            wx.navigateTo({
                url: '/pages/user/user'
            });
        },
        
        handleLanguageChange(){
            // this.setData({
            //     languagePic:'../../pages/image/icon/languageactive.svg'
            // })
            let lang = '中文'
            if(app.globalData.language == '中文'){
                console.log('eng')
                app.globalData.language = 'English'
                wx.setStorageSync('weChartLanguage', 'English')
                this.setData({
                    languageName:'语言'
                })
                lang = 'English'
            }else{
                console.log('中文')
                app.globalData.language = '中文'
                wx.setStorageSync('weChartLanguage', '中文')
                this.setData({
                    languageName:'language'
                })
                lang = '中文'

            }
            this.triggerEvent('onLanguage', lang)   

        },
        handleTouchstart(){
            console.log('触发')
            this.setData({
                languagePic:'../../pages/image/icon/languageactive.svg'
            })
        }
    },

})