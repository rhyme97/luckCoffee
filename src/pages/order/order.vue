<template>
    <view id="orderContent">
        <view id="orderSelect">
            <text :class="userSelect===0" @click="change(0)">全部</text>
            <text :class="userSelect===1" @click="change(1)">立等可取</text>
            <text :class="userSelect===2" @click="change(2)">预约订单</text>
        </view>
        <view v-show="userSelect===0" class="likeIframe">
            <view v-for="(item,index) in myOrder" class="GoodsItem" :key="index">
                <view class="orderHeader">
                    <text>{{item.getWay}}订单********00{{item.orderId}}</text>
                    <text>{{item.payState}}</text>
                </view>
                <view class="orderContent1" v-for="(good,index) in item.orderGoods" :key="index">
                    <img :src="good[0].imgsrc" mode="aspectFill" alt="">
                    <text class="goodsName">{{good[0].name}}</text>
                    <text>x{{good[1]}}</text>
                    <text>￥{{good[0].price}}</text>
                </view>
                <view class="orderContent2">
                    <text>配送费</text>
                    <text>￥0</text>
                </view>
                <view class="orderContent2">
                    <text>优惠减免合计</text>
                    <text>-{{item.discountPrice}}</text>
                </view>
                <view class="orderFooter">
                    <text>共{{count(index)}}件商品</text>
                    <text>实付</text>
                    <text>￥{{item.payPrice}}</text>
                </view>
            </view>
        </view>
        <view v-show="userSelect===1" class="likeIframe">
            <view v-for="(item,index) in myGoods" class="GoodsItem" :key="index">
                <view class="orderHeader">

                </view>
                <view class="orderContent">
<!--                    <img :src="item[0].imgsrc" mode="aspectFill" alt="">-->
<!--                    <text class="goodsName">{{item[0].name}}</text>-->
<!--                    <text>x1</text>-->
<!--                    <text>￥{{item[0].price}}</text>-->
                </view>
            </view>
        </view>
        <view v-show="userSelect===2">
            <view class="noOrder">
                <img src="../../static/images/orderImage.png" alt="">
                <text>您还没有订单哦</text>
                <view @click="toMenu">
                    <text>去喝一杯</text>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "order",
        data(){
            return{
                userSelect:0,
                myOrder:[],
            }
        },
        methods:{
            change(num){
                this.userSelect=num
            },
            toMenu(){
                uni.switchTab({
                    url: '/pages/menu/menu'
                });
            },
            count(index){
                 let arr=this.myOrder[index].orderGoods;
                 let count=0;
                arr.forEach(item=>{
                    count+=parseInt(item[1])
                });
                return count
            },
        },
        created(){
            let id='';
            uni.getStorage({
                key: 'userId',
                success: function (res) {
                    id=res.data
                }
            });
            uni.request({
                url: 'http://rhymin.cn:3000/getOrder',
                method:'POST',
                data:{
                    userId:id||'1'
                },
                success: (res) => {
                    console.log(res.data.data);
                    this.myOrder=res.data.data;
                    this.myOrder.reverse()
                }
            });
        },
        computed:{

        }
    }
</script>

<style scoped lang="less">
    #orderContent{
        width: 90%;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin:50rpx auto 0;
    }
    #orderSelect{
        width: 100%;
        background-color: #6D87C4;
        border: 4rpx solid #6D87C4;
        color: white;
        height: 60rpx;
        border-radius: 30rpx;
    }
    .false{
        display: inline-block;
        width: 33.33%;
        text-align: center;
        height: 60rpx;
        border-radius: 30rpx;
        font-size: 0.8rem;
        line-height: 60rpx;
    }
    .true{
        display: inline-block;
        width: 33.33%;
        text-align: center;
        background: white;
        color: #6D87C4;
        height: 60rpx;
        border-radius: 30rpx;
        font-size: 0.8rem;
        line-height: 60rpx;
    }
    .noOrder{
        width: 500rpx;
        text-align: center;
        margin: 220rpx 0 0;
        image{
            display: block;
            width: 200rpx;
            height: 200rpx;
            margin: auto;
        }
        text{
            display: inline-block;
            margin: 20rpx 0;
            color: #717171;
            font-size: 0.9rem;
        }
        view{
            margin-top: 40rpx;
            height: 80rpx;
            border-radius: 40rpx;
            background-color: #6D87C4;
            text{
                margin: 0;
                height: 80rpx;
                line-height: 80rpx;
                color: white;
            }
        }
    }
    .likeIframe{
        width: 100%;
    }
    .GoodsItem{;
        margin: 20rpx 0;
        padding: 20rpx;
        display: flex;
        flex-direction: column;
        background-color: white;
        border-radius: 10rpx;
        .orderHeader{
            padding: 20rpx 0;
            font-size: 0.6rem;
            color: #7f7f7f;
            border-bottom: 2rpx solid #7f7f7f;
            display: flex;
            justify-content: space-between;
        }
        .orderContent1{
            margin: 20rpx 0;
            display: flex;
            justify-content: space-around;
            font-size: 0.9rem;
            image{
                width: 100rpx;
                height: 100rpx;
                border-radius: 10rpx;
                margin-right: 30rpx;
            }
            .goodsName{
                display: inline-block;
                width: 35%;
                font-weight: bold;
            }
        }
        .orderContent2{
            padding: 10rpx 20rpx;
            font-size: 0.9rem;
            font-weight: bolder;
            display: flex;
            justify-content: space-between;
            text:last-child{
                color: orangered;
            }
        }
        .orderFooter{
            border-top: 2rpx solid #7f7f7f;
            padding: 20rpx;
            text-align: right;
            text:first-child{
                font-size: 0.6rem;
                color: #7f7f7f;
            }
            text:nth-of-type(2){
                margin: 0 20rpx;
            }
            text:last-child{
                font-weight: bolder;
                font-size: 1.2rem;
            }
        }
    }
</style>

<style>
    page{
        background-color: #f3f3f3;
    }
</style>