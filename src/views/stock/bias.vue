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
            <div class="charts-pie">
                <v-chart :options="pie"/>
            </div>
        </el-row>
        <el-row>
            <div class="charts">
                <v-chart :options="line"/>
            </div>
        </el-row>
        <el-row>
            <div class="charts">
                <v-chart :options="ttm_line"/>
            </div>
        </el-row>
    </div>
</template>
<script>
import ECharts from "vue-echarts/components/ECharts";
import "echarts/lib/chart/line";
import "echarts/lib/chart/pie";
import "echarts/lib/component/legend";
import "echarts/lib/component/tooltip";

import {getBias, getTtm, getCodes} from '@/api/stock'

export default {
    name: 'Bias',
    components: {
        "v-chart": ECharts
    },
    data: function() {
        return {
            start: '',
            end: '',

            code: '',
            codes: [],

            line: {
                tooltip: {
                    trigger: 'axis',
                },
                legend: {
                    data: ["bias", "buy", "sell", "mid"]
                },
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {
                },
                series: [
                    {
                        name: "bias",
                        data: [],
                        type: 'line'
                    },
                    {
                        name: "buy",
                        data: [],
                        type: 'line'
                    },
                    {
                        name: "sell",
                        data: [],
                        type: 'line'
                    },
                    {
                        name: "mid",
                        data: [],
                        type: 'line'
                    }
                ]
            },
            ttm_line: {
                tooltip: {
                    trigger: 'axis',
                },
                legend: {
                    data: ["ttm", "buy", "sell", "mid"]
                },
                xAxis: {
                    type: 'category',
                    data: []
                },
                yAxis: {
                    scale: true
                },
                series: [
                    {
                        name: "ttm",
                        data: [],
                        type: 'line'
                    },
                    {
                        name: "buy",
                        data: [],
                        type: 'line'
                    },
                    {
                        name: "sell",
                        data: [],
                        type: 'line'
                    },
                    {
                        name: "mid",
                        data: [],
                        type: 'line'
                    }
                ]
            },
            pie: {
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b}: {c} ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 10,
                    data: []
                },
                series: [
                    {
                        name: 'BIAS',
                        type: 'pie',
                        radius: ['50%', '80%'],
                        avoidLabelOverlap: false,
                        label: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            label: {
                                show: true,
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        },
                        labelLine: {
                            show: false
                        },
                        data: [
                        ]
                    }
                ]
            },
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
            today.setMonth(today.getMonth()-3);

            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();

            return yyyy+'-'+mm+'-'+dd;
        },
        // 获取 bias
        getBias: function() {
            var data = {
                code: this.code,
                start_date: this.start,
                end_date: this.end
            }
            getBias(data).then(response => {
                if (response.code != 20000) {
                    this.$message.error(response.message);
                    return
                }
                if (response.data.biases.length == 0) {
                    this.$message.info('Empty bias data.');
                    return
                }
                this.dealBiasData(response.data)
            })
        },
        dealBiasData: function(data) {
            this.initBias()
            for (var index in data.biases) {
                this.line.xAxis.data.push(data.biases[index].date)
                this.line.series[0].data.push(data.biases[index].bias)
                this.line.series[1].data.push(data.buy_bias)
                this.line.series[2].data.push(data.sell_bias)
                this.line.series[3].data.push(data.mid_bias)
            }

            var levels = data.levels
            for (var key in levels) {
                this.pie.series[0].data.push({value: levels[key], name: key})
                this.pie.legend.data.push(key)
            }

            this.pie.series[0].name = 'WIN: '+data.win
        },
        // 获取 ttm
        getTtm: function() {
            var data = {
                'code': this.code,
                'start_date': this.start,
                'end_date': this.end,
            }
            getTtm(data).then(response => {
                if (response.code != 20000) {
                    this.$message.error(response.message);
                    return
                }
                if (response.data.ttms.length == 0) {
                    this.$message.info('Empty ttm data.');
                    return
                }
                this.dealTtmData(response.data)
            })
        },
        dealTtmData: function(data) {
            this.initTtm()
            for (var index in data.ttms) {
                this.ttm_line.xAxis.data.push(data.ttms[index].date)
                this.ttm_line.series[0].data.push(data.ttms[index].ttm)
                this.ttm_line.series[1].data.push(data.buy_ttm)
                this.ttm_line.series[2].data.push(data.sell_ttm)
                this.ttm_line.series[3].data.push(data.mid_ttm)
            }
        },
        initBias: function() {
            this.line.xAxis.data = []
            this.line.series[0].data = []
            this.line.series[1].data = []
            this.line.series[2].data = []
            this.line.series[3].data = []
            this.pie.series[0].data = []
            this.pie.series[0].name = 'BIAS'
            this.pie.legend.data = []
        },
        initTtm: function() {
            this.ttm_line.xAxis.data = []
            this.ttm_line.series[0].data = []
            this.ttm_line.series[1].data = []
            this.ttm_line.series[2].data = []
            this.ttm_line.series[3].data = []
        },

        // 日期改变，重新加载数据
        changeStart: function() {
            this.getBias()
            this.getTtm()
        },
        changeEnd: function() {
            this.getBias()
            this.getTtm()
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
                this.getBias()
                this.getTtm()
            }
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
.charts-pie {
    margin-top: 37px;
}
.echarts {
    width: 100%;
    height: 370px;
}
</style>
