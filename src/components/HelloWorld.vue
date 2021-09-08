<template>
  <h1>Coating Temperature Data</h1>
  <!-- <el-row>
    <el-col :span="4"> </el-col>
    <el-col :span="16"> -->
  <!-- <el-button type="primary" @click="getDevice">Get Device Info</el-button> -->
  <!-- <el-button type="primary" @click="getRecentData"
        >Get Recent Data</el-button
      > -->
  <!-- <el-button type="primary" @click="getHistoryData"
        >Get History Data</el-button
      > -->
  <!-- <el-button type="primary" @click="updateChart">Update Chart</el-button> -->
  <!-- </el-col>
    <el-col :span="4"></el-col>
  </el-row> -->
  <div class="block">
    <div class="demonstration" style="margin-bottom: 6px">
      Select Time Range
    </div>

    <el-date-picker
      v-model="value2"
      type="datetimerange"
      :shortcuts="shortcuts"
      range-separator="To"
      start-placeholder="Start Time"
      end-placeholder="End Time"
    >
    </el-date-picker>

    <!-- <div style="margin-top: 6px"> -->
    <el-button type="primary" @click="getHistoryData" style="margin-left: 5px">
      Get History Data</el-button
    >
    <!-- </div> -->
  </div>
  <div style="font-weight: bold; font-size: large; margin-top: 20px">
    Current Weather: {{ weather }}
  </div>
  <div style="font-weight: bold; font-size: large">
    Current Temperature: {{ cTemp }}°C
  </div>
  <el-container
    style="height: 550px; width: 1400px; margin-top: 15px; margin-bottom: 25px"
  >
    <div
      id="mycharts"
      ref="myRef"
      class="chart-box"
      style="height: 100%; width: 100%"
    ></div>
  </el-container>

  <!-- <div>deviceSN1:{{ deviceSN1 }}</div>
  <div>deviceSN2:{{ deviceSN2 }}</div>
  <div>tempList1:{{ tempList1 }}</div>
  <div>tempList2:{{ tempList2 }}</div> -->
  <a href="https://mucslab-dev.hkust.edu.hk/"
    >@Powered by HKUST MuCSL Lab, 2021</a
  >
</template>
<script lang="js">
import { defineComponent, getCurrentInstance, ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import service from '../utils/index.js'

export default defineComponent({
  name: 'echarts',
  data () { 
    return {
      charInstance: null,
      deviceSN1: "", // coated window
      deviceSN2: "", //pure window
      tempList1: [] ,
      dateList: [],
      tempList2: [],
      start_time:"",
      value2:[],
      timer: null,
      weather:'',
      cTemp: '',
      shortcuts: [
        {
            text: 'One Week',
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              return [start, end]
            },
          },
          {
            text: 'One Month',
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              return [start, end]
            },
          },
          {
            text: 'Three Months',
            value: () => {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              return [start, end]
            },
          },
      ]
    }
  },
    mounted() {
      
      this.initChart();
      this.timer = setInterval(() => {
        setTimeout(this.getRecentData,0)}, 1000 * 30
      )
    },

  methods: {
    async initChart() {
      this.ChartInstance = echarts.init(document.getElementById('mycharts'));
      console.log(this.ChartInstance);
      await this.getDevice();
      await this.getRecentData();
    },

    async getDevice() {
      const res = await service.getDevice();
      console.log(res);
      this.deviceSN1 = res.data.data.dataList[0].sn
      this.deviceSN2 = res.data.data.dataList[1].sn

      console.log(this.start_time)
    },

    async getRecentData() {
      const TenDaysData = await service.getTenDaysData();
      console.log(TenDaysData);
      this.dateList = TenDaysData.data.data.dataList[0].dateList
      this.tempList1 = TenDaysData.data.data.dataList[1].temperatureList
      this.tempList2 = TenDaysData.data.data.dataList[0].temperatureList

      this.updateChart()

      let weather = await service.getWeatherData();
      this.weather = weather.data.results[0].now.text
      this.cTemp = weather.data.results[0].now.temperature
      console.log(weather, this.cTemp)
    },

    async getHistoryData() {
      let start_date = await service.formatDate(this.value2[0]);
      let end_date = await service.formatDate(this.value2[1]);
      const HistoryData1 = await service.getHistoryData(start_date, end_date, this.deviceSN1);
      const HistoryData2 = await service.getHistoryData(start_date, end_date, this.deviceSN2);
      console.log("device1:", HistoryData1);
      console.log("device2:", HistoryData2);
      this.dateList = HistoryData1.data.data.dateList
      this.tempList1 = HistoryData1.data.data.temperatureList
      this.tempList2 = HistoryData2.data.data.temperatureList

      this.updateChart()
    },


    updateChart() {
      const dataOption = {
        title: {
          text: 'Coating Temperature Data View',
          left: 100
        },
        dataZoom: [
        {
            id: 'dataZoomX',
            type: 'slider',
            xAxisIndex: [0],
            filterMode: 'filter'
        },
        {
            id: 'dataZoomY',
            type: 'slider',
            yAxisIndex: [0],
            filterMode: 'empty'
        }
        ],
        tooltip: {},
        toolbox: {
          feature: {
            saveAsImage: {}
        }
        },
        legend: {
          data: ['PureWindow', 'CoatedWindow']
        },
        xAxis: {
          name: 'time',
          data: this.dateList,
          axisLabel:{
            showMaxLabel: true
          }
        },
        yAxis: {
          name: 'temperature',
          type: 'value',
          min: function (value) {
            return parseInt(value.min - 3);
          },
          max: function (value) {
            return parseInt(value.max + 3);
          }
          // scale: true
          // max: '50'
        },
        series: [
          {
            name: 'CoatedWindow',
            type: 'line',
            data: this.tempList1,
            smooth: true
          },
          {
            name: 'PureWindow',
            type: 'line',
            data: this.tempList2,
            smooth: true
          }
        ]
      }
      this.ChartInstance.setOption(dataOption)
      
    }
  },
});
</script>

<style lang="css" scoped>
.chart-box {
  /* width: 100%;
  height: 80%; */
  margin: 0 auto;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>