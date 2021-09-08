// module.exports = {
//     // 已省略其他配置项
//     devServer: {
//         proxy: {
//             '/apit': {//业务类的接口请求地址，这里的api可以是后端的工程名
//                 changeOrigin: true,
//                 target: 'https://api.seniverse.com/v3/weather/now.json',
//                 pathRewrite: { '^/apit': '' }
//             },
//             '/': { //websoket请求接口地址
//                 ws: true,
//                 target: 'ws://192.168.1.1:8080/'
//             }
//         }
//     }

// }