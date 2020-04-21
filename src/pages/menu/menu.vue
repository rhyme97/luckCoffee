<template>
    <view>
        <view>
            <view id="box">
                <swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration" :circular="true" >
                        <swiper-item>
                            <view class="swiper-item uni-bg-red">
                            	<img class="img" :src="ip+'/images/xuanchuan.jpg'" alt="">
                            </view>
                        </swiper-item>
                        <swiper-item>
                            <view class="swiper-item uni-bg-green">
                            	<img class="img" :src="ip+'/images/xuanchuan2.jpg'" alt="">
                            </view>
                        </swiper-item>
                        <swiper-item>
                            <view class="swiper-item uni-bg-blue">
                            	<img class="img" :src="ip+'/images/xuanchuan3.jpg'" alt="">
                            </view>
                        </swiper-item>
                        <swiper-item>
                            <view class="swiper-item uni-bg-blue">
                            	<img class="img" :src="ip+'/images/xuanchuan4.jpg'" alt="">
                            </view>
                        </swiper-item>
               	</swiper>
            </view>
        </view>
       	<view id="address">
       		<view @click="toaddress">
       			<img src="../../static/icon/1.png" alt="">
       			<view id="addressBox" v-if="num==1">
       				<text>{{address}}</text>
       				<text>{{distance?'距离您'+distance+'m':city}}</text>
       			</view>
       			<view id="addressBox" v-else>
       				<text>{{address}}</text>
       				<text>{{telName?telName:city}}</text>
       			</view>
       		</view>
       		<view id="checkedBox">
       			<view :class="num==1?'checked':''" @click="check(1)">自提</view>
       			<view :class="num==2?'checked':''" @click="check(2)">外送</view>
       		</view>
       	</view>
       	<view id="backC">
       		<view id="main">
			<view class='productNav'>
				<view class='left'>
					<view v-for="(item,index) in tabData" :class="active==index?'selected':'normal'" @click='switchNav({index:index,id:"id"+index})' :key="index" >{{item.type}}</view>
				</view>
				<scroll-view class="right" :scroll-y="true" :scroll-into-view="intoid" @scroll="scroll">
					<view class="item" v-for="(item1,index) in tabData" :key="index" :id="'id'+index">
						<text class="typename">{{item1.type}}</text>
						<view v-for="(item,index1) in caidanData" :key="index1" v-if="item1.type==item.type&&item.stype=='null'" class="sitem" @click="buy(item)">
							<img mode="aspectFill" :src="item.imgsrc" alt="">
							<view class="sbox">
								<text class="name">{{item.name}}</text>
								<text>{{item.ename}}</text>	
								<text>默认：大/{{item.defaultMilk}}/{{item.defaultSugar}}/{{item.defaultTemperature}}</text>
								<text id="price">￥{{item.price}}</text>
							</view>
						</view>
						<view v-for="(sitem,sindex) in sType" :key="sindex" v-if="sitem.id==index">
								<text class="stext">{{sitem.stype}}</text>
								<view v-for="(item,index1) in caidanData" :key="index1" v-if="item1.type==item.type&&sitem.stype==item.stype">
									<view class="sitem" @click="buy(item)">
									<img mode="aspectFill" :src="item.imgsrc" alt="">
									<view class="sbox">
										<text class="name">{{item.name}}</text>
										<text>{{item.ename}}</text>
										<text>默认：大/{{item.defaultMilk}}/{{item.defaultSugar}}/{{item.defaultTemperature}}</text>
										<text id="price">￥{{item.price}}</text>
									</view>
									</view>
								</view>
						</view>
					</view>
				</scroll-view>
			</view>
       	</view>
       	</view>
    </view>
</template>

