<template>
    <el-dialog
        :visible.sync="showLog"
        width="50%"
        :before-close="handleClose">
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
                    label="同步状态">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status == 0 ? 'success' : 'danger'">{{ scope.row.status == 0 ? '成功':'失败'}}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="message"
                    label="报错信息">
                </el-table-column>
                <el-table-column
                    prop="date"
                    label="同步日期">
                </el-table-column>
            </el-table>
    </el-dialog>
</template>
<script>
import {getLog} from '@/api/stock'

export default {
    name: "sync-log",
    props: ["showLog", "code"],
    data: function() {
        return {
            tableData: []
        }
    },
    methods: {
        handleClose: function(){
            this.$emit('closeLog')
        },
        getLog: function() {
            var params = {
                code: this.code
            }
            getLog(params).then(response =>{
                if (response.code != 20000) {
                    this.$message.error(response.message);
                    return
                }
                this.tableData = response.data
            })
        }
    },
    watch: {
        showLog: function(newValue, oldValue) {
            if (newValue) {
                this.getLog()
            }
        }
    }
}
</script>
