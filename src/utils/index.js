import service from './request.js';

const clientId = '09532fd2fed5489696eca79b64e2caca';
const baseURL = 'http://www.1weilian.com:8750/mtInterface';

const localURL = 'https://18.162.199.13:5000';
const localURL2 = 'https://coating-view.vercel.app';
// const baseURL = '/backend';

export default {
    formatDate: (date) => {
        let y = date.getFullYear();
        let m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        let d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        let h = date.getHours();
        let minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        let second = date.getSeconds();
        second = minute < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    },

    getDevice: async () => {
        return await service
            .get(localURL2 + '/api/device/getDevices', {
                "clientId": clientId,
                "page": 0,
                "rows": 10
            })
            .then(res => res)
            .catch(err => console.log(err))
    },

    getTenDaysData: async () => {
        return await service
            .get(localURL2 + '/api/recentdata', {
                params:{
                "clientId": clientId,
                "page": 0,
                "rows": 10
                }
            }).then(res => res)
            .catch(err => console.log(err))
    },

    getHistoryData: async (startTime, endTime, sn) => {
        return await service
            .get(localURL2 + '/api/historydata',{
                params:{
                    "sn": sn,
                    "clientId": clientId,
                    "startTime": startTime,
                    "endTime": endTime
                    }
            }).then(res => res)
            .catch(err => console.log(err))
    },

    getWeatherData: async () => {
        return await service
            .get(localURL2 + '/api/weather', {
                // .get('/weatherapi', {
                // params: {
                //     key: "S7Q1HfGchFIi1O2WX",
                //     location: "xianggang",
                //     language: "en"
                // },
                crossDomain: true,
            }).then(res => res)
            .catch(err => console.log(err))
    }
}