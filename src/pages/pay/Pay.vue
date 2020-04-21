<template>
    <view id="myOrder">
        <view style="font-size:20px;font-weight:bolder;text-align: center;padding: 20px 0">
            <text>立即自取(约{{nowTime}}可取)</text>
        </view>
        <view class="mycolor" id="address">
            <img src="../../static/icon/1.png" alt="">
            <view id="addressBox" v-if="num==1">
                    <text>{{address}}</text>
                    <text>{{distance?'距离您'+distance+'m':city}}</text>
            </view>
            <view id="addressBox" v-else>
                    <text>{{address}}</text>
                    <text>{{telName?telName:city}}</text>
            </view>
            <view id="checkedBox">
                <view :class="num==1?'checked':''" @click="check(1)">自提</view>
                <view :class="num==2?'checked':''" @click="check(2)">外送</view>
            </view>
        </view>
        <view class="mycolor" id="shop">
            <view class="uni-list-cell uni-list-cell-pd" v-for="item in shop" :key="item.id">
                <view class="myshop">
                    <view style="width: 90px;height: 90px;">
                        <image style="width: 90px;height: 90px;"  mode="center" :src="item.imgsrc"></image>
                    </view>
                    <view class="standard">
                        <view style="font-size: 12px;font-weight:bolder;color: #0C0C0C">{{item.name}}</view>
                        <view style="margin-top:20px;font-size: 12px;color: grey">
                            <text >大/</text>
                            <text v-if="item.standard[1]==0">默认奶油/</text>
                            <text v-else-if="item.standard[1]==1">单份奶/</text>
                            <text v-else-if="item.standard[1]==2">双份奶/</text>
                            <text v-else-if="item.standard[1]==3">无奶油/</text>
                            <text v-if="item.standard[2]==1">无糖/</text>
                            <text v-else-if="item.standard[2]==2">半糖/</text>
                            <text v-else-if="item.standard[2]==3">全糖/</text>
                            <text v-if="item.standard[0]==1">冰</text>
                            <text v-else-if="item.standard[0]==2">热</text>
                        </view>
                    </view>
                    <view>
                        <text>
                            X{{item.goodsNum}}
                        </text>
                    </view>
                    <view style="color: red">￥{{item.price}}</view>
                </view>
            </view>
            <view style="text-align: right;padding-top: 10px;border-top: 1px solid #d2d6d1">
                <text>小计 <text style="font-weight: bolder">￥{{priceSum}}</text></text>
            </view>
        </view>
        <view class="mycolor" >
            <view style="padding:0 10px;line-height:30px;font-size:12px;
            margin-bottom:20px;background-color: rgba(255,143,34,0.52);
            border-radius: 5px;border: 1px solid #ff803d">
                用咖啡钱包<text style="color: #ff8e2f">&nbsp;充2赠1</text>,立享优惠
            </view>
            <view class="mydiscount" @click="chooseDiscount" v-if="discount.length">
                <text>优惠券</text>
                <text style="color: #ff8e2f">{{discount.length}}个可用
                    <text style="color: grey">&nbsp;></text>
                </text>
            </view>
            <view class="mydiscount" v-else>
                <text>优惠券</text>
                <text style="color: #ff8e2f">无可用</text>
            </view>
        </view>
        <view class="mycolor mydiscount" @click="openPayType">
            <text>支付方式</text>
            <text>
                <uni-icons color="green" type="weixin" size="30"></uni-icons>
                微信支付
                <text style="color: grey">&nbsp;></text>
            </text>
        </view>
        <uni-popup ref="popup" type="bottom">
            <view id="pay">
                <view style="background-color:#ebebeb;padding:20px 0;text-align: center">支付中心</view>
                <view class="mydiscount" style="border-bottom:1px solid rgba(163,153,158,0.55);line-height: 50px">
                    <view>
                        <uni-icons color="blue" type="person" size="30"></uni-icons>
                        <text style="margin-left: 10px">钱包账户余额</text>
                        <text style="color: #919191">(剩余￥0)</text>
                    </view>
                    <view>
                        <text style="color: #919191">余额不足</text>
                    </view>
                </view>
                <view @click="closePayType" class="mydiscount" style="line-height: 30px">
                    <view>
                        <uni-icons color="green" type="weixin" size="30"></uni-icons>
                        <text style="margin-left: 10px">微信支付</text>
                        <text style="background-color: #ff2d1f;color: white">推荐</text>
                    </view>
                    <view>
                        <radio value="r1" checked="true" color="#705084"/>
                    </view>
                </view>
                <view @click="closePayType" style="text-align:center;line-height:50px;width:50px;height:50px;position: absolute;top: 0;right: 0">X</view>
            </view>
        </uni-popup>
        <view class="mycolor uni-padding-wrap">
            <view class="mydiscount">
                <view class="uni-title">取餐方式</view>
                <view>
                    <radio-group @change="radioChange">
                        <label class="radio"><radio value="r1" checked="true" />店内用餐</label>
                        <label class="radio"><radio value="r2" />自提带走</label>
                    </radio-group>
                </view>
            </view>
            <view class="mycolor" style="border-top: 1px solid #d2d6d1" @click="beizhu">
