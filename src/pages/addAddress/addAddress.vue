<template>
    <view class="addAddress">
        <form>
            <view>
                <view class="title">联系人</view>
                <input v-model="editForm.contact" placeholder="用于取餐时对您的称号" />
            </view>
            <view class="sex">
                <view class="title">性别</view>
                <radio-group name="radio" @change="sexHander">
                    <label>
                        <radio value="男" :checked="editForm.sex=='男'" /><text>先生</text>
                    </label>
                    <label>
                        <radio value="女" :checked="editForm.sex=='女'" /><text>女士</text>
                    </label>
                </radio-group>
            </view>
            <view class="uni-form-item uni-column">
                <view class="title">手机号</view>
                <input v-model="editForm.tel" placeholder="请输入您的手机号" />
            </view>
            <view>
                <view class="title">地址</view>
                <input v-model="editForm.site" placeholder="请输入收货地址" />
            </view>
            <view>
                <view class="title">门牌号</view>
                <input v-model="editForm.houseNum" placeholder="如：5号楼208室" />
            </view>
            <view class="addressLabel">
                <view class="title">标签</view>
                <text :class="editForm.label=='公司'?'select':'' " @click="labelChangeHander('公司')">公司</text>
                <text :class="editForm.label=='家'?'select':'' " @click="labelChangeHander('家')">家</text>
                <text :class="editForm.label=='学校'?'select':'' " @click="labelChangeHander('学校')">学校</text>
            </view>
            <view>
                <label class="radio">
                    <radio value="是" :checked="editForm.defaultSite=='是'" @click="defaultHander" />设为默认地址</label>
            </view>
            <view>
                <button type="default" @click="addIt">添加地址</button>
            </view>
        </form>
        <uni-popup class="mypop" ref="popup" type="center">{{tips}}</uni-popup>
    </view>
</template>
<script>
import uniPopup from '@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue'
export default {
    name: "addAddress",
    data() {
        return {
            editForm: {
                userId: '',
                contact: '',
                sex: '男',
                tel: '',
                site: '',
                houseNum: '',
                label: '',
                defaultSite: '是'
            },
            tips: '请填写必要信息',
            myId: ''
        }
    },
    components: {
        uniPopup
    },
    methods: {
        sexHander(e) {
            console.log(e)
            this.editForm.sex = e.detail.value
        },
        labelChangeHander(e) {
            console.log(e)
            this.editForm.label = e
        },
        defaultHander() {
            console.log('dd')
            if (this.editForm.defaultSite == '是') {
                this.editForm.defaultSite = '否';
            } else {
                this.editForm.defaultSite = '是';
            }
        },
        addIt() {
            let sure = true;
            for (let key in this.editForm) {
                if (!this.editForm[key]) {
                    sure = false;
                }
            }
            if (sure) {
                let myregular = /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/;
                if (myregular.test(this.editForm.tel)) {
                    //添加请求
                    uni.request({
                        method: 'POST',
                        url: "http://rhymin.cn:3000/addAddress",
                        data: this.editForm,
                        success: res => {
                            console.log(res)
                            if (res.data.tips == 'success') {
                                //添加成功跳转
                                this.tips = '添加成功'
                                this.$refs.popup.open()
                                 uni.navigateBack({
                                    delta: 1
                                });
                            }
                        }
                    })
                } else {
                    this.tips = '请输入有效电话号码'
                    this.$refs.popup.open()
                }
            } else {
                this.tips = '请填写必要信息'
                this.$refs.popup.open()
            }

        }
    },
    created() {
        uni.getStorage({
            key: 'userId',
            success: res => {
                this.editForm.userId = res.data;
            }
        });
    }
}
</script>
<style lang="less" scoped>
.addAddress {
    display: flex;
    flex-direction: column;
    align-items: center;

    form {
        display: flex;
        width: 95%;
        flex-direction: column;

        .addressLabel {
            text {
                padding: 5rpx 15rpx;
                margin: 0 15rpx;
                border-radius: 8rpx;
                background-color: #F5F5F5;
                color: black;
            }

            .select {
                background-color: white;
                border: 1rpx solid #6D87C4;
                color: #6D87C4;
            }
        }

        .sex {
            radio {
                padding: 0 5rpx;
            }
        }

        view {
            background-color: white;
            display: flex;
            align-items: center;
            border-bottom: 2rpx solid grey;
            padding: 15rpx 0;

            view {
                width: 150rpx;
                color: grey;
                border: none;
            }

            button {
                flex: 1;
                margin: 20rpx;
                border-radius: 20rpx;
            }

            button:first-of-type {
                background-color: white;
                color: black;
            }

            button:last-of-type {
                background-color: #6D87C4;
                color: white;
            }
        }
    }

    .mypop {
        color: white;
    }
}
</style>
<style>
page {
    background-color: #F4F4F4;
}
</style>