<template>
    <view class="getDiscount">
        <view>
            <text>兑换码</text>
            <input type="text" placeholder="请输入兑换码" v-model="code"/>
        </view>
        <view @click="sure">确定</view>
        <uni-popup class="mypop" ref="popup" type="center">{{tips}}</uni-popup>
    </view>
</template>
<script>
	import uniPopup from '@dcloudio/uni-ui/lib/uni-popup/uni-popup.vue'
	export default{
		name:'getDiscount',
		data(){
			return{
				code:'',//qwer：五折  asdf:5块  zxcv：20块  
				userId:'',
				tips:'',
				dType:''
			}
		},
		components: {
	        uniPopup
	    },
		methods:{
			sure(){
				if (this.code) {
					if (this.code=="qwer") {
						this.dType='5.0折'
					}else if(this.code=="asdf"){
						this.dType='满三十减'
					}else if (this.code=="zxcv") {
						this.dType='满100优惠'
					}else{
						this.tips = '您输入的兑换码无法兑换'
                        this.$refs.popup.open()
                        return;
					}
					uni.request({
						method:'POST',
						url: "http://rhymin.cn:3000/addDiscount",
						data:{userId:this.userId,dType:this.dType},
						success:res=>{
							console.log(res)
							this.tips = res.data.tips
							this.$refs.popup.open()
						}
					})

				}else{
					this.tips = '您输入的兑换码为空'
                    this.$refs.popup.open()
				}
			}
		},
		created(){
        	uni.getStorage({
			    key: 'userId',
			    success: res=> {
			        this.userId=res.data;
			    }
			});
        },

	}
</script>
<style lang="less" scoped>
	.getDiscount{
		display: flex;
		flex-direction: column;
		width: 700rpx;
		padding: 25rpx;
		justify-content: center;
		view:first-of-type{
			display: flex;
			flex-direction: row;
			background-color: white;
			margin: 30rpx;
			align-items: center;
			text{
				padding: 15rpx;
			}
			input{
				padding-left: 15rpx;
				flex:1;
			}
		}
		view:last-of-type{
			// width: 600rpx;
			padding: 25rpx;
			background-color: #6D87C4;
			color: white;
			border-radius: 10rpx;
			text-align: center;
		}
		.mypop{
			color: white;
		}
	}
</style>
<style>
page {
background-color: #F4F4F4;
}
</style>