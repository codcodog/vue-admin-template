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

export default {
    name: 'Dashboard',
    components: {
        "v-chart": ECharts
    },
    data: function() {
        return {
            start: '2020-03-02',
            end: '2020-03-05',
            code: 'sz.000016',
            codes: [
                {
                    value: "sz.000016",
                    label: "上证50",
                }
            ],
            line: {
                title: {
                    text: "折线图"
                },
                tooltip: {
                    show: true,
                    trigger: 'ayis',
                    boundaryGap: false
                },
                legend: {
                    data: ["price", "ave", "mid"]
                },
                grid: {
                    left: "left",
                    containLabel: true
                },
                xAxis: {
                    boundaryGap : false,
                    type: "category",
                    data: ["2020-01-01", "2020-01-02", "2020-01-03", "2020-01-04", "2020-01-05", "2020-01-06", "2020-01-01", "2020-01-01", "2020-01-01", "2020-01-01", "2020-01-01", "2020-01-01", "2020-01-01", "2020-01-01", "2020-01-01", "2020-01-01", "2020-01-01", "2020-01-01", "2020-01-01", "2020-01-01", "2020-01-01", "2020-01-01"]
                },
                yAxis: {
                },
                series: [
                    {
                        name: "price",
                        type: "line",
                        smooth: true,
                        data: [5, 20, 36, 10, 10, 20, 23, 233, 883, 23, 299, 3883, 33, 12, 33, 31, 89, 34, 83, 23, 22]
                    },
                    {
                        name: "ave",
                        type: "line",
                        data: [150, 150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150,150]
                    }
                ]
            }
        };
    }
}
</script>

<style lang="scss" scoped>
.main {
    margin: 30px;
}
.item {
    padding-left: 37px;
}
.echarts {
    width: 100%;
    height: 800px;
}
</style>
