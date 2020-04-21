<template>
    <view class="index">
      <view class="blue-background"></view>
      <view class="index-banner">
        <swiper class="swiper" 
				@change="changeSwiper"
				:interval="4000"
				:indicator-dots="true"
				indicator-color="rgba(255,255,255,0.3)"
				indicator-active-color="#fff"
				easing-function="easy-in-out"
				:autoplay="true"
				circular
				>
          <swiper-item v-for="(item,index) in swiper.info" :key="index">
            <view class="swiper-item">
							<image :src="item.content" mode="widthFix"></image>
						</view>
          </swiper-item>
        </swiper>
      </view>
      <view class="index-buttons">
        <view class="index-go-order" >
          <image @click="goToOrder" src="http://39.98.226.123/rx/sp200414_092536.png" mode="widthFix"></image>
        </view>
        <view class="index-go-coupons">
          <image open-type="getUserInfo" @getuserinfo="getUserInfo" @click="goToMyCoupon" src="http://39.98.226.123/rx/sp200414_093634.png" mode="widthFix"></image>
        </view>
      </view>
<!--      新鲜事-->
      <view class="index-newest-item">
        <view class="title">
          春夏热卖
        </view>
        <view class="banner2">
        
        </view>
      </view>
<!--      热卖-->
      <view class="index-hot-sell">
        <view class="hot-sell-item" v-for="(item,index) in showArr" :key="index">
          <image mode="widthFix" :src="item.imgsrc"></image>
          <view class="item-desc">
            <view class="item-name">{{item.name}}</view>
            <view class="desc">
              <view class="price">￥{{item.price}}</view>
              <view class="mycart" :data-index="index" @click="gotoDetail(index,$event)">
								<icon class="iconfont icon-RectangleCopy"></icon>
              </view>
            </view>
          </view>
        </view>
      </view>
		<!-- <van-popup v-model="showDialog" overlay position="top" :style="{ height: '30%' }" />	 -->
		<!-- <uni-popup ref="popup" type="bottom" maskClick>底部弹出 Popup</uni-popup> -->
		</view>
</template>

<script>
  import {randomArr,createHotSell,changeData,getvaluefromStore} from '../../untils/cfUntil'
	export default {
      name: "home",
      components: {
      },
      data(){
        return {
					userId: '',
					shouquan: false,
					showDialog: false,
					promptText: '这是 prompt 文字',
          swiper: {
            info: [{
              content: 'http://rhymin.cn:3000/images/coffee3.jpg'
            }, {
              content: 'http://rhymin.cn:3000/images/coffee4.jpg'
            }, {
              content: 'http://rhymin.cn:3000/images/coffee5.jpg'
            }],
            current: 0,
            mode: 'round'
          },
          showArr:[]
        }
      },
      methods: {
				goToMyCoupon(){
					console.log('优惠券页面')
					getvaluefromStore('userId').then(res=> {
						console.log('当前登录的userid',res)
						uni.navigateTo({
							url:'../mycoupon/mycoupon'
						})
					}).catch(err => {
						uni.showToast({
							title:'您还没有绑定账号',
							icon:'none'
						})
					})
				},
        goToOrder() {
					uni.switchTab({
						url:'../menu/menu'
					})
        },
        changeSwiper(e) {
          this.current = e.detail.current
        },
				gotoDetail(index,event) {
					let obj = changeData(this.showArr[index])
					uni.navigateTo({
						url:'/pages/cinfo/cinfo?item='+encodeURIComponent(JSON.stringify(obj))
					})
				}
      },
      created(){
				// 进入页面  判断有没有userid(电话号码是否绑定)
				// 有 不显示授权按钮,可以进入优惠券页面
				// 没有 看是否是授过权 
				//授权  则不显示授权按钮,但不能进优惠券页面
				// 未授权  则显示授权按钮
				getvaluefromStore('userId').then(res => {
					console.log('usrId',res)
					this.userId = res.data
					this.shouquan = true
				}).catch(err => {
					console.log('未绑定电话,下一步判断是否受过权')
					this.getUserInfo()
				})
				// this.getUserInfo()
				// 获取最近热卖的数据
        new Promise((resolve, reject) => {
          uni.request({
            url: 'http://rhymin.cn:3000/getGoodsInfo',
            method: 'get',
            success({data}){
              resolve(data)
            },
            fail(err){
              console.log(err)
              reject(err)
            }
          })
        }).then(res => {
          randomArr(6,res.data.length).forEach(key => {
            this.showArr.push(createHotSell(key,res.data))
          })
        }).catch(err=> {
          uni.showToast({
            icon: "none",
            title: '数据获取失败'
          })
        })
      }
    }
</script>

<style scoped lang="less">
	@import url("../../static/font/cffont/iconfont.css");
.navigator-hover {
  color: red;
}
.index {
	.getinfo {
		background-color: rgba(255,255,255,0.3);
		position: fixed;
		top: 40rpx;
		left: 40rpx;		
	}
	image {
		vertical-align: middle;
	}
	background-color: #F5F5F5;
	display: flex;
	flex-wrap: wrap;
	// position: relative;
	// z-index: -2;
	justify-content: center;
	.blue-background {
		position: absolute;
		background-color: #373B8C;
		width: 100%;
		border-radius: 0 0 50% 50%;
		height: 500rpx;
		z-index: 0;
	}
	.index-banner {
		border-radius: 40rpx;
		margin: 30rpx 0;
		width: 95%;
		overflow: hidden;
		background-color: yellow;
		image {
			width: 100%;
		}
	}
	.index-buttons {
		position: relative;
		z-index: 0;
		width: 95%;
		background-color: white;
		padding: 30rpx;
		border-radius: 40rpx;
		display: flex;
		box-sizing: border-box;
		justify-content: space-between;
		view {
			background-color: #D9E1ED;
			cursor: pointer;
		}
		.index-go-order {
			width: 63%;
			image {
				width: 100%;
			}
		}
		.index-go-coupons {
			width: 35%;
			image {
				width: 100%;
			}
		}
	}
	.index-newest-item {
		padding: 20rpx 0;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: flex-start;
		.title {
			text-align: left;
			padding-left: 50rpx;
		}
	}
	.index-hot-sell {
		width: 100%;
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		.hot-sell-item {
			width: 44%;
			image {
				width: 100%;
			}
			.item-desc {
				padding: 0 40rpx;
				margin: 20rpx 0;
				box-sizing: border-box;
				// display: flex;
				// justify-content: space-between;
				// align-items: center;
				.item-name {
					font-size: 24rpx;
					line-height: 50rpx;
				}
				.desc {
					display: flex;
					justify-content: space-between;
					.price {
						font-size: 32rpx;
					}
					.mycart {
						width: 50rpx;
						height: 50rpx;
						line-height: 50rpx;
						text-align: center;
						background-color: #DA5E27;
						display: flex;
						justify-content: center;
						align-items: center;
						border-radius: 50%;
						color: white;
					}
				}
			}
		}
	}
	
}
</style>
