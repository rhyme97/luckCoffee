<template>
    <view class="detail">
        <view class="textInfo">
        	<view class="infoHead">
        		<text>{{storeInfo.storeName}}</text>
        		<image src="../../static/icon/contact.png" mode="widthFix"></image>
        	</view>
        	<view class="infoBody">
        		<text>营业时间：</text>
        		<text>{{storeInfo.timeAround}}</text>
        	</view>
        	<view class="infoBody">
        		<text>营业状态：</text>
        		<text>营业状态：  {{storeInfo.storeState}}</text>
        	</view>
        	<view class="infoBody">
        		<text>门店地址：</text>
        		<text>{{storeInfo.storeAddress}}</text>
        	</view>
        	<view class="infoBody">
        		<text>所属城市：</text>
        		<text>{{storeInfo.city}}>{{storeInfo.county}}</text>
        	</view>	
        </view>
        <view class="imgList">
        	<text>门店图片</text>
        	<view>
        		<black v-for="(item,index) in storeInfo.imgSrcs" :key="index">
        			<image :src="item" mode="aspectFill"></image>
        		</black>
        	</view>
        </view>
        <view class="storeMap">
        	<text>门店地图</text>
        	<map style="width: 100%; height: 320rpx;" :latitude="storeInfo.latitude" :longitude="storeInfo.longitude" :title="storeInfo.storeName" :markers="markers" scale="14">
                </map>
        </view>
        <view class="toDrink">
        	<text @click="toDrink">去喝一杯</text>
        </view>
    </view>
</template>

<script>
    export default {
        name: "storeDetail",
        data(){
        	return{
        		city:'',
        		distance:'',
        		storeInfo:{},
        		markers:[{
				    id: 3,
				    latitude: '',
				    longitude: '',
				    x:5,
				    y:2,
				    label: {
				        content: "天安门",
				        color: 'white',
				        bgColor: "#6D87C4",
				        padding:3,
				        textAlign:'center',
				        borderRadius:5,
				        fontSize:10
				    },
				}]
        	}
        },
        methods:{
        	toDrink(){
        		uni.reLaunch({
					url:'../menu/menu?name='+this.city+'&distance='+this.distance+'&type=1'
				})
        	}
        },
        created(){
        	uni.getStorage({
			    key: 'store',
			    success: res=> {
			    	res.data.imgSrcs=res.data.imgSrcs.split(',')
			        this.storeInfo=res.data
			        this.markers[0].latitude=res.data.latitude
			        this.markers[0].longitude=res.data.longitude
			        this.markers[0].label.content=res.data.storeName
			        console.log(this.storeInfo)
			    }
			});
        },
        onLoad(options){
        	console.log(options)
        	this.city=options.name;
        	this.distance=options.distance
        }
    }
</script>

<style lang="less" scoped>
.detail{
	display: flex;
	flex-direction: column;
	width: 710rpx;
	padding: 20rpx;
	.textInfo{
		display: flex;
		flex-direction: column;
		background-color: white;
		border-radius: 8rpx;
		padding: 15rpx;
		.infoHead{
			color: black;
			font-size: 40rpx;
			display: flex;
			align-items: center;
			text{
				flex:1;
				padding: 20rpx 10rpx;
			}
			image{
				width: 60rpx;
				margin-right: 10rpx;
			}		
		}
		.infoBody{
			display: flex;
			color: #999999;
			font-size: 26rpx;
			padding: 10rpx;
			text:first-child{
				width: 200rpx
			}
			text:last-child{
				flex:1;
			}
		}
	}
	.imgList{
		display: flex;
		flex-direction: column;
		padding: 20rpx 0rpx;
		view{
			display: flex;
			flex-direction: row;
			margin-top: 15rpx;
			justify-content: space-between;
			align-items: center;
			
			image{
				border-radius: 10rpx;
				width: 200rpx;
				height: 200rpx;
			}
		}
	}
	.storeMap{
		text{
			padding-bottom: 15rpx;
		}

	}
	.toDrink{
		position: fixed;
		bottom: 10rpx;
		width: 100%;
		left: 0rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		text{
			width: 650rpx;
			border-radius: 32rpx;
			background-color: #6D87C4;
			color: white;
			text-align: center;
			padding: 20rpx 0;
		}
	}
}
</style>
<style>
page {
background-color: #F4F4F4;
}
</style>