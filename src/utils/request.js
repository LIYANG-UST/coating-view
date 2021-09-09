import axios from 'axios';

const baseURL = 'http://www.1weilian.com:8750/mtInterface/';

const service = axios.default.create({
    timeout: 60000, // 请求超时时间
    maxContentLength: 4000,

})

export default service

// axios.post('http://www.1weilian.com:8750/mtInterface/device/getDevices', {
//     "clientId": "09532fd2fed5489696eca79b64e2caca",
//     "page": 0,
//     "rows": 10
// })
//     .then(function (response) {
//         console.log(response);
//     })
//     .catch(function (error) {
//         console.log(error);
//     });