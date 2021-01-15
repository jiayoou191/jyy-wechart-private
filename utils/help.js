// ! 小程序获取localStorage封装
const getStorageAPI = (key) => {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: key,
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      }
    });
  });
}

// ! 小程序获取设备信息封装
const getSystemInfoAPI = () => {
  return new Promise((resolve, reject) => {
    wx.getSystemInfo({
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      }
    });
  });
}

// ! 小程序获取用户授权信息封装
const getSettingAPI = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      }
    });
  });
}

// ! 小程序打开用户授权封装
const openSettingAPI = () => {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      }
    });
  });
}

// ! rpx转px封装函数
const rpx2Px = (rpx, windowWidth) => {
  return rpx * (windowWidth / 750);
}

// ! px转rpx封装函数
const px2Rpx = (px, windowWidth) => {
  return px * (750 / windowWidth);
}

// ! 保留指定位小数封装函数
const toFixed = (number, fixed = 2) => {
  let result = (number.toString()).indexOf(".");
  if (result != -1) {
    return Number(number).toFixed(fixed);
  } else {
    return Number(number);
  }
}

//! 地图数据结构转化  
const bindChange = (resource) => {
  // console.log(123,'resource: ' , resource)
  let addressArr = []
  if (!resource || resource.length == 0) {
    return addressArr;
  }
  console.log('resource: '  , resource)
  resource.map(item=>{
    if(item.address){
      if(item.address.countryRegion == 'Congo (DRC)'||item.address.countryRegion == '刚果民主共和国'){
        item.address.countryRegionIso2 = 'CD';
      }else if(item.address.countryRegion == '斯瓦尔巴'){
        item.address.countryRegionIso2 = 'SJ';
      }
    }
  });
  resource = resource.filter(item=>{
    if(item.address&&item.address.countryRegionIso2){
      return item;
    }
  });
  resource.forEach(i => {
    //     public String addressLine;
    // public String locality;
    // public String neighborhood;
    // public String adminDistrict;
    // public String adminDistrict2;
    // public String formattedAddress;
    // public String postalCode;
    // public String countryRegion;
    // public String countryRegionIso2;
    // public String landmark;
    let obj = {};
    if (i.address 
      && i.point 
      && i.point.coordinates 
      && i.point.coordinates.length == 2 
      ) {
      obj = {
        addressLine: i.address.addressLine ? i.address.addressLine : null,
        locality: i.address.locality ? i.address.locality : null,
        neighborhood: i.address.neighborhood ? i.address.neighborhood : null,
        adminDistrict: i.address.adminDistrict ? i.address.adminDistrict : null,
        adminDistrict2: i.address.adminDistrict2 ? i.address.adminDistrict2 : null,
        formattedAddress: i.address.formattedAddress ? i.address.formattedAddress : null,
        postalCode: i.address.postalCode ? i.address.postalCode : null,
        countryRegion: i.address.countryRegion ? i.address.countryRegion : null,
        countryRegionIso2: i.address.countryRegionIso2 ? i.address.countryRegionIso2 : null,
        landmark: i.address.landmark ? i.address.landmark : null,
        latLng: {
          longitude: i.point.coordinates[1],
          latitude: i.point.coordinates[0]
        }
      }
      console.log('obj: ' , obj)
      addressArr.push(obj)
    } else {
      //! 查阅资料 forEach  continue  === return true  ;
      return true;
    }
  })
  console.log('addressArr: ' ,  addressArr)
  return addressArr;
}

// !时间戳转时间格式
const timeTransform = (time) => {
  let hour = Math.floor(time / (3600 * 1000));
  let minute = Math.floor((time - hour * 3600 * 1000) / (60 * 1000));
  let second = Math.ceil((time - hour * 3600 * 1000 - minute * 60 * 1000) / 1000);
  if (hour < 10) hour = `0${hour}`;
  if (minute < 10) minute = `0${minute}`;
  if (second < 10) second = `0${second}`;
  return `${hour}:${minute}:${second}`;
}

