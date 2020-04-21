<template>
  <view class="mycoupon">
    <view v-if="ifRender">
			<view class="coupon-item" v-for="(item,index) in discounAll" :key="index">
			  <view class="coupon-top">
			    <view class="coupon-left">
			      <view class="coupon-name">{{item.discountName}}</view>
			      <view class="coupon-deadline">有效期至{{item.dTime}}</view>
			    </view>
					<view v-if="item.dPrice=== null" class="coupon-right discount">{{item.dType}}</view>
			    <view v-else class="coupon-right discount">{{item.dType}}{{item.dPrice}}</view>
			  </view>
			  <view class="coupon-bottom">
			    <view class="useRule">查看使用规则</view>
			    <view class="useNow" @click="gotoMenu">
			      立即使用
			    </view>
			  </view>
			</view>
		</view>
  </view>
</template>

<script>
import {getvaluefromStore} from '../../untils/cfUntil'
  export default {
    name: "mycoupon",
		data(){
			return {
				discounAll: [],
				ifRender: false
			}
		},
		methods:{
			gotoMenu(){
				console.log('立即使用')
				uni.switchTab({
					url: '../menu/menu'
				})
			}
		},
		created() {
			getvaluefromStore('userId').then(res => {
				console.log('当前登录用户的id',res)
				return new Promise((resolve,reject) => {
					uni.request({
						url: 'http://rhymin.cn:3000/getDiscount',
						method: 'POST',
						data: {
							userId: res.data
						},
						success({data}) {
							resolve(data)
						},
						fail(err) {
							reject(err)
						}
					}) 
				})
			}).then(res => {
				console.log('请求的到的结果',res)
				this.discounAll = res.result
				this.ifRender = true
			}).catch(err => {
				console.error(err)
			})
		}
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
				font-size: 40rpx;
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
