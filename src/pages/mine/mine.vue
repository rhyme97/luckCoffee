<template>
	<view class="mine">
		<view class="blue-background"></view>
		<view class="mine-body">
			<view class="header">
				<view class="mine-avatar">
					<image v-if="allInfo.avatarUrl!=undefined" :src="allInfo.avatarUrl" mode="widthFix"></image>
					<image v-else src="http://39.98.226.123/rx/default.jpg" mode="widthFix"></image>
					<text>{{userId>0?allInfo.nickName:'未登录'}}</text>
				</view>
			</view>
			<view class="mine-nav">
				<view class="nav-item-wrap" @click="goToAddress">
					<view class="blue-color">{{userId>0?nav.addLen+'条': '暂无地址'}}</view>
					<view>我的地址</view>
				</view>
				<view class="nav-item-wrap" @click="goToCoupon">
					<view class="blue-color">{{userId>0?nav.couponLen+'张': '暂无优惠券'}}</view>
					<view>优惠券</view>
				</view>
        <view class="nav-item-wrap" @click="getCouponById">
					<view class="blue-color">兑换</view>
					<view>优惠券</view>
				</view>
			</view>
			<view class="detail-info" v-if="userId > 0">
				<view class="detail-title">个人信息</view>
				<view class="deteil-item">
					<text>用户名</text>
					<text>{{allInfo.nickName}}</text>
				</view>
				<view class="deteil-item">
					<text>性别</text>
					<text>{{allInfo.gender===2?'女':'男'}}</text>
				</view>
				<view class="deteil-item">
					<text>绑定手机</text>
					<text>{{telFormat(tel)}}</text>
				</view>
				<view class="deteil-item" @click="gotoAddAddress">
					<text>添加收货地址</text>
					<text>></text>
				</view>
				<view class="loginout" @click="loginout">
					退出登录
				</view>
			</view>
			<view v-else>
				<button type="default" class="login" open-type="getUserInfo" @getuserinfo="getUserInfo">点击登录</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {getvaluefromStore,request} from '../../untils/cfUntil.js'
	export default {
		data() {
			return {
				userId: -1,
				nav: {
					addLen: 0,
					couponLen: 0
				},
				allInfo: {},
				tel: ''
			}
		},
		onReady() {
			this.initProvider()
		},
		onShow(){
			console.log('show执行')
			this.show()
		},
		methods: {
			initProvider(){
				const filters = ['weixin']
				uni.getProvider({
					service: 'oauth',
					success: (res) => {
						if(res.provider && res.provider.length) {
							console.log("initProvider()",res)
						}
					}
				})
			},
			gotoAddAddress() {
				uni.navigateTo({
					url: '../addAddress/addAddress'
				})
			},
			goToAddress() {
				uni.navigateTo({
					url: '../myAddress/myAddress'
				})
			},
			goToCoupon() {
				uni.navigateTo({
					url: '../mycoupon/mycoupon'
				})
      },
      getCouponById() {
				console.log('转到兑换优惠券页面')
        uni.navigateTo({
					// priceSum 是什么东西?
        	url: '../getDiscount/getDiscount',
					fail(err) {
						console.log(err)
					}
        })
      },
			telFormat(tel) {
				let first = tel.slice(0,3)
				let second = tel.slice(3,7)
				let last = tel.slice(7,11)
				return `${first}-${second}-${last}`
			},
			async show() {
				let userId = (await new Promise(resolve => {
					uni.getStorage({
						key: 'userId',
						complete: (data) => {
							console.log('onshow() 获取userId',data)
							resolve(data)
						}
					})
				})).data
				console.log(userId)
				this.userId = userId === undefined ? -1 :userId
				// this.userId = userId
				// console.log(this.userId === undefined)
				if (this.userId === -1) {
					this.nav.addLen = 0
					this.nav.couponLen = 0,
					this.allInfo = {}
					return
				}
				let addresp = await request({ url: 'http://rhymin.cn:3000/getAddress', method: "POST", data: { userId: this.userId } })
				this.nav.addLen = addresp.data.result.length
				let couponresp = await request({ url: 'http://rhymin.cn:3000/getDiscount', method: "POST", data: { userId: this.userId } })
				this.nav.couponLen = couponresp.data.result.length
				let allInfo = await new Promise(resolve => {
					uni.getStorage({
						key: 'userInfo',
						success: ({ data }) => {
							resolve(data)
						},
						fail() {
							resolve({})
						}
					})
				})
				this.allInfo = allInfo
				let tel = await new Promise(resolve => {
					uni.getStorage({
						key: 'tel',
						success:(data) => {
							resolve(data)
						}
					})
				})
				console.log('storage 的tel',tel)
				this.tel = tel.data
			},
			async loginout() {
			  console.log('退出登录')
			  await uni.removeStorage({
			    key: 'userId'
			  })
						
			  await uni.removeStorage({
			    key: 'userInfo'
			  })
				this.allInfo = {}
				// this.userId = undefined
				await this.show()
				await uni.redirectTo({
					url: '../home/home'
				})
				uni.showToast({
					title: '期待您下次使用',
					icon:'none'
				})
			//   let pages = getCurrentPages()
				// console.log(pages)
				// let page = pages[pages.length-1]
				// page.onShow()
			},
			getUserInfo() {
			  new Promise((resolve, reject) => {
			    uni.getUserInfo({
			      lang: "zh_CN",
			      success: ({ userInfo }) => {
			        //当获取信息成功后将信息存起来
			        resolve(userInfo)
			      },
			      fail: (err) => {
			        console.log(err)
			        reject(err)
			      }
			    })
			  }).then(res => {
			    console.log('获取到的数据', res, this)
			    // 请用户输入电话号码
			    this.shouquan = true
			    uni.setStorage({
			      key: 'userInfo',
			      data: res,
			      success() {
			        // if(this.userId==='') {
			        uni.navigateTo({
			          url: '../bindTel/bindTel?data=' + JSON.stringify(res)
			        })
			      }
			    })
						
			  }).catch(err => {
			    this.shouquan = false
			  })
			},  
		
		}
	}