<!--                <text style="font-size: 12px;">备注特殊要求</text>-->
                <label>
                    <textarea placeholder="备注特殊要求" auto-height />
                </label>
            </view>
        </view>

        <uni-popup ref="beizhu" type="bottom">
            <view id="beizhu">
                <view style="padding:20px 0;text-align: center">订单备注</view>
                <view>
                    <view>
                        <text>无接触配送：</text>
                        <text class="chooseBeizhu">不需要</text>
                        <text>需要</text>
                    </view>
                    <view>
                        <text>纸巾：</text>
                        <text class="chooseBeizhu">不需要</text>
                        <text>需要</text>
                    </view>
                    <view>
                        <text>奶包：</text>
                        <text class="chooseBeizhu">不需要</text>
                        <text>需要</text>
                    </view>
                    <view>
                        <text>糖包：</text>
                        <text class="chooseBeizhu">不需要</text>
                        <text>需要</text>
                    </view>
                    <view style="margin:20px;height:50px;background-color:#eeeeee;font-size: 12px;color: grey">
                        <label>
                            <textarea placeholder="请备注内容(口味备注不在此留言)" maxlength="30" @blur="bindTextAreaBlur" auto-height />
                        </label>
                    </view>
                    <button @click="closeBeizhu" style="width:90%;height:50px;background-color: rgba(91,70,119,0.96);color: white">确定</button>
                </view>
                <view @click="closeBeizhu" style="text-align:center;line-height:50px;width:50px;height:50px;position: absolute;top: 10px;right: 10px">X</view>
            </view>
        </uni-popup>
        <view>
            <view>
                <label class="radio">
                    <radio checked="true" color="rgba(91,70,119,0.96)"/>
                    <text>我已阅读并同意<text style="color: rgba(150,112,191,0.96)">《支付协议》</text></text>
                </label>
            </view>
            <view style="font-size: 12px">
                温馨提示：仅支持开具电子发票，订单完成后前往发票管理中开具
            </view>
        </view>
        <view class="mydiscount" style="font-size:18px;padding: 10px 10px 0 20px;">
            <text>合计：<text style="font-weight: bolder">￥{{priceSum}}</text></text>
            <text @click="goPay" style="border-radius:20px;padding: 5px 10px;color: white;background-color: #ff5735">去支付</text>
        </view>
    </view>
</template>

