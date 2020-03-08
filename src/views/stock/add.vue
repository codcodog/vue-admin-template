<template>
    <el-dialog
        :title="isEdit ? '更新股票':'新增股票'"
        :visible.sync="showAdd"
        width="30%"
        :before-close="handleClose">
        <el-form :model="formData" :rules="rules" :ref="formName" label-width="100px">
            <el-form-item label="股票代码" prop="code">
                <el-input v-model="formData.code" :disabled="isEdit"></el-input>
            </el-form-item>
            <el-form-item label="股票昵称" prop="name">
                <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="开始日期" prop="startDate">
                <el-date-picker
                    v-model="formData.startDate"
                    type="date"
                    :disabled="isEdit"
                    placeholder="选择日期时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="doUpdate()" v-if="isEdit">更 新</el-button>
                <el-button type="primary" @click="doAdd()" v-else>添 加</el-button>
                <el-button @click="handleClose()">关 闭</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script>
import {addStock, getStockInfo, updateStockInfo} from '@/api/stock'

export default {
    name: "add",
    props: ['showAdd', 'isEdit', 'code'],
    data: function(){
        return {
            formName: 'stockForm',
            formData: {
                code: '',
                name: '',
                startDate: ''
            },
            rules: {
                code: [
                    {required: true, message: "请输入股票代码", trigger: 'blur'}
                ],
                name: [
                    {required: true, message: "请输入股票昵称", trigger: 'blur'}
                ],
                startDate: [
                    {required: true, message: "请输入开始日期", trigger: 'blur'}
                ],
            },
        }
    },
    methods: {
        handleClose: function() {
            this.initData()
            this.$emit('closeAdd')
        },
        // 初始化数据
        initData: function() {
            this.$refs[this.formName].resetFields();
        },
        // 新增股票
        doAdd: function() {
            this.$refs[this.formName].validate((valid) => {
                if (valid) {
                    var params = {
                        code: this.formData.code,
                        name: this.formData.name,
                        startDate: this.getDateString(this.formData.startDate)
                    }
                    addStock(params).then(response => {
                        if (response.code != 20000) {
                            this.$message.error(response.message);
                            return
                        }
                        this.$message.info("添加成功")
                        this.handleClose()
                    })
                } else {
                    return false;
                }
            })
        },
        // 获取 年-月-日 格式字符串
        getDateString: function(param){
            var dd = String(param.getDate()).padStart(2, '0');
            var mm = String(param.getMonth() + 1).padStart(2, '0');
            var yyyy = param.getFullYear();

            return yyyy+'-'+mm+'-'+dd;
        },
        // 获取股票信息
        getStockInfo: function(){
            var params = {
                code: this.code
            }
            getStockInfo(params).then(response => {
                if (response.code != 20000) {
                    this.$message.error(response.message);
                    return
                }
                this.formData.code = response.data.code
                this.formData.name = response.data.name
                this.formData.startDate = response.data.startDate
            })
        },
        // 更新该股基本信息
        doUpdate: function() {
            this.$refs[this.formName].validate((valid) => {
                if (valid) {
                    var params = {
                        code: this.code,
                        name: this.formData.name
                    }
                    updateStockInfo(params).then(response => {
                        if (response.code != 20000) {
                            this.$message.error(response.message);
                            return
                        }
                        this.$message.info("更新成功")
                        this.handleClose()
                    })
                } else {
                    return false
                }
            })
        },
    },
    watch: {
        showAdd: function(newValue, oldValue) {
            if (this.isEdit) {
                this.getStockInfo()
            }
        },
    }
}
</script>
