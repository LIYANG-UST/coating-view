import service from './request.js';

const clientId = '09532fd2fed5489696eca79b64e2caca';
const baseURL = 'http://www.1weilian.com:8750/mtInterface';
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
            .post(baseURL + '/device/getDevices', {
                "clientId": clientId,
                "page": 0,
                "rows": 10
            })
            .then(res => res)
            .catch(err => console.log(err))
    },

    getTenDaysData: async () => {
        return await service
            .post(baseURL + '/realTime/getRealTimeCurve', {
                // "snList": [  "XXXXXX", "XXXXXX"],
                "clientId": clientId,
                "page": 0,
                "rows": 10
            }).then(res => res)
            .catch(err => console.log(err))
    },

    getHistoryData: async (startTime, endTime, sn) => {
        return await service
            .post(baseURL + '/history/historyCurveData', {
                "sn": sn,
                "clientId": clientId,
                "startTime": startTime,
                "endTime": endTime
            }).then(res => res)
            .catch(err => console.log(err))
    },

    getWeatherData: async () => {
        return await service
            .get('https://api.seniverse.com/v3/weather/now.json', {
                params: {
                    key: "S7Q1HfGchFIi1O2WX",
                    location: "xianggang",
                    language: "en"
                },
                crossDomain: true,
                // withCredentials: false,


            }).then(res => res)
            .catch(err => console.log(err))
    }
}