<script>
    import uniPopup from "@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue"
    import uniIcons from "@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue"
    export default {
        name: "Pay",
        components: {
            uniIcons,
            uniPopup
        },
        data(){
            return{
                userId:'',
                address:'',
                num:1,
                nowTime:"22:29",
                shop:[],
                discount:[],
                chooseBeizhu:[1,1,1,1],
                distance:0,
                telName:'',
                city:''
            }
        },
        computed:{
            priceSum(){
                let sum=0;
                console.log(this.shop)
                for (let i=0;i<this.shop.length;i++){
                    if (this.shop[i].checked===2){
                        sum=this.shop[i].price*this.shop[i].goodsNum+sum
                    }
                }
                console.log(sum)
                // return parseInt(sum)
                return sum
            }
        },
        methods:{
            getTime(){
                let d=new Date().getTime()+180000
                let newTime=new Date(d)
                let min=newTime.getMinutes()>10?newTime.getMinutes() :'0'+newTime.getMinutes()
                let hour=newTime.getHours()>10?newTime.getHours():'0'+newTime.getHours()
                return hour+':'+min
            },
            goPay(){
                let orderGoods=[]
                this.shop.forEach(item=>{
                    this.goPayReq(item.userId,item.shopId)
                    let order=item.shopId+"*"+item.goodsNum
                    orderGoods.push(order)
                })
                console.log(orderGoods)
                uni.request({
                    url:"http://rhymin.cn:3000/addOrder",
                    method:"post",
                    data: {
                        userId:this.userId,
                        orderGoods,
                        discountPrice:'50%',
                        payPrice:this.priceSum,
                        payStyle:'微信支付',
                        getWay:"自取",
                        storeId:1,
                        payState:'进行中'
                    },
                    success: (res) => {
                        console.log(res)
                        console.log(res.statusCode=='200')
                        if (res.statusCode=='200'){
                            uni.switchTab({
                                url:'/pages/cart/cart'
                            })
                        }

                    }
                })

            },
            goPayReq(userId,shopId){
                uni.request({
                    url:"http://rhymin.cn:3000/delShopCar",
                    method:"post",
                    data: {
                        userId,
                        shopId
                    },
                    success: (res) => {
                        console.log(res)
                    }
                })
            },
            closePayType(){
                this.$refs.popup.close()
            },
            openPayType(){
                this.$refs.popup.open()
            },
            closeBeizhu(e){
                console.log(e)
                console.log(this.$refs)
                this.$refs.beizhu.close()
            },
            beizhu(){
                this.$refs.beizhu.open()
            },
            radioChange: function(evt) {
                console.log(evt)
                // for (let i = 0; i < this.items.length; i++) {
                //     if (this.items[i].value === evt.target.value) {
                //         this.current = i;
                //         break;
                //     }
                // }
            },
            check(num){
                this.num = num
                if(num==1){
                    uni.navigateTo({
                        url:"/pages/send/send?name="+this.city+"&page=2&type="+num
                    })
                }else if(num==2){
                    uni.navigateTo({
                        url:"/pages/send/send?page=2&type="+num
                    })
                }
            },
            chooseDiscount(){
                console.log("跳转选择优惠券")
                uni.navigateTo({
                    url: '/pages/chooseDiscount/chooseDiscount?userId='+this.userId+"&priceSum="+this.priceSum
                });
            }
        },
        onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
            // console.log(option.priceSum); //打印出上个页面传递的参数。。
            // this.priceSum=option.priceSum
            let my=this.getTime()
            // console.log(option)
            this.nowTime=my
            if(!option.type){
                uni.getStorage({
                    key:'userInfo',
                    success:res=>{
                        if(res.data){
                            this.city = res.data.city
                        }
                    }
                })
                this.address = getApp().globalData.data1
                this.distance = getApp().globalData.data2
                this.telName = getApp().globalData.data2
            }
            if(option.type==1){
                this.num = 1
                uni.getStorage({
                    key:'store',
                    success:res=>{
                        this.address = res.data.storeName
                        getApp().globalData.data1 = res.data.storeName
                    }
                })
                this.city = option.name
                this.distance = option.distance
                getApp().globalData.data2 = option.distance
            }else if(option.type==2){
                this.num = 2
                uni.getStorage({
                    key:'address',
                    success:res=>{
                        this.telName = res.data.tel + '  ' + res.data.contact
                        this.address = res.data.site + res.data.houseNum
                        getApp().globalData.data1 = this.address
                        getApp().globalData.data2 = this.telName
                    }
                })
            }
        },
        created() {
            console.log("pay被创造了")
            console.log(getApp().globalData)
            this.shop=getApp().globalData.myShop
            this.userId=this.shop[0].userId
            uni.request({
                url:"http://rhymin.cn:3000/getDiscount",
                method:"post",
                data: {
                    userId:1
                },
                success: (res) => {
                    console.log(res.data.result)
                    if (this.priceSum>100){
                        this.discount=res.data.result
                    }else if(this.priceSum>30){
                        this.discount=res.data.result.filter(item=>item.dType=="5.0折"||item.dType=="满三十减")
                    }else {
                        this.discount=res.data.result.filter(item=>item.dType=="5.0折")
                    }
                    console.log(this.discount)
                }
            })
        }
    }
</script>

<style scoped lang="less">
    #pay{
        height: 200px;
        .mydiscount{
            padding: 10px;
        }
    }
    .chooseBeizhu{
        border: 1px solid #b94eff;
        color: #b94eff;
    }
    #beizhu{
        height: 400px;
        font-size: 18px;
        >view{
            >view{
                padding: 10px 0 10px 20px;
                >text:nth-child(2){
                    margin: 0 10px;
                    background-color: #eeeeee;
                    padding: 5px 10px;
                    border-radius: 20px;
                    font-size: 14px;
                }
                >text:nth-child(3){
                    background-color: #eeeeee;
                    padding: 5px 10px;
                    border-radius: 20px;
                    font-size: 14px;
                }
            }
        }
    }
    #pay,#beizhu{
        background-color: white;

    }
    .mydiscount{
        display: flex;
        justify-content: space-between;
    }
    #myOrder{
        background-color: #F1F5F0;
        padding: 0 10px;
        font-size: 12px;
        .mycolor{
            width: 95%;
            margin:auto;
            /*border: 1px solid red;*/
            background-color: white;
            margin-bottom: 10px;
            padding: 5px;
        }
    }
    .uni-list-cell {
        flex-direction: column;
        view{
            margin-right: 10px;
        }
    }
    .myshop{
        display:flex;
        justify-content: space-around;
        align-items: center;
        margin: 10px 0;
    }
    .standard{
        display: flex;
        flex-direction: column;
        justify-content: space-around;
    }
    #checkedBox{
        width: 160rpx;
        display: flex;
        justify-content: space-between;
        padding: 6rpx 10rpx 6rpx 10rpx;
        border-radius:14rpx;
        background-color: skyblue;
        view{
            width: 48%;
            padding: 6rpx 10rpx 6rpx 10rpx;
            font-size: 12px;
            text-align: center;
        }
    }
    .checked{
        background-color:white;
        border-radius:14rpx;
    }
    #address{
        width: 95%;
        margin:auto;
        display: flex;
        justify-content: space-between;
        padding:30rpx 8rpx 30rpx 8rpx;
        img{
            width: 50rpx;
            height: 50rpx;
        }
        view:nth-of-type(1){
            display: flex;
            flex-direction: column;
            text{
                font-size:12px;
            }
        }
    }
</style>