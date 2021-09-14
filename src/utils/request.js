import axios from 'axios';

const baseURL = 'http://www.1weilian.com:8750/mtInterface/';

const service = axios.default.create({
    timeout: 60000, // 请求超时时间
    maxContentLength: 4000,

})

export default service
