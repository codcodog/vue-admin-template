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

import {getBias, getCodes} from '@/api/stock'

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
                    data: ["bias", "buy", "sell"]
                },
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
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
            today.setMonth(today.getMonth()-1);

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
            this.initData()
            for (var index in data.biases) {
                this.line.xAxis.data.push(data.biases[index].date)
                this.line.series[0].data.push(data.biases[index].bias)
                this.line.series[1].data.push(data.buy_bias)
                this.line.series[2].data.push(data.sell_bias)
            }
        },
        initData: function() {
            this.line.xAxis.data = []
            this.line.series[0].data = []
            this.line.series[1].data = []
            this.line.series[2].data = []
        },

        // 日期改变，重新加载数据
        changeStart: function() {
            this.getBias()
        },
        changeEnd: function() {
            this.getBias()
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
.charts {
    margin-top: 37px;
}
.echarts {
    width: 100%;
    height: 800px;
}
</style>
