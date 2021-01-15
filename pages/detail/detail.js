// import * as watch from "../../utils/watch"
let app = getApp()
import libs from '../../utils/index'
import * as util from '../../utils/help'
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog'
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';


// import Dialog from '../../miniprogram_npm/@vant/weapp/dist/dialog/dialog';



Page({
    data: {
        needPlan: null,
        allPlan: null,
        query: null,
        isShow: false,
        isPlanShow: false,
        boxes: [],
        checkIndex: 999,
        currency: 'CNY',
        planChooseIndex: {},
        language: app.globalData.language == '中文' ? require('../../utils/locales/zh/detail').default : require('../../utils/locales/en/detail').default
    },
    async onLoad(options) {
        let pageTitle = '方案详情';
        if (app.globalData.language != '中文') {
            pageTitle = 'Plan detail';
        }
        wx.setNavigationBarTitle({
            title: pageTitle
        });
        let allPlan = app.globalData.allPlan;
        // ! 定位不同运输方式当前方案在更多方案中的索引位置
        this.findPlanIndex();
        // let optionalPlans = app.globalData.optionalPlans;
        // allPlan.map(item => {
        //     let optionalPlan = [];
        //     switch(item.transportType){
        //         case "ShippingFCL":
        //         case "ShippingLCL":{
        //             optionalPlan = optionalPlans.optionalShippingPlans;
        //             break;
        //         }
        //         case "RailwayFCL":
        //         case "RailwayLCL":{
        //             optionalPlan = optionalPlans.optionalRailPlans;
        //             break;
        //         }
        //         case "Air":{
        //             optionalPlan = optionalPlans.optionalAirPlans;
        //             break;
        //         }
        //         case "Express":{
        //             optionalPlan = optionalPlans.optionalExpressPlans;
        //             break;
        //         }
        //     }
        //     if(optionalPlan){
        //         optionalPlan.forEach((plan,index)=>{
        //             if(item.id == plan.id){
        //                 planChooseIndex[item.transportType] = index;
        //             }
        //         });
        //     }
        // });
        let needPlan = app.globalData.needPlan;
        let query = app.globalData.query;
        let index = app.globalData.needPlanIndex;
        
        this.setData({
            allPlan: [...allPlan],
            needPlan: {
                needPlan: {
                    ...needPlan
                },
                index: index
            },
            query: {
                ...query
            },
        })
        // console.log('needPlan: ' , this.data.needPlan ,'allPlan: '  ,this.data.allPlan )
        let registrationResult = app.globalData.registrationResult

        const {
            data
        } = await libs.request(
            'get',
            '/box/list/type/shipping', {}, registrationResult
        )
        this.setData({
            boxes: data.boxes
        })
        // console.log('boxes: ' , this.data.boxes)


    },
    onShow() {
        this.setData({
            currency: app.globalData.currency
        });
    },
    // ! 汇率切换计算
    currencyChange(event) {
        let currency = event.detail.detail;
        this.setData({
            currency
        });
    },
    handleBoxClick() {
        // console.log('aaaaaaa')
        this.setData({
            isShow: true
        })

    },
    findPlanIndex(){
        let allPlan = app.globalData.allPlan;
        let planChooseIndex = {};
        let optionalPlans = app.globalData.optionalPlans;
        // ! 定位不同运输方式当前方案在更多方案中的索引位置
        allPlan.map(item => {
            let optionalPlan = [];
            switch(item.transportType){
                case "ShippingFCL":
                case "ShippingLCL":{
                    optionalPlan = optionalPlans.optionalShippingPlans;
                    break;
                }
                case "RailwayFCL":
                case "RailwayLCL":{
                    optionalPlan = optionalPlans.optionalRailPlans;
                    break;
                }
                case "Air":{
                    optionalPlan = optionalPlans.optionalAirPlans;
                    break;
                }
                case "Express":{
                    optionalPlan = optionalPlans.optionalExpressPlans;
                    break;
                }
            }
            if(optionalPlan){
                optionalPlan.forEach((plan,index)=>{
                    if(item.id == plan.id){
                        planChooseIndex[item.transportType] = index;
                    }
                });
            }
        });
        this.setData({
            planChooseIndex
        });
    },
    handleBoxClose() {
        this.setData({
            isShow: false
        })
    },
    handleTabChange({
        detail
    }) {
        this.setData({
            checkIndex: detail,
            needPlan: { ...this.data.allPlan[detail] }
        })
    },
    handlePlanChoose(e) {
        //! 选择更多方案打开按钮
        console.log('aaa')
        this.setData({
            isPlanShow: true
        })
    },
    handlePlanClose() {
        //! 选择更多方案关闭按钮
        this.setData({
            isPlanShow: false
        })
    },
    handlePlanNeedChoose({
        detail
    }) {
        //! 选择更多方案切换了方案
        app.globalData.planWhitchChoose = 'plan'
        console.log('------------detail', detail);
        let { item, index } = detail;
        let idx = 999;
        this.data.allPlan.map((i, j) => {
            if (i.planCardType == item.planCardType) {
                idx = j
            }
        })
        let allPlan = this.data.allPlan;
        let planChooseIndex = this.data.planChooseIndex;
        planChooseIndex[item.transportType] = index;
        allPlan.splice(idx, 1, item);
        this.setData({
            isPlanShow: false,
            allPlan: allPlan,
            needPlan: { ...item },
            planChooseIndex
        });
    },

    async handleBoxOk({ detail }) {
        //! 切换箱型
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
        app.globalData.loadingBoxes = true
        //    console.log('detail: '  , detail)
        //    console.log('query: '   , this.data.query)
        let query = this.data.query;
        let data = {
            item_type_id: query.itemType.id,
            from_address_json: JSON.stringify(query.from),
            to_address_json: JSON.stringify(query.to),
            searchable_items: JSON.stringify(query.items),
            shipping_boxes: JSON.stringify(detail)
        }
        let registrationResult = app.globalData.registrationResult;
        const res = await libs.request('post', '/search', {
            from_address_json: data.from_address_json,
            to_address_json: data.to_address_json,
            item_type_id: data.item_type_id,
            searchable_items: data.searchable_items,
            shipping_boxes: data.shipping_boxes,
            opt_currencies: 'EUR,USD'
        },registrationResult);

        console.log('resssssssss: ', res)
        let queryId = res.data.id;
        app.globalData.queryId = queryId;
        const resPlan = await libs.request('get', `/query_history/${queryId}`, {}, registrationResult)
        if (resPlan.statusCode === 200) {
            // 数据获取成功  添加到 allplan 和 searchlist
            // this.addAllPlan(res.data);
            Toast.clear();
            app.globalData.loadingBoxes = false
            let getPlan = util.addAllPlan(resPlan.data);
            app.globalData.optionalPlans = JSON.parse(JSON.stringify(getPlan.optionalPlans));
            app.globalData.allPlan = JSON.parse(JSON.stringify(getPlan.allPlan));
            app.globalData.query = JSON.parse(JSON.stringify(getPlan.query));
            console.log('optionalPlans: ', app.globalData.optionalPlans)
            //!  切换箱型后,重新定位运输方案的索引
            this.findPlanIndex();
            app.globalData.planWhitchChoose ='box'
            this.setData({
                //searchInfo: res,
                allPlan: getPlan.allPlan,
                query: getPlan.query,
                isShow: false,
            })



        } else {
            Toast.clear();

            Notify('您查询的过于频繁, 请休息会再试')
            console.log('更改失败')
            this.setData({
                isShow: false
            })
        }

    },

    handleBoxCancel() {
        this.setData({
            isShow: false
        })
    },

    async handleKeFuHelp({
        detail
    }) {
        console.log(detail)

    },
    handleCreate(e) {
        //!创建订单
        console.log('e 创建订单: ', e);
        wx.navigateTo({
            url: "/pages/review/review"
        });
        // let plan_id = e.detail.id;
        // let query_id = this.data.query.id;
        // let transport_type = e.detail.transportType;
        // console.log('plan_id: ', plan_id, "query_id: ", query_id);
        // let registrationResult = app.globalData.registrationResult;
        // 这里原本是直接下单，现在需要跳转到订单确认页面
        // libs.request('post', '/order/create', {
        //     plan_id: plan_id,
        //     query_id: query_id,
        //     transport_type: transport_type,
        // },registrationResult).then(res => {

        //   console.log('查询啦： ', res.data);
        //     console.log('传成功')
        //     Dialog.alert({
        //         message: '您已成功下单，从'+res.data.query.from.formattedAddress+'到'+res.data.query.to.formattedAddress+'的物流服务，订单号为'+res.data.id+'，我们客服会尽快联系您，请保持电话通畅。您可在简宜运官网实时查询订单进度。如有疑问请拨打全国24小时客服电话400-070-5156',
        //         confirmButtonText: '返回首页'
        //       }).then(() => {
        //         // on close
        //         // wx.redirectTo({
        //         //     url: '../home/home' 
        //         //   })
        //         wx.navigateBack({
        //             delta: 2
        //         })
        //       });

        // }).catch(err => {
        //     console.log('err:!!! '   ,err)
        // })
    }



    // 计算3段

    // 筛选出剩余plan的方法








    //! 修改运输方案的类型




})