</script>

<style scoped lang="less">
	page {
		height: 100%;
		background-color: #F5F5F5;
	}
.mine {
	position: relative;
	.blue-background {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		background-color: #313A99;
		height: 400rpx;
		&::before,&::after {
			content: '';
			display: block;
			background-color: #43499F;
			border-radius: 50%;
			position: absolute;
		}
		&::before {
			width: 300rpx;
			height: 300rpx;
			top: -100rpx;
			left: -50rpx;
		}
		&::after {
			width: 100rpx;
			height: 100rpx;
			top: 100rpx;
			right: -30rpx;
		}
	}
	.mine-body {
		position: relative;
		z-index: 1;
		padding: 0 30rpx;
		.header {
			.mine-avatar {
				padding: 80rpx 0;
				image {
					width: 100rpx;
					height: 100rpx;
					vertical-align: middle;
					border: 2rpx solid white;
					border-radius: 50%;
				}
				text {
					margin-left: 40rpx;
					color: white;
					font-size: 40rpx;
				}
			}
		}
		.mine-nav {
			border-radius: 40rpx;
			background-color: white;
			display: flex;
			justify-content: space-between;
			padding: 40rpx;
			box-shadow: 0 10rpx 10rpx #F4F4F4;
			.nav-item-wrap {
				width: 50%;
				text-align: center;
				margin: 10rpx;
				color: #B0B0B0;
				font-size: 32rpx;
				&:nth-child(3n) {
					border-right: 2rpx solid transparent;
					padding-right: 0;
				}
				border-right: 2rpx solid #B0B0B0;
				padding-right: 40rpx;
				.blue-color {
					color: #869AC3;
					font-size: 36rpx;
				}
			}
		}
		.detail-info {
			.detail-title {
				margin: 30rpx 0;
				font-weight: 700;
			}
			.deteil-item {
				display: flex;
				justify-content: space-between;
				padding: 40rpx 0 20rpx;
				border-bottom: 1rpx solid #eee;
			}
			.loginout {
				height: 80rpx;
				line-height: 80rpx;
				background-color: #43499F;
				color: white;
				text-align: center;
				border-radius: 20rpx;	
				margin-top: 40rpx
			}
		}
		.login {
			width: 100%;
			background-color: #43499F;
			height: 80rpx;
			line-height: 80rpx;
			margin-top: 200rpx;
			color: white;
		}
	}
	
}
</style>
