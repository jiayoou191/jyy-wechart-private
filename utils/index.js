class Request {
  constructor (params) {
    this.withBaseURL = params.withBaseURL
    this.baseURL = params.baseURL
  }
  
  request (method, url, data, registrationResult ,baseUse=true)  {
    const vm = this;

    let requestHeader = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*'
    }

    console.log('lib.request, registionResult: ', registrationResult)
    if (registrationResult != null && registrationResult.user != null && registrationResult.user.id != null && registrationResult.securityHash != null) {
      requestHeader['X-JYY-UserId'] = registrationResult.user.id
      requestHeader['X-JYY-SecurityHash'] = registrationResult.securityHash
    }
    if(baseUse){
      return new Promise((resolve, reject) => {
        wx.request({
          url: vm.withBaseURL ? vm.baseURL + url : url,
          data,
          header: requestHeader,
          method,
          success (res) {
            console.log('res: '   ,res)
            resolve(res)
          },
          fail () {
            reject({
              msg: '请求失败',
              url: vm.withBaseURL ? vm.baseURL + url : url,
              method,
              data
            })
          }
        })
      })
    }else{
      console.log(11)
      return new Promise((resolve, reject) => {
        wx.request({
          url: url,
          data,
          header: requestHeader,
          method,
          success (res) {
            console.log('res: '   ,res)
            resolve(res)
          },
          fail () {
            reject({
              msg: '请求失败',
              url: url,
              method,
              data
            })
          }
        })
      })
    }
    
  }
  login () {
    return new Promise((resolve, reject) => {
      wx.login({
        success (res) {
          resolve(res)
        },
        fail () {
          reject({
            msg: '请求失败',
          })
        }
      })
    })
  }
  
  
}

const request = new Request({
  baseURL: __wxConfig.envVersion == 'release' ? 'https://jianyiyun.com/react_v1' : 'https://test.jianyiyun.com/react_v1',
  withBaseURL: true
})

module.exports = request



//! 写死的方便调试
// class Request {
//   constructor (params) {
//     this.withBaseURL = params.withBaseURL
//     this.baseURL = params.baseURL
//     this.registrationResult = params.registrationResult
//   }
//   get (url, data, header) {
//     return this.request('GET', url, data,header)
//   }
//   post (url, data,header) {
//     return this.request('POST', url, data,header)
//   }
//   put (url, data,header) {
//     return this.request('PUT', url, data,header)
//   }
//   request (method, url, data ,)  {
//     const vm = this;

//     let requestHeader = {
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'Access-Control-Allow-Origin': '*',
//       'X-JYY-UserId':'2004260343126wxkc8Pm',
//       'X-JYY-SecurityHash':'0b6016848HxourQ6'

      
//     }
//     if (this.registrationResult != null && this.registrationResult.user != null && this.registrationResult.securityHash != null) {
//       requestHeader['X-JYY-UserId'] = this.registrationResult.user.id
//       requestHeader['X-JYY-SecurityHash'] = this.registrationResult.securityHash
//       // requestHeader['X-JYY-UserId'] = '2004260343126wxkc8Pm',
//       // requestHeader['X-JYY-SecurityHash'] = '0b6016848HxourQ6'
//     }

//     return new Promise((resolve, reject) => {
//       wx.request({
//         url: vm.withBaseURL ? vm.baseURL + url : url,
//         data,
//         header: requestHeader,
//         method,
//         success (res) {
//           resolve(res)
//         },
//         fail () {
//           reject({
//             msg: '请求失败',
//             url: vm.withBaseURL ? vm.baseURL + url : url,
//             method,
//             data
//           })
//         }
//       })
//     })
//   }
//   login () {
//     return new Promise((resolve, reject) => {
//       wx.login({
//         success (res) {
//           resolve(res)
//         },
//         fail () {
//           reject({
//             msg: '请求失败',
//           })
//         }
//       })
//     })
//   }
  
  
// }

// const request = new Request({
//   baseURL: 'https://test.jianyiyun.com/react_v1',
//   withBaseURL: true,
//   registrationResult: wx.getStorageSync('registrationResult')
// })

// module.exports = request