<script>
	import {changeData} from '../../untils/cfUntil'
    export default {
        name: "menu",
        data() {
        	return {
            	indicatorDots: true,
            	autoplay: true,
            	interval: 5000,
            	duration: 1000,
            	ip:'http://rhymin.cn:3000',
            	address:'',
            	num:1,
            	active:0,
    			currentTab:0,
    			tabData:[],
    			caidanData:[],
    			sType:[],
    			intoid:'',
    			distance:0,
    			city:'',
    			telName:''
        	}
    	},
        created(){
        	uni.request({
        		url:this.ip+'/getGoodsInfo',
        		method:'get',
        		success:res=>{
        			// console.log(res.data.data)
        			this.tabData = res.data.types
        			let arr = []
        			res.data.data.filter(item=>{
        				if(item.stype!='null'){
        					if(item.stype=='芝士 茶马奇多'){
        						item.stype = '芝士茶马奇多'
        					}
        					if(item.stype=='牛乳 多多'){
        						item.stype = '牛乳多多'
        					}
        					if(item.stype==' 拿铁系列'){
        						item.stype = '拿铁系列'
        					}
        					arr.push(item.stype)
        				}
        				item = changeData(item)
        			})
        			this.caidanData = res.data.data
        			arr = Array.from(new Set(arr))
        			// console.log(this.caidanData)
        			for(let i=0;i<arr.length;i++){
        				let obj = {stype:arr[i]}
        				if(i<=3){
        					obj.id = 1
        				}else if(i>3&&i<=7){
        					obj.id = 2
        				}else if(i==8){
        					obj.id = 8
        				}else if(i>8&&i<=10){
        					obj.id = 9
        				}
        				arr[i] = obj
        			}
        			this.sType = arr
        			// console.log(this.sType)
        			// console.log(this.tabData)
        		}
        	})
        },
        onLoad(options){
        	if(!options.type){
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
        	// console.log(options)
        	if(options.type==1){
        		this.num = 1
        		uni.getStorage({
        			key:'store',
        			success:res=>{
        				this.address = res.data.storeName
        				getApp().globalData.data1 = res.data.storeName
        			}
        		})
        		this.city = options.name
        		this.distance = options.distance
        		getApp().globalData.data2 = options.distance
        	}else if(options.type==2){
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
    	methods: {
    	    change1(e){
    	     	console.log(e)
    	    },
    	    change2(e){
    	     	console.log(e)
    	    },
    	    check(num){
    	     	this.num = num
    	     	if(num==1){
    	     		uni.navigateTo({
						url:"/pages/send/send?name="+this.city+"&page=1&type="+num
					})
    	     	}else if(num==2){
    	     		uni.navigateTo({
						url:"/pages/send/send?page=1&type="+num
					})
    	     	}
    	    },
			switchNav(obj){
				if(obj.id){
					this.$nextTick(()=>{
						this.intoid = obj.id
					})
					this.intoid = ''
				}
				
				if (this.currentTab == obj.index) {
					return false;
				} else {
					this.currentTab = obj.index
				}
				this.active = obj.index
			},
			buy(item){
				if(this.address){
					uni.navigateTo({
						url:'/pages/cinfo/cinfo?item='+encodeURIComponent(JSON.stringify(item))
					})
				}else{
					uni.showModal({
        				content:'请先选择地址!',
        				success:res=>{
        					if(res.confirm){
        						uni.navigateTo({
									url:"/pages/send/send?name="+this.city+"&page=1&type="+this.num
								})
        					}else if(res.cancel){

        					}
        				}
        			})
				}
				
			},
			scroll(e){
				let index = 0
				if(e.detail.scrollTop<295){
					index = 0
				}else if(e.detail.scrollTop>295&&e.detail.scrollTop<1940){
					index = 1
				}else if(e.detail.scrollTop>1940&&e.detail.scrollTop<3185){
					index = 2
				}else if(e.detail.scrollTop>3185&&e.detail.scrollTop<3326){
					index = 3
				}else if(e.detail.scrollTop>3326&&e.detail.scrollTop<3672){
					index = 4
				}else if(e.detail.scrollTop>3672&&e.detail.scrollTop<4523){
					index = 5
				}else if(e.detail.scrollTop>4523&&e.detail.scrollTop<4807){
					index = 6
				}else if(e.detail.scrollTop>4807&&e.detail.scrollTop<5193){
					index = 7
				}else if(e.detail.scrollTop>5193&&e.detail.scrollTop<5335){
					index = 8
				}else if(e.detail.scrollTop>5335&&e.detail.scrollTop<5898){
					index = 9
				}else if(e.detail.scrollTop>5898&&e.detail.scrollTop<6749){
					index = 10
				}
				this.switchNav({index:index})
			},
			toaddress(){
				if(this.num==1){
    	     		uni.navigateTo({
						url:"/pages/send/send?name="+this.city+"&page=1&type="+this.num
					})
    	     	}else if(this.num==2){
    	     		uni.navigateTo({
						url:"/pages/send/send?page=1&type="+this.num
					})
    	     	}
			}
    	}
    }
</script>

<style scoped lang="less">
	.img{
		width: 100%;
	}
	#box{
		border-radius: 16rpx;
		width: 90%;
		margin:auto;
		overflow: hidden;
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
		width: 90%;
		margin:auto;
		display: flex;
		justify-content: space-between;
		padding:30rpx 8rpx 30rpx 8rpx;
		view:nth-of-type(1){
			display: flex;
			img{
				width: 50rpx;
				height: 50rpx;
			}
			#addressBox{
				display: flex;
				flex-direction: column;
				text:nth-of-type(1){
					font-size:12px;
				}
				text:nth-of-type(2){
					font-size:9px;
				}
			}
		}
	}
	.productNav{
		display: flex;
		flex-direction: row;
		font-family: "Microsoft YaHei";
		justify-content: space-between;
	}
	.left{
		width: 25%;
		font-size: 20rpx;
		background-color: white;
		border-radius:20rpx;
	}
	.left view{
		text-align: left;
		height: 90rpx;
		line-height: 90rpx;
		padding-left:20rpx;
	}
	.selected{
		background-color: rgba(185,185,185,0.3);
		font-weight: bold;
	}
	.normal{
		border-bottom: 1px solid #f2f2f2;
	}
	#main{
		width: 90%;
		margin:auto;
	}
	#backC{
		background-color:rgba(185,185,185,0.3);
		padding-top:20rpx;
	}
	.right{
		width: 70%;
		height: 600px;
	}
	.item{
		border-radius:20rpx;
		padding:20rpx 0 20rpx 0;
		background-color:white;
		margin:10rpx 0 10rpx 0;
		.typename{
			font-size: 24rpx;
			padding:20rpx 0 20rpx 14rpx;
			font-weight: 400;
		}
	}
	.sitem{
			display: flex;
			justify-content: flex-start;
			padding:10rpx 14rpx 10rpx 14rpx;
			position:relative;
			&:after{
				content: '+';
				display: block;
				width: 50rpx;
				height: 50rpx;
				border-radius:25rpx;
				background-color:skyblue;
				position: absolute;
				text-align: center;
				right: 18rpx;
				bottom:18rpx;
			}
			img{
				width: 140rpx;
				height: 140rpx;
			}
			view{
				padding-left:16rpx;
				text:not(.name){
					font-size: 18rpx;
					color: gray;
					font-weight: 100;
					padding:5rpx 0 5rpx 0;
				}
				.name{
					font-weight: bold;
				}
				#price{
					font-size: 24rpx;
					color: red;
				}
			}
		}
	.stext{
		font-size: 16rpx;
		font-weight: 100;
		font-style: italic;
		padding-left:14rpx;
	}
	.sbox{
		display: flex;
		flex-direction: column;
	}
</style>