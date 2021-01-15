/** 模拟vue实现watch方法 */
const defineReactive = (data, key, val, fn) => {
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: true,
      get: function () {
        return val
      },
      set: function (newVal) {
        // if (newVal === val) return
        if (isObjectValueEqual(newVal, val)) return
        fn && fn(newVal)
        val = newVal
      },
    })
  }
  
  const watch = (ctx, obj) => {
    Object.keys(obj).forEach(key => {
      defineReactive(ctx.data, key, ctx.data[key], function (value) {
        obj[key].call(ctx, value)
      })
    })
  }
  
  const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()
  
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
  }
  
  const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
  }
  
  /**判断两个对象[一层]的值是否相等,
   * 当set部分修改值和初始值相等时，不继续往下走
   */
  const isObjectValueEqual = (a, b) => {
    if (a === null || b === null) {
      return false;
    }
    if (a instanceof Object && a instanceof Object) {
      var aProps = Object.getOwnPropertyNames(a);
      var bProps = Object.getOwnPropertyNames(b);
  
      if (aProps.length != bProps.length) {
        return false;
      }
  
      for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];
        var propA = a[propName];
        var propB = b[propName];
        if (propA instanceof Object && propB instanceof Object) {
          isObjectValueEqual(propA, propB)
        } else {
          return false
        }
        if (propA !== propB) {
          return false;
        }
      }
      return true;
    }
    return a === b;
  }
  
  /**
   * 节流函数，处理事件频繁触发的场景，在一定时间内函数只执行一次
   */
  const throttle = (fn, delay=500) => {
    let preview = 0;
    return function(args){
        const now = Date.now(); //获取此时时间
        if(now - preview > delay){
            fn.call(this, args);
            preview = now;
        }
    }
  }
  
  module.exports = {
    watch,
    throttle,
    formatTime
  }