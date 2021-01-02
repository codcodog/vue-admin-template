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
            <el-form-item label="AVE PRICE" prop="avePrice">
                <el-input v-model="formData.avePrice"></el-input>
            </el-form-item>
            <el-form-item label="BUY BIAS" prop="buyBias">
                <el-input v-model="formData.buyBias"></el-input>
            </el-form-item>
            <el-form-item label="SELL BIAS" prop="sellBias">
                <el-input v-model="formData.sellBias"></el-input>
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
                avePrice: '',
                buyBias: '',
                sellBias: '',
            },
            rules: {
                status: [
                    {required: true}
                ],
                avePrice: [
                    {required: true, message: "请输入平均价格", trigger: 'blur'}
                ],
                buyBias: [
                    {required: true, message: "请输入 buy bias", trigger: 'blur'}
                ],
                sellBias: [
                    {required: true, message: "请输入 sell bias", trigger: 'blur'}
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
                        ave_price: this.formData.avePrice,
                        buy_bias: this.formData.buyBias,
                        sell_bias: this.formData.sellBias,
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
            this.formData.status = 1
            this.formData.avePrice = ''
            this.formData.buyBias = ''
            this.formData.sellBias = ''
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
                    this.formData.avePrice = response.data.ave_price
                    this.formData.buyBias = response.data.buy_bias
                    this.formData.sellBias = response.data.sell_bias
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
