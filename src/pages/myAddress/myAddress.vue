<template>
    <view class="home">
        <view class="mineItem" v-for="item in addressList" :key="item.siteId">
            <view class="info">
                <view class="addressInfo">{{item.site }} {{item.houseNum}}</view>
                <view class="myInfo">
                    <text v-show="item.defaultSite=='是'">默认地址</text>
                    <text>{{item.label}}</text>
                    <text>{{item.contact}}</text>
                    <text>{{item.tel}}</text>
                </view>
            </view>
            <view class="edit">
            	<navigator :url="'../editAddress/editAddress?item='+ encodeURIComponent(JSON.stringify(item))">编辑</navigator> 
            </view>
        </view>
        <button class='newAddress' @click='addAddress'>新增地址</button>
    </view>
</template>

<script>
    export default {
        name: "myAddress",
        data(){
        	return{
        		addressList:[],
        		myId:''
        	}
        },
        methods:{
        	getAddressList(){
        		uni.request({
        			method:"POST",
        			url:'http://rhymin.cn:3000/getAddress',
        			data:{userId:this.myId},
        			success:res=>{
        				console.log(res.data.result)
        				this.addressList=res.data.result;
        			}
        		})
        	},
        	addAddress(){
        		if (this.myId) {
        			uni.navigateTo({
	        			url:'../addAddress/addAddress'
	        		})
        		}
        		
        	}
        },
        created(){
        	uni.getStorage({
			    key: 'userId',
			    success: res=> {
			        this.myId=res.data;
			        this.getAddressList()
			    }
			});
        },
        onShow(options){
        	console.log(456)
        	this.getAddressList()	
        },
        onBackPress(options) {  
		  console.log(options)
		},
    }
</script>

<style lang="less" scoped>
	.home{
		display: flex;
		flex-direction: column;
		width: 720rpx;
		padding:15rpx;
		padding-bottom: 60rpx;
		.home>text{
			color:grey;
		}
		.mineItem{
			display: flex;
			padding:15rpx;
			margin: 10rpx 0;
			background-color: white;
			border-radius:15rpx;
			align-items: center;
			.info{
				flex:1;
				display: flex;
				flex-direction: column;
				margin: 10rpx;
				view{
					width: 100%;
				}
				.addressInfo{
					font-size: 30rpx;
					margin-bottom: 15rpx;
					padding-left: 10rpx;
				}
				.myInfo{
					font-size: 25rpx;
					margin: 10rpx 0rpx;

				}
				.myInfo text{
					padding: 5rpx;
					margin: 5rpx 10rpx;
					color:grey;
				}
				.myInfo text:first-child{
					background-color:#999999;
					color: white;
					border-radius: 5rpx;
				}
				.myInfo text:nth-child(2){
					color:white;
					padding: 5rpx 15rpx;
					background-color: #6D87C4;
					border-radius: 5rpx;
				}
			}
			.edit{
				width:100rpx;
				color: #6D87C4;
			}
		}
		.newAddress{
			background-color: #6C87C4;
			height: 60rpx;
			border-radius: 20rpx;
			width: 700rpx;
			color: white;
			text-align: center;
			display: flex;
			position: fixed;
			bottom: 15rpx;
			left: 25rpx;
			justify-content: center;
			line-height: 60rpx;
		}
	}
</style>
<style>
page {
background-color: #F4F4F4;
}
</style>