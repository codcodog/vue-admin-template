<template>
    <div class="main">
        <el-row class="head">
            <el-button type="primary" @click="add()">新 增</el-button>
        </el-row>
        <el-row class="table">
            <el-table
                v-loading="loading"
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
                        <el-button @click="handleInit(scope.row.code)" type="text" v-if="scope.row.isInit == 0">初始化</el-button>
                        <el-button type="text" disabled v-else>初始化</el-button>

                        <el-button type="text" @click="edit(scope.row.code)">编辑</el-button>
                        <el-button type="text" @click="incrSync(scope.row.code)">增量同步</el-button>
                        <el-button type="text">同步日志</el-button>

                        <el-button type="text" @click="untrack(scope.row.code)" v-if="scope.row.status == 1">停止跟踪</el-button>
                        <el-button type="text" @click="track(scope.row.code)" v-else>开始跟踪</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row>
            <v-add :showAdd="showAdd" :isEdit="isEdit" :code="editCode" @closeAdd="closeAdd()"/>
        </el-row>
    </div>
</template>
<script>
import Add from './add'
import {getStock, initStock, track, untrack} from '@/api/stock'

export default {
    name: "data-sync",
    components: {
        "v-add": Add
    },
    data: function() {
        return {
            loading: false, // table 加载
            tableData: [],

            // 显示新增页面
            showAdd: false,

            // 是否编辑
            isEdit: false,
            editCode: ''  // 编辑的 code
        }
    },
    methods: {
        // 新增
        add: function() {
            this.showAdd = true
        },
        closeAdd: function() {
            this.showAdd = false
            this.isEdit = false
            this.getStockList()
        },
        // 获取股票列表
        getStockList: function() {
            getStock().then(response => {
                if (response.code != 20000) {
                    this.$message.error(response.message);
                    return
                }
                this.tableData = response.data
            })
        },
        // 初始化股票数据
        handleInit: function(code) {
            var params = {
                code: code
            }
            this.loading = true
            initStock(params).then(response => {
                this.loading = false
                if (response.code != 20000) {
                    this.$message.error(response.message);
                    return
                }
                this.$message.info("初始化成功")
                this.getStockList()
            })
            this.loading = false // 确保服务接口出现任何异常，loading 恢复正常
        },
        // 跟踪该股
        track: function(code) {
            var params = {
                code: code
            }
            this.loading = true
            track(params).then(response => {
                this.loading = false
                if (response.code != 20000) {
                    this.$message.error(response.message);
                    return
                }
                this.$message.info("操作成功")
                this.getStockList()
            })
            this.loading = false
        },
        // 不再跟踪该股
        untrack: function(code) {
            var params = {
                code: code
            }
            this.loading = true
            untrack(params).then(response => {
                this.loading = false
                if (response.code != 20000) {
                    this.$message.error(response.message);
                    return
                }
                this.$message.info("操作成功")
                this.getStockList()
            })
            this.loading = false
        },
        // 编辑该股
        edit: function(code) {
            this.isEdit = true
            this.showAdd = true
            this.editCode = code
        },
        // 增量同步
        incrSync: function(code) {

        },
    },
    mounted: function() {
        this.getStockList()
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
