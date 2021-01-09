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
                        <el-button type="text" @click="log(scope.row.code)">同步日志</el-button>

                        <el-button type="text" @click="untrack(scope.row.code)" v-if="scope.row.status == 1">停止跟踪</el-button>
                        <el-button type="text" @click="track(scope.row.code)" v-else>开始跟踪</el-button>
                        <el-button type="text" @click="monitor(scope.row.code, scope.row.name)">价格监控</el-button>
                        <el-button type="text" @click="del(scope.row.code)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-row>
        <el-row>
            <div class="page">
                <el-pagination
                    layout="prev, pager, next"
                    @current-change="pageChange"
                    :hide-on-single-page="true"
                    :page-size="pageSize"
                    :current-page="page"
                    :total="total">
                </el-pagination>
            </div>
        </el-row>
        <el-row>
            <v-add :showAdd="showAdd" :isEdit="isEdit" :code="editCode" @closeAdd="closeAdd()"/>
        </el-row>
        <el-row>
            <v-log :showLog="showLog" :code="logCode" @closeLog="closeLog()"/>
        </el-row>
        <el-row>
            <v-monitor :showMonitor="showMonitor" :codeName="codeName" :code="monitorCode" @closeMonitor="closeMonitor()"/>
        </el-row>
    </div>
</template>
<script>
import Add from './add'
import Log from './log'
import Monitor from './monitor'
import {getStock, initStock, track, untrack, incrSync, del} from '@/api/stock'

export default {
    name: "data-sync",
    components: {
        "v-add": Add,
        "v-log": Log,
        "v-monitor": Monitor
    },
    data: function() {
        return {
            loading: false, // table 加载
            tableData: [],

            // 显示新增页面
            showAdd: false,

            // 显示同步日志
            showLog: false,
            logCode: '',

            // 是否编辑
            isEdit: false,
            editCode: '',  // 编辑的 code

            // 显示价格监控
            showMonitor: false,
            codeName: '',
            monitorCode: '',

            // 分页
            page: 1,
            pageSize: 10,
            total: 0,
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
        log: function(code) {
            this.showLog = true
            this.logCode = code
        },
        closeLog: function() {
            this.showLog = false
        },
        // 获取股票列表
        getStockList: function() {
            var params = {
                'page': this.page,
                'size': this.pageSize,
            }
            getStock(params).then(response => {
                if (response.code != 20000) {
                    this.$message.error(response.message);
                    return
                }
                this.tableData = response.data.data
                this.total = response.data.total
            })
        },
        // 分页修改
        pageChange: function(currentPage) {
            this.page = currentPage
            this.getStockList()
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
        // 删除该股
        del: function(code) {
            console.log(code)
            this.$confirm('是否删除该股？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var params = {
                    code: code
                }
                this.loading = true
                del(params).then(response => {
                    this.loading = false
                    if (response.code != 20000) {
                        this.$message.error(response.message);
                    } else {
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        })
                        this.getStockList()
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        // 编辑该股
        edit: function(code) {
            this.isEdit = true
            this.showAdd = true
            this.editCode = code
        },
        // 增量同步
        incrSync: function(code) {
            var params = {
                code: code
            }
            this.loading = true
            incrSync(params).then(response => {
                if (response.code != 20000) {
                    this.$message.error(response.message);
                    return
                }
                this.$message.info("同步成功")
            })
            this.loading = false
        },
        monitor: function(code, name) {
            this.monitorCode = code
            this.codeName = name
            this.showMonitor = true
        },
        closeMonitor: function() {
            this.monitorCode = ''
            this.codeName = ''
            this.showMonitor = false
        }
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
.page {
    margin: 7px 15px;
}
</style>
