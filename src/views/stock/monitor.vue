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
            <el-form-item label="类 型" prop="monitorType">
                <el-radio v-model="formData.monitorType" :label="0">BIAS</el-radio>
                <el-radio v-model="formData.monitorType" :label="1">PRICE</el-radio>
            </el-form-item>
            <div v-show="formData.monitorType==0">
                <el-form-item label="BUY BIAS" prop="buyBias" label-width="105px">
                    <el-input v-model="formData.buyBias"></el-input>
                </el-form-item>
                <el-form-item label="SELL BIAS" prop="sellBias" label-width="105px">
                    <el-input v-model="formData.sellBias"></el-input>
                </el-form-item>
            </div>
            <div v-show="formData.monitorType==1">
                <el-form-item label="BUY PRICE" prop="buyPrice" label-width="105px">
                    <el-input v-model="formData.buyPrice"></el-input>
                </el-form-item>
                <el-form-item label="SELL PRICE" prop="sellPrice" label-width="105px">
                    <el-input v-model="formData.sellPrice"></el-input>
                </el-form-item>
            </div>
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
        var validateBuyPrice = (rule, value, callback) => {
            if (this.formData.monitorType == 1 && value === '') {
                return callback(new Error('请输入 buy price'))
            }
            callback();
        };
        var validateSellPrice = (rule, value, callback) => {
            if (this.formData.monitorType == 1 && value === '') {
                return callback(new Error('请输入 sell price'))
            }
            callback();
        };
        var validateBuyBias = (rule, value, callback) => {
            if (this.formData.monitorType == 0 && value === '') {
                return callback(new Error('请输入 buy bias'))
            }
            callback();
        };
        var validateSellBias = (rule, value, callback) => {
            if (this.formData.monitorType == 0 && value === '') {
                return callback(new Error('请输入 sell bias'))
            }
            callback();
        };

        return {
            formName: 'monitorForm',
            formData: {
                status: 1,
                monitorType: 0,
                buyPrice: '',
                sellPrice: '',
                buyBias: '',
                sellBias: '',
                message: '',
            },
            rules: {
                status: [
                    {required: true}
                ],
                monitorType: [
                    {required: true}
                ],
                buyPrice: [
                    {required: true, validator: validateBuyPrice, trigger: 'blur'}
                ],
                sellPrice: [
                    {required: true, validator: validateSellPrice, trigger: 'blur'}
                ],
                buyBias: [
                    {required: true, validator: validateBuyBias, trigger: 'blur'}
                ],
                sellBias: [
                    {required: true, validator: validateSellBias, trigger: 'blur'}
                ],
            },
        }
    },
    methods: {
        save: function() {
            this.$refs[this.formName].validate((valid) => {
                if (valid) {
                    if (this.formData.buyPrice === '') {
                        this.formData.buyPrice = 0
                    }
                    if (this.formData.sellPrice === '') {
                        this.formData.sellPrice = 0
                    }
                    if (this.formData.buyBias === '') {
                        this.formData.buyBias = 0
                    }
                    if (this.formData.sellBias === '') {
                        this.formData.sellBias = 0
                    }

                    var params = {
                        'code': this.code,
                        'type': this.formData.monitorType,
                        'status': this.formData.status,
                        'buy_bias': parseFloat(this.formData.buyBias),
                        'sell_bias': parseFloat(this.formData.sellBias),
                        'buy_price': parseFloat(this.formData.buyPrice),
                        'sell_price': parseFloat(this.formData.sellPrice),
                        'message': this.formData.message,
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
            if (this.$refs[this.formName] !== undefined) {
                this.$refs[this.formName].resetFields();
            }
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

                if (response.data.status != undefined) {
                    this.formData.status = response.data.status
                    this.formData.monitorType = response.data.type
                    this.formData.buyBias = response.data.buy_bias == 0 ? '' : response.data.buy_bias
                    this.formData.sellBias = response.data.sell_bias == 0 ? '' : response.data.sell_bias
                    this.formData.buyPrice = response.data.buy_price == 0 ? '' : response.data.buy_price
                    this.formData.sellPrice = response.data.sell_price == 0 ? '' : response.data.sell_price
                    this.formData.message = response.data.message
                }
            })
        },
    },
    watch: {
        showMonitor: function(newValue, oldValue) {
            if (newValue) { // 显示
                this.getPriceMonitor()
            } else {
                this.init()
            }
        }
    }
}
</script>
