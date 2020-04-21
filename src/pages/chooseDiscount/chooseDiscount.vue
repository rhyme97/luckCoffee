<template>
    <view class="mycoupon">
        <view v-if="ifRender">
            <view class="coupon-item" v-for="(item,index) in discounAll" :key="index">
                <view class="coupon-top">
                    <view class="coupon-left">
                        <view class="coupon-name">{{item.discountName}}</view>
                        <view class="coupon-deadline">有效期至{{item.dTime}}</view>
                    </view>
                    <view class="coupon-right discount">{{item.dType}}</view>
                </view>
                <view class="coupon-bottom">
                    <view class="useRule">查看使用规则</view>
                    <view class="useNow" @click="useDiscount">
                        立即使用
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "chooseDiscount",
        data(){
          return{
              userId:'',
              discounAll: [],
              ifRender: false,
              priceSum:0
          }
        },
        methods:{
            useDiscount(){
                uni.ba
            }
        },
        onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
            console.log(option.userId); //打印出上个页面传递的参数。。
            this.userId=option.userId
            this.priceSum=option.priceSum
            new Promise((resolve,reject) => {
                uni.request({
                    url: 'http://rhymin.cn:3000/getDiscount',
                    method: 'POST',
                    data: {
                        userId: this.userId
                    },
                    success({data}) {
                        resolve(data)
                    },
                    fail(err) {
                        reject(err)
                    }
                })
            }).then(res => {
                console.log(res)
                if (this.priceSum>100){
                    this.discounAll=res.result
                }else if(this.priceSum>30){
                    this.discounAll=res.result.filter(item=>item.dType=="5.0折"||item.dType=="满三十减")
                }else {
                    this.discounAll=res.result.filter(item=>item.dType=="5.0折")
                }
                console.log(this.discounAll)
                this.ifRender = true
            }).catch(err => {
                console.error(err)
            })
        },
    }
</script>

<style scoped lang="less">
    page {
        height: 100%;
    }
    .mycoupon {
        height: 100%;
        background-color: #F5F5F5;
        padding-top: 40rpx;
        .coupon-item {
            background-color: white;
            margin:0 20rpx 40rpx;
            padding: 0 20rpx;
            border-radius: 20rpx;
            .coupon-top {
                display: flex;
                justify-content: space-between;
                align-content: center;
                border-bottom: 1rpx solid #ddd;
            .coupon-left {
                .coupon-name {
                    color: black;
                    margin: 60rpx 0 30rpx 0;
                }
                .coupon-deadline {
                    color: #999;
                    margin: 30rpx 0 60rpx 0;
                    font-size: 24rpx;
                }
            }
            .coupon-right {
                display: flex;
                align-items: center;
                color: #7285BF;
                font-size: 48rpx;
            }
        }
            .coupon-bottom {
                display: flex;
                justify-content: space-between;
                height: 80rpx;
                line-height: 80rpx;
                .useRule{
                    color: #999;
                    font-size: 24rpx;
                }
                .useNow{
                    line-height: 28rpx;
                    margin: 10rpx 0;
                    padding: 20rpx 40rpx;
                    color: white;
                    background-color: #7285BF;
                    border-radius: 40rpx;

                }
            }
        }
    }
</style>