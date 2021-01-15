App({
    onLaunch() {
    },
    globalData: {
        registrationResult: null,
        accessibleItemTypes: null,
        formType: null,
        planChoose: [],
        //! 查询方案名称重量体积的存储
        formInline: [{
            name: '',
            weight: '',
            volume: '',
        }],
        //! 查询方案地址的存储
        addressFrom: null,
        addressTo: null,
        //! 所有计划的存储
        allPlan: [],
        query: null,
        optionalPlans: null, //! 存储更多计划
        queryId: '',
        needPlan: null,
        needPlanIndex: 999,
        from_address: '',
        to_address: '',
        price: 0,
        // 来自发货地址 start 还是 收货地址 final
        from: '',
        // price页面 完整的信息
        completeInfo: {},
        detailInfo: null,
        show: false,
        order_meta: null,
        // 创建订单之后保存的订单信息
        order_info: null,
        // 订单详情页面的数据
        order_detail: null,
        // 语言环境
        // language: 'English',
        language: '中文',
        // 用户设备窗口高度
        windowHeight: 0,
        loadingBoxes: false,
        // 币种类型,用于做汇率切换的
        currency: 'CNY',
        // 当前可以切换的币种类型列表
        currencies: [],
        planWhitchChoose:'plan',


        isShipperOrConsignee:'Shipper',
        incoterms:'DAP'



        
    },

})