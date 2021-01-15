// pages/price/price.js
let app = getApp()

import libs from '../../utils/index'
import countries from '../../utils/locales/zh/country'
import * as util from '../../utils/help'
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify'
import {
    getSystemInfoAPI
} from '../../utils/help'


Page({
    /**
     * 页面的初始数据
     */
    data: {
        // queryid 拿到的信息
        searchInfo: null,
        query: null,
        // 海陆空国际快递
        allPlan: null,
        countries: countries,
        queryId: '',
        windowHeight: null,
        languageFlag: "中文",
        currency: app.globalData.currency,
        isShipperOrConsignee: app.globalData.isShipperOrConsignee,
        incoterms: app.globalData.incoterms,
        language: app.globalData.language == '中文' ? require('../../utils/locales/zh/price').default : require('../../utils/locales/en/price').default
    },

    /**
     * 生命周期函数--监听页面加载
     */
    async onLoad(options) {
        let pageTitle = '推荐方案';
        if (app.globalData.language != '中文') {
            pageTitle = 'Recommended plans';
        }
        wx.setNavigationBarTitle({
            title: pageTitle
        });
        try {
            let res = await getSystemInfoAPI();
            console.log('res:  ', res)
            //    res.windowHeight*2-160-100
            this.setData({
                windowHeight: res.windowHeight * 2
            })
        } catch (e) {
            console.log('---------获取设备信息异常', e);
        }
        app.globalData.queryId = '';

        console.log('options', options);
        const queryId = options.query_id
        this.setData({
            queryId: queryId,
            query: null,
            allPlan: null,
        })
        app.globalData.queryId = queryId

        console.log('queryId: ', this.data.queryId)
        let registrationResult = app.globalData.registrationResult
        //! 正常用户使用
        //? 只有一个的id 200603083822Ns14adfH
        //? 有1个 200602062524IU1BBCZl
        //? 有4个 200529050623X6eDbyKh
        //? 多id 200604075205w1KBia4T
        //? 有破损 200603054217hOl6LkgM
        const res = await libs.request('get', `/query_history/${queryId}`, {}, registrationResult)
        //! 未登录用户 写死
        // const res = await libs.request(
        //     'get',
        //     '/query_history/200603054217hOl6LkgM', {}, registrationResult
        // )



        //! 登录用户 写死
        // const res = await libs.request(
        //     'get',
        //     '/query_history/200603054217hOl6LkgM', {}
        // )
        // console.log('打印请求回来的数据', res)


        //! 把拿到的数据存储
        if (res.statusCode === 200) {
            // 数据获取成功  添加到 allplan 和 searchlist
            console.log('data:', res.data)
            let getPlan = util.addAllPlan(res.data);
            console.log('getPlan:', getPlan)
            this.setData({
                //searchInfo: res,
                allPlan: getPlan.allPlan,
                query: getPlan.query,
                optionalPlans: getPlan.optionalPlans
            })
            app.globalData.allPlan = JSON.parse(JSON.stringify(getPlan.allPlan));
            app.globalData.query = JSON.parse(JSON.stringify(getPlan.query));
            app.globalData.optionalPlans = JSON.parse(JSON.stringify(getPlan.optionalPlans));


        } else {
            console.log('查询失败')
            Notify('不小心开了个小差,请重新查询')
        }
    },

    onShow() {
        this.setData({
            currency: app.globalData.currency,
            isShipperOrConsignee: app.globalData.isShipperOrConsignee,
            incoterms: app.globalData.incoterms,
        });
        if (this.data.queryId != app.globalData.queryId) {
            this.setData({
                allPlan: JSON.parse(JSON.stringify(app.globalData.allPlan)),
                query: JSON.parse(JSON.stringify(app.globalData.query)),
                queryId: JSON.parse(JSON.stringify(app.globalData.queryId))
            })
        }
        if (this.data.languageFlag != app.globalData.language) {
            this.setData({
                languageFlag: app.globalData.language,
                language: app.globalData.language == '中文' ? require('../../utils/locales/zh/price').default : require('../../utils/locales/en/price').default
            })
        }
    },

    // 去详细信息页
    handlePlanClick({
        detail
    }) {
        console.log('index11111:', detail)
        console.log('this.data.queryId: ', this.data.queryId)
        wx.navigateTo({
            url: '../detail/detail?query_id=' + this.data.queryId,
        })
        const app = getApp();
        // app.globalData.allPlan = this.data.allPlan;
        // app.globalData.query = this.data.query;
        app.globalData.needPlan = JSON.parse(JSON.stringify(detail.needPlan));
        app.globalData.needPlanIndex = JSON.parse(JSON.stringify(detail.index));

        // const allPlan = app.globalData.allPlan;
        // const needPlan = app.globalData.needPlan;
        // const query = app.globalData.query;
        // const index = app.globalData.needPlanIndex;


        // console.log(' allPlan: '  ,allPlan)
        // console.log(' query: '  ,needPlan)
        // console.log(' needPlan: '  ,query)
        // console.log(' index: '  ,index)

    },
    handleCallPhone() {
        //! 拨打电话号码
        wx.makePhoneCall({
            phoneNumber: '021-56876568'
        })
    }
})