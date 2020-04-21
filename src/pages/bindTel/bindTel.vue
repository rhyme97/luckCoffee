<template>
	<view>
		<!-- <view class="title">绑定电话赠送优惠券</view> -->
		<view >
			还差最后一步就注册成功了~
		</view>
		<view class="my-form">
			<view class="bind-name">
				<view>微信名称:</view>
				<view class="form-item">
					<input type="text" value="" v-model="name" disabled/>
				</view>
			</view>
			<view class="bind-name">
				<view>绑定电话:</view>
				<view  class="form-item">
					<input type="text" value="" v-model="tel"/>
				</view>
				
			</view>
			<view v-if="tel===''" style="color: red; font-size: 24rpx;text-align: center;">电话号码不能为空</view>
			<view v-if="!telok" style="color: red; font-size: 24rpx;text-align: center;">电话号码的格式错误</view>
			<view class="bind-name" @click="register">
				确认绑定
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "bindTel",
		data() {
			return {
				tel: '',
				name: '',
				sex: '',
			}
		},
		methods: {
			register() {
				console.log('register')
				if(!this.telok || this.tel==='') {
					return uni.showToast({
						title:'密码输入错误',
						icon:'none'
					})
				}
				let obj ={
					username: this.name,
					tel: this.tel,
					sex: this.sex
				}
				console.log(obj)
				new Promise((resolve) => {
					uni.request({
						url: 'http://rhymin.cn:3000/addUserData',
						data:obj,
						method:'POST',
						success(data){
							resolve(data)
						}
					})
				}).then(res=> {
					console.log('注册后的结果',res)
          uni.setStorage({
            key: 'tel',
            data: obj.tel
          })
					uni.setStorage({
						key: 'userId',
						data: res.data.userId,
						success() {
							console.log( res.data.userId,'写入成功')
							uni.switchTab({
								url:'../menu/menu'
							})
						}
					})
				})
			}
		},
		computed:{
			telok() {
				if(/^1[3456789]\d{9}$/.test(this.tel) || this.tel==='') return true
				return false
			}
		},
		onLoad(options) {
			console.log(options.data)
			this.name = JSON.parse(options.data).nickName
			this.sex = JSON.parse(options.data).gender === 2 ? '女' : '男'
		}
	}
</script>

<style scoped lang="less">
	page {
		background-color: #C0C0C0;
		.title {
			text-align: center;
			font-weight: 600;
			font-size: 40rpx;
			line-height: 50rpx;
			color: #7285BF;
		}
		.my-form {
			.bind-name {
				margin: 40rpx;
				display: flex;
				height: 80rpx;
				line-height: 80rpx;
				justify-content: space-around;
				background-color: #7285BF;
				color: white;
			
			}
			.form-item {
				// background-color: white;
				color: black;
				border-radius: 20rpx;
				overflow: hidden;
				display: flex;
				align-items: center;
				input {
					width: 100%;
					height: 80%;
					background-color: white;
					text-indent: 20rpx;
				}
			}
		}
	}
</style>
