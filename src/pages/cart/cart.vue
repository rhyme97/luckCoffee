<template>
    <view style="padding: 5px 0 " v-if="shop.length">
        <view style="padding-bottom:5px;border-bottom: 1px solid grey">
            <text style="font-size: 20px">饮品与小食订单</text>
            <text style="margin-left:10px;font-size: 12px;background-color: rgba(255,168,50,0.52)">自提/外送</text>
        </view>
        <view id="shop">
            <view class="uni-list-cell uni-list-cell-pd" v-for="item in shop" :key="item.id">
                <view class="myshop" v-if="item.goodsNum">
                    <view v-if="item.checked==2">
                        <checkbox-group @change="checkboxChange" :data-id="item.id">
                            <checkbox :value="item.id" :checked="true" style="margin-top: 37px;"></checkbox>
                        </checkbox-group>
                    </view>
                    <view v-else-if="item.checked==1">
                        <checkbox-group @change="checkboxChange" :data-id="item.id">
                            <checkbox :value="item.id" :checked="false" style="margin-top: 37px;"></checkbox>
                        </checkbox-group>
                    </view>
                    <view style="width: 90px;height: 90px;">
                        <image style="width: 90px;height: 90px;"  mode="center" :src="item.imgsrc"></image>
                    </view>
                    <view class="standard">
                        <view style="font-size: 12px;font-weight:bolder;color: #0C0C0C">{{item.name}}</view>
                        <view style="font-size: 12px;color: grey">
                            <text >大/</text>
                            <text v-if="item.standard[2]==0">默认奶油/</text>
                            <text v-else-if="item.standard[2]==1">单份奶/</text>
                            <text v-else-if="item.standard[2]==2">双份奶/</text>
                            <text v-else-if="item.standard[2]==3">无奶油/</text>
                            <text v-if="item.standard[1]==1">无糖/</text>
                            <text v-else-if="item.standard[1]==2">半糖/</text>
                            <text v-else-if="item.standard[1]==3">全糖/</text>
                            <text v-if="item.standard[0]==1">冰</text>
                            <text v-else-if="item.standard[0]==2">热</text>
                        </view>
                        <view style="color: red">￥{{item.price}}</view>
                    </view>
                    <view style="padding-top : 50px">
                        <uni-number-box :min="0" :value="item.goodsNum" @change="changeGoodsNum"></uni-number-box>
                    </view>
                </view>
            </view>

        </view>
        <view id="sum">
            <view>
                <text>应付合计 ￥{{priceSum}}</text>
            </view>
            <view v-if="priceSum">
                <button @click="gotoPay" style="border-radius: 25px;background-color: red;color:white">去结算</button>
            </view>
            <view v-else>
                <button @click="openPopup" style="border-radius: 25px;background-color: red;color:white">去结算</button>
                <uni-popup ref="popup" type="center" >
                    <view id="tishi">
                        <view>提示</view>
                        <view>您还没有勾选商品，请勾选之后在结算！</view>
                        <button style="font-size:16px;line-height:30px;width: 100px;height: 30px" @click="closePopup">关闭</button>
                    </view>
                </uni-popup>
            </view>
        </view>
    </view>
    <view v-else>
        <text>你还没有选购</text>
    </view>
</template>

<script>
    import uniPopup from "@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue"
    import uniNumberBox from "@dcloudio/uni-ui/lib/uni-number-box/uni-number-box.vue"
    export default {
        name: "cart",
        components: {
            uniNumberBox,
            uniPopup
        },
        data(){
            return {
                shop:[],
                old: {
                    scrollTop: 0
                }
            }
        },
        computed:{
            priceSum(){
                let sum=0;
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
            openPopup(){
                this.$refs.popup.open()
            },
            closePopup(){
                this.$refs.popup.close()
            },
            gotoPay(){
                console.log("我点击了去结算")
                console.log(this.shop)

                if (this.priceSum){
                    // uni.$emit('update',{msg:this.shop})
                    getApp().globalData.myShop = this.shop.filter(item=>item.checked==2)

                    uni.navigateTo({
                        url: '/pages/pay/Pay'
                    });
                }

            },
            changeGoodsNum(value){
                console.log(value)
                // for (let i=0;i<this.shop.length;i++){
                //     if (this.shop[i].goodsNum!=value){
                //         let shopId=this.shop[i].shopId
                //         let userId=this.shop[i].userId
                //         console.log(shopId)
                //         uni.request({
                //             url:"http://rhymin.cn:3000/updateShopGoods",
                //             method:"post",
                //             data: {
                //                 count:value,
                //                 shopId,
                //                 userId
                //             },
                //             success: (res) => {
                //                 console.log(res.data.result)
                //                 // let myResult=res.data.result
                //                 // this.shop=res.data.result
                //             }
                //         })
                //     }
                // }
            },
            scroll: function(e) {
                console.log(e)
                this.old.scrollTop = e.detail.scrollTop
            },
            checkboxChange(e) {
                let items = this.shop
                console.log(e.target.dataset.id)
                let values = e.detail.value;
                for (var i = 0; i < items.length; i++) {
                    const item = items[i]
                    if(values.includes(item.id.toString())){
                        item.checked=2
                    }else {
                        if (item.id==e.target.dataset.id){
                            item.checked=1
                        }
                    }
                }
                console.log(items)
                this.shop=items
            }
        },
        created(){
            uni.request({
                url:"http://rhymin.cn:3000/getShopCar",
                method:"post",
                data: {
                    userId:1
                },
                success: (res) => {
                    console.log(res.data.result)
                    let myResult=res.data.result
                    this.shop=res.data.result
                }
            })
        }
    }
</script>

<style scoped lang="less">
    .uni-list-cell {
        flex-direction: column;
        view{
            margin-right: 10px;
        }
    }
    .myshop{
        display:flex;
        justify-content: space-between;
        align-content: center;
        margin: 10px 0;
    }
    .standard{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    #sum{
        border-top: 1px solid grey;
        display: flex;
        justify-content: space-between;
        padding: 10px;
        align-items: center;
    }
    #tishi{
        display:flex;
        flex-direction:column;
        text-align:center;
        justify-content: space-around;
        width:200px;
        height:200px;
        background-color: grey;
        color:white
    }
</style>