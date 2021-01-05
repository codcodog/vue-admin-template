<template>
    <div class="main">
        <el-row>
            <div class="head">
                <div class="item">
                    <el-date-picker
                        v-model="start"
                        @change="changeStart()"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期时间">
                    </el-date-picker> - 
                    <el-date-picker
                        v-model="end"
                        @change="changeEnd()"
                        type="date"
                        value-format="yyyy-MM-dd"
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
                    <el-select v-model="code" filterable placeholder="请选择">
                        <el-option
                            v-for="item in codes"
                            :key="item.code"
                            :label="item.name"
                            :value="item.code">
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

import {getStockData, getCodes} from '@/api/stock'


export default {
    name: 'Dashboard',
    components: {
        "v-chart": ECharts
    },
    data: function() {
        return {
            start: '',
            end: '',

            code: '',
            codes: [],

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
                    data: ["价格", "平均数", "中位数", "28线"]
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
                    },
                    {
                        name: "28线",
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
                    this.initData()
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
                this.line.series[3].data.push(data.price28)
            }
        },
        // 初始化值
        initData: function() {
            this.line.xAxis.data = []
            this.line.series[0].data = []
            this.line.series[1].data = []
            this.line.series[2].data = []
            this.line.series[3].data = []
        },

        // 日期改变，重新加载数据
        changeStart: function() {
            this.getStockData()
        },
        changeEnd: function() {
            this.getStockData()
        },

        // 获取 codes 列表
        getCodes: function() {
            getCodes().then(response => {
                if (response.code != 20000) {
                    this.$message.error(response.message);
                    return
                }
                this.codes = response.data
                if (response.data.length > 0) {
                    this.code = response.data[0].code // 取第一个 code
                }
            })
        }
    },
    watch: {
        code: function(newValue, oldValue) {
            if (newValue != '') {
                this.getStockData()
            }
        },
        type: function(newValue, oldValue) {
            this.getStockData()
        },
    },
    mounted: function() {
        this.start = this.getLastMonthDate();
        this.end = this.getNowDate();
        this.getCodes()
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
