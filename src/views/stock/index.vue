<template>
    <div class="main">
        <el-row class="head">
            <el-button type="primary" @click="add()">新 增</el-button>
        </el-row>
        <el-row class="table">
            <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column
                    prop="id"
                    label="ID"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="code"
                    label="代码"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="昵称">
                </el-table-column>
                <el-table-column
                    label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleClick(scope.row)" type="text" >初始化</el-button>
                        <el-button type="text" >编辑</el-button>
                        <el-button type="text" >增量同步</el-button>
                        <el-button type="text" >同步日志</el-button>
                        <el-button type="text" >停止跟踪</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row>
            <v-add :showAdd="showAdd" @closeAdd="closeAdd()"/>
        </el-row>
    </div>
</template>
<script>
import Add from './add'

export default {
    name: "data-sync",
    components: {
        "v-add": Add
    },
    data: function() {
        return {
            tableData: [
                {
                    id: 1,
                    code: "sh.000016",
                    name: "上证50",
                },
                {
                    id: 1,
                    code: "sh.000016",
                    name: "上证50",
                },
                {
                    id: 1,
                    code: "sh.000016",
                    name: "上证50",
                },
                {
                    id: 1,
                    code: "sh.000016",
                    name: "上证50",
                },
                {
                    id: 1,
                    code: "sh.000016",
                    name: "上证50",
                }
            ],

            // 显示新增页面
            showAdd: false
        }
    },
    methods: {
        // 新增
        add: function() {
            this.showAdd = true
        },
        closeAdd: function() {
            this.showAdd = false
        },
    },
}
</script>
<style lang="scss" scoped>
.head {
    margin: 30px 0 10px 30px;
}
.table {
    margin: 0 30px;
}
</style>