const allPlanSort = (arr) => {
  //价格比大小的函数
  var len = arr.length
  for (var i = 0; i < len - 1; i++) {
    for (var j = 0; j < len - 1 - i; j++) {
      // 相邻元素两两对比，元素交换，大的元素交换到后面
      if (
        Number(arr[j].priceValueDisplay) > Number(arr[j + 1].priceValueDisplay)
      ) {
        var temp = arr[j]
        arr[j] = arr[j + 1]
        arr[j + 1] = temp
      }
    }
  }
  arr[0]['cheaper'] = 'cheaper'
  return arr
}

const allPlanFast = (arr) => {
  //速度比较的函数
  // console.log('问题在这1')
  // console.log('arr: ' ,arr)
  arr.map(item => {
    if (item.transportType == "Express") {
      item['comareTransitTime'] = item.transitTime.split('-')[0];
    } else {
      item['comareTransitTime'] = item.stage3TransitTime.split('-')[0];
    }
  });
  var len = arr.length;
  for (var i = 0; i < len - 1; i++) {
    for (var j = 0; j < len - 1 - i; j++) {
      // 相邻元素两两对比，元素交换，大的元素交换到后面
      if (
        Number(arr[j].comareTransitTime) >
        Number(arr[j + 1].comareTransitTime)
      ) {
        var temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  // console.log('问题在这2')
  arr[0]['fastest'] = 'fastest'
  // console.log('问题在这3')

  return arr;
}





const displayPriceMapForFeeCategory = (processorResult, name) => {
  let priceMap = {};
  for (let i = 0; i < processorResult.length; i++) {
    let tmp = processorResult[i];
    if (tmp.name !== name) {
      continue;
    }
    let value = priceMap[tmp.currency];
    if (value == null) {
      value = 0;
    }

    // console.log('tmpvalue: ',tmp.value)
    value += Math.floor(tmp.value * 100) / 100;
    if (value != 0) {
      priceMap[tmp.currency] = value;
    }
  }
  return priceMap;
}

var priceMapToString = (priceMap) => {
  let keys = Object.keys(priceMap);
  let str = [];
  for (let i = 0; i < keys.length; i++) {
    // getSymbolFromCurrency(obj.priceSummary.currency)
    str.push(
      "" +
      keys[i] +
      Math.floor(priceMap[keys[i]] * 100) / 100 +
      ""
    );
  }

  return str.join(" + ");
}

const setState2and4Allfunc = (processorResult, planName) => {
  let obj = {
    name: planName,
    value: priceMapToString(
      displayPriceMapForFeeCategory(processorResult, planName)
    ),
    children: []
  };
  processorResult.map((item) => {
    let setChildren = {
      name: "",
      value: ""
    };
    if (item.name == planName) {
      setChildren.name = item.detailName;
      // console.log(item.detailName ,item.value)
      if (item.value != 0) {
        setChildren.value = item.currency + Math.floor(item.value * 100) / 100;
        obj.children.push(setChildren);
      }

    }
  });
  return obj;
}

const setState2and4AllfuncZh = (processorResult, planName) => {
  let obj = {
    name: planName,
    value: priceMapToString(
      displayPriceMapForFeeCategory(processorResult, planName)
    ),
    children: []
  };
  processorResult.map((item) => {
    let setChildren = {
      name: "",
      value: ""
    };
    if (item.name == planName) {
      setChildren.name = item.detailNameZh;
      if (!item.detailNameZh) {
        setChildren.name = item.detailName;
      }
      // console.log(item.detailName ,item.value)
      if (item.value != 0) {
        setChildren.value = item.currency + Math.floor(item.value * 100) / 100;
        obj.children.push(setChildren);
      }

    }
  });
  return obj;
}

const setState3func = (processorResult, planName) => {
  let obj = {
    name: planName,
    value: priceMapToString(
      displayPriceMapForFeeCategory(processorResult, planName)
    )
  };
  return obj;
}


//! 将所有方案 进行整理
const addAllPlan = (res) => {
  // console.log('addAllPlan 问题1')
  // console.log('res: ' , res)

  let allPlan = [];
  let bokenPlan = []
  let optionalPlans = {
    optionalAirPlans: null,
    optionalExpressPlans: null,
    optionalRailPlans: null,
    optionalShippingPlans: null
  }
  let {
    airPlan,
    railPlan,
    shippingPlan,
    expressPlan
  } = res
  if (airPlan != null && !airPlan.broken) {
    if (res.optionalAirPlans.length == 1) {
      airPlan['isOptionalPlans'] = false
      res.optionalAirPlans.map(i => {
        i['isOptionalPlans'] = false
      })
    } else {
      res.optionalAirPlans.map(i => {
        i['isOptionalPlans'] = true
      })
      airPlan['isOptionalPlans'] = true
    }
    // console.log(airPlan)
    let {
      ...a
    } = airPlan
    if (a.stage3TransitTime == '0') {
      a.stage3TransitTime = '4.0'
    }
    optionalPlans.optionalAirPlans = res.optionalAirPlans
    allPlan.push(airPlan)
  } else {
    if (airPlan) {

      let {
        ...a
      } = airPlan
      if (a.stage3TransitTime == '0') {
        a.stage3TransitTime = '4.0'
      }
      airPlan['isOptionalPlans'] = false
      res.optionalAirPlans.map(i => {
        i['isOptionalPlans'] = false
      })
      bokenPlan.push(airPlan)
    }

  }
  if (railPlan != null && !railPlan.broken) {
    if (res.optionalRailPlans.length == 1) {
      railPlan['isOptionalPlans'] = false
      res.optionalRailPlans.map(i => {
        i['isOptionalPlans'] = false
      })
    } else {

      railPlan['isOptionalPlans'] = true
      res.optionalRailPlans.map(i => {
        i['isOptionalPlans'] = true
      })

    }
    allPlan.push(railPlan)
    optionalPlans.optionalRailPlans = res.optionalRailPlans
  } else {
    if (railPlan) {

      railPlan['isOptionalPlans'] = false
      res.optionalRailPlans.map(i => {
        i['isOptionalPlans'] = false
      })
      bokenPlan.push(railPlan)
    }
  }
  if (shippingPlan != null && !shippingPlan.broken) {
    console.log('optionalShippingPlans!!!!:', res.optionalShippingPlans)
    if (res.optionalShippingPlans.length == 1) {
      shippingPlan['isOptionalPlans'] = false
      res.optionalShippingPlans.map(i => {
        i['isOptionalPlans'] = false
      })
    } else {

      shippingPlan['isOptionalPlans'] = true
      res.optionalShippingPlans.map(i => {
        i['isOptionalPlans'] = true
      })
    }

    allPlan.push(shippingPlan)
    optionalPlans.optionalShippingPlans = res.optionalShippingPlans
  } else {
    if (shippingPlan) {
      shippingPlan['isOptionalPlans'] = false
      res.optionalShippingPlans.map(i => {
        i['isOptionalPlans'] = false
      })
      bokenPlan.push(shippingPlan)
    }
  }
  if (expressPlan != null) {
    expressPlan['broken'] = false
    if (res.optionalExpressPlans.length == 1) {
      expressPlan['isOptionalPlans'] = false
      res.optionalExpressPlans.map(i => {
        i['isOptionalPlans'] = false
      })

    } else {
      expressPlan['isOptionalPlans'] = true
      res.optionalExpressPlans.map(i => {
        i['isOptionalPlans'] = true
      })
    }
    allPlan.push(expressPlan)
    optionalPlans.optionalExpressPlans = res.optionalExpressPlans
  }
  // console.log('bokenPlan: '  , bokenPlan)

  // 添加最快速
  if (allPlan.length > 0) {
    allPlan = allPlanFast(allPlan)
    // 添加最便宜
    allPlan = allPlanSort(allPlan)
  }
  if (bokenPlan.length > 0) {
    allPlan = [...allPlan, ...bokenPlan]
  }
  allPlan.map(i => {
    if (i.priceValueDisplay) {
      let isLogin = i.priceValueDisplay.substring(0, 2);
      // console.log('isLogin: '  , isLogin )
      if (isLogin == "**") {
        i['isLogin'] = false
        i['priceValueLoginFalse'] = i.priceValueDisplay.replace('**', '')
      } else {
        i['isLogin'] = true
      }
    } else {
      if (i.stage3Plan.priceSummary) {
        i['isLogin'] = true
      } else {
        i['isLogin'] = false
      }
    }
  });
  // optionalAirPlans: null,
  // optionalExpressPlans: null,
  // optionalRailPlans: null,
  // optionalShippingPlans: null
  //! 如果空运有更多方案 判断时候登陆
  if (optionalPlans.optionalAirPlans && optionalPlans.optionalAirPlans.length > 0) {
    optionalPlans.optionalAirPlans.map(i => {

      if (i.priceValueDisplay) {
        let isLogin = i.priceValueDisplay.substring(0, 2);
        if (isLogin == "**") {
          i['isLogin'] = false
          i['priceValueLoginFalse'] = i.priceValueDisplay.replace('**', '')
        } else {
          i['isLogin'] = true
        }
      } else {
        if (i.stage3Plan.priceSummary) {
          i['isLogin'] = true
        } else {
          i['isLogin'] = false
        }
      }
    })
  }
  //! 如果快递有更多方案 判断时候登陆
  if (optionalPlans.optionalExpressPlans && optionalPlans.optionalExpressPlans.length > 0) {
    optionalPlans.optionalExpressPlans.map(i => {
      if (i.priceValueDisplay) {
        let isLogin = i.priceValueDisplay.substring(0, 2);
        console.log('isLogin: ', isLogin)
        if (isLogin == "**") {
          i['isLogin'] = false
          i['priceValueLoginFalse'] = i.priceValueDisplay.replace('**', '')
        } else {
          i['isLogin'] = true
        }
      } else {
        if (i.stage3Plan.priceSummary) {
          i['isLogin'] = true
        } else {
          i['isLogin'] = false
        }
      }
    })
  }
  //! 如果铁运有更多方案 判断时候登陆
  if (optionalPlans.optionalRailPlans && optionalPlans.optionalRailPlans.length > 0) {
    optionalPlans.optionalRailPlans.map(i => {
      if (i.priceValueDisplay) {
        let isLogin = i.priceValueDisplay.substring(0, 2);
        console.log('isLogin: ', isLogin)
        if (isLogin == "**") {
          i['isLogin'] = false
          i['priceValueLoginFalse'] = i.priceValueDisplay.replace('**', '')
        } else {
          i['isLogin'] = true
        }
      } else {
        if (i.stage3Plan.priceSummary) {
          i['isLogin'] = true
        } else {
          i['isLogin'] = false
        }
      }
    })
  }
  //! 如果海运有更多方案 判断时候登陆
  if (optionalPlans.optionalShippingPlans && optionalPlans.optionalShippingPlans.length > 0) {
    optionalPlans.optionalShippingPlans.map(i => {
      if (i.priceValueDisplay) {
        let isLogin = i.priceValueDisplay.substring(0, 2);
        console.log('isLogin: ', isLogin)
        if (isLogin == "**") {
          i['isLogin'] = false
          i['priceValueLoginFalse'] = i.priceValueDisplay.replace('**', '')
        } else {
          i['isLogin'] = true
        }
      } else {
        if (i.stage3Plan.priceSummary) {
          i['isLogin'] = true
        } else {
          i['isLogin'] = false
        }
      }
    })
  }

  // wx.setStorageSync('allPlan', allPlan)
  // wx.setStorageSync('searchInfo', res)
  // console.log('optionalPlans: '   ,  optionalPlans)
  return {
    allPlan,
    query: res.originalQuery,
    optionalPlans
  }

}




module.exports = {
  allPlanSort,
  setState2and4Allfunc,
  setState2and4AllfuncZh,
  addAllPlan,
  allPlanFast,
  timeTransform,
  toFixed,
  rpx2Px,
  px2Rpx,
  getStorageAPI,
  getSystemInfoAPI,
  getSettingAPI,
  openSettingAPI,
  bindChange
}

// module.exports = allPlanSort