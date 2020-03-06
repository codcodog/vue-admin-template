<template>
    <div class="main">
        <el-row>
            <div class="head">
                <div class="item">
                    <el-date-picker
                        v-model="start"
                        type="date"
                        placeholder="选择日期时间">
                    </el-date-picker> - 
                    <el-date-picker
                        v-model="end"
                        type="date"
                        placeholder="选择日期时间">
                    </el-date-picker>
                    <el-select v-model="type" placeholder="请选择">
                        <el-option
                            v-for="item in types"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <el-select v-model="code" placeholder="请选择">
                        <el-option
                            v-for="item in codes"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
        </el-row>
        <el-row>
            <div class="charts">
                <v-chart :options="line"/>
            </div>
        </el-row>
    </div>
</template>

<script>
import ECharts from "vue-echarts/components/ECharts";
import "echarts/lib/chart/line";
import "echarts/lib/component/legend";
import "echarts/lib/component/tooltip";

import {getStockData} from '@/api/stock'


export default {
    name: 'Dashboard',
    components: {
        "v-chart": ECharts
    },
    data: function() {
        return {
            start: '2020-03-02',
            end: '2020-03-05',

            code: 'sh.000016',
            codes: [
                {
                    value: "sh.000016",
                    label: "上证50",
                }
            ],

            type: 0,
            types: [
                {
                    value: 0,
                    label: 'CLOSE',
                },
                {
                    value: 1,
                    label: 'LOW',
                },
                {
                    value: 2,
                    label: 'HIGH',
                }
            ],

            line: {
                tooltip: {
                    trigger: 'axis',
                },
                legend: {
                    selected: {
                        "中位数": false
                    },
                    data: ["价格", "平均数", "中位数"]
                },
                grid: {
                    left: "left",
                    containLabel: true
                },
                xAxis: {
                    boundaryGap : false,
                    type: "category",
                    data: []
                },
                yAxis: {
                },
                series: [
                    {
                        name: "价格",
                        type: "line",
                        smooth: true,
                        areaStyle: {},
                        data: []
                    },
                    {
                        name: "平均数",
                        type: "line",
                        data: []
                    },
                    {
                        name: "中位数",
                        type: "line",
                        data: []
                    }
                ]
            }
        };
    },
    methods: {
        // 获取当前日期
        getNowDate: function() {
            var today = new Date()
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();

            return yyyy+'-'+mm+'-'+dd;
        },
        // 获取前一个月日期
        getLastMonthDate: function() {
            var today = new Date();
            today.setMonth(today.getMonth()-1);

            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();

            return yyyy+'-'+mm+'-'+dd;
        },
        // 获取股票数据
        getStockData: function() {
            var data = {
                type: this.type,
                params: {
                    code: this.code,
                    start_date: this.start,
                    end_date: this.end
                }
            };
            getStockData(data).then(response => {
                if (response.code != 20000) {
                    this.$message.error(response.message);
                    return
                }
                if (response.data.prices.length == 0) {
                    this.$message.info('Empty stock data.');
                    return
                }
                this.dealStockData(response.data)
            })
        },
        // 整理数据
        dealStockData: function(data) {
            this.initData()
            for (var index in data.prices) {
                this.line.xAxis.data.push(data.prices[index].date)
                this.line.series[0].data.push(data.prices[index].price)
                this.line.series[1].data.push(data.ave)
                this.line.series[2].data.push(data.mid)
            }
        },
        // 初始化值
        initData: function() {
            this.line.xAxis.data = []
            this.line.series[0].data = []
            this.line.series[1].data = []
            this.line.series[2].data = []
        },
    },
    watch: {
        code: function(newValue, oldValue) {
            this.getStockData()
        },
        start: function(newValue, oldValue) {
            this.getStockData()
        },
        end: function(newValue, oldValue) {
            this.getStockData()
        },
        type: function(newValue, oldValue) {
            this.getStockData()
        },
    },
    mounted: function() {
        this.start = this.getLastMonthDate();
        this.end = this.getNowDate();
        this.getStockData()
    },
}
</script>

<style lang="scss" scoped>
.main {
    margin: 30px;
}
.item {
    padding-left: 37px;
}
.charts {
    margin-top: 37px;
}
.echarts {
    width: 100%;
    height: 800px;
}
</style>
