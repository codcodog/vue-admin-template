<template>
    <el-dialog
        title="价格监控"
        :visible.sync="showMonitor"
        width="30%"
        :before-close="handleClose">
        <el-form :model="formData" :rules="rules" :ref="formName" label-width="100px">
            <el-form-item label="昵 称" prop="name">
                <el-input v-model="codeName" disabled></el-input>
            </el-form-item>
            <el-form-item label="监 控" prop="status">
                <el-radio v-model="formData.status" :label="1">开启</el-radio>
                <el-radio v-model="formData.status" :label="0">关闭</el-radio>
            </el-form-item>
            <el-form-item label="BUY PRICE" prop="buyPrice" label-width="105px">
                <el-input v-model="formData.buyPrice"></el-input>
            </el-form-item>
            <el-form-item label="SELL PRICE" prop="sellPrice" label-width="105px">
                <el-input v-model="formData.sellPrice"></el-input>
            </el-form-item>
            <el-form-item label="备 注" prop="message" label-width="105px">
                <el-input type="textarea" :autosize="{minRows: 2, maxRows: 5}"  v-model="formData.message"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="save()">保存</el-button>
                <el-button @click="handleClose()">关闭</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script>
import {getPriceMonitor, savePriceMonitor} from '@/api/stock'

export default {
    name: "monitor",
    props: ['showMonitor', 'codeName', 'code'],
    data: function() {
        return {
            formName: 'monitorForm',
            formData: {
                status: 1,
                buyPrice: '',
                sellPrice: '',
                message: '',
            },
            rules: {
                status: [
                    {required: true}
                ],
                buyPrice: [
                    {required: true, message: "请输入 buy price", trigger: 'blur'}
                ],
                sellPrice: [
                    {required: true, message: "请输入 sell price", trigger: 'blur'}
                ],
            },
        }
    },
    methods: {
        save: function() {
            this.$refs[this.formName].validate((valid) => {
                if (valid) {
                    var params = {
                        code: this.code,
                        status: this.formData.status,
                        buy_price: this.formData.buyPrice,
                        sell_price: this.formData.sellPrice,
                        message: this.formData.message,
                    }
                    savePriceMonitor(params).then(response => {
                        if (response.code != 20000) {
                            this.$message.error(response.message);
                            return
                        }
                        this.$message.info("保存成功")
                        this.handleClose()
                    })
                }
            })
        },
        handleClose: function() {
            this.$emit('closeMonitor')
        },
        init: function() {
            this.$refs[this.formName].resetFields()
        },
        // 获取价格监控数据
        getPriceMonitor: function() {
            var params = {
                code: this.code
            }
            getPriceMonitor(params).then(response => {
                if (response.code != 20000) {
                    this.$message.error(response.message);
                    return
                }

                if (response.data.status == undefined) {
                    this.init()
                } else {
                    this.formData.status = response.data.status
                    this.formData.buyPrice = response.data.buy_price
                    this.formData.sellPrice = response.data.sell_price
                    this.formData.message = response.data.message
                }
            })
        },
    },
    watch: {
        showMonitor: function(newValue, oldValue) {
            if (newValue) { // 显示
                this.init()
                this.getPriceMonitor()
            }
        }
    }
}
</script>
