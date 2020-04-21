<template>
    <view id="send">
        <view class="navList">
            <text @click="storeHander" :class="selectedIndex==1?'select':''">门店自提</text>
            <text @click="homeHander" :class="selectedIndex==2?'select':''">送货上门</text>
            <text @click="luckHander" :class="selectedIndex==3?'select':''">瑞即购</text>
        </view>
        <view class="search" v-if="!listShow[1]">
            <text @click="toCityHander">{{city}} &#9660</text>
            <input type="" name="" v-model="searchInput" placeholder="输入地址寻找周边门店" @input="searchIt" />
        </view>
        <view class="store" v-if="listShow[0]">
            <view class="addressItem" v-for="item in storeList" :key="item.storeId" @click="toMenuHander(item.storeId)">
                <view class="name">
                    <text>瑞幸咖啡</text>
                    <text>{{item.storeName}}</text>
                    <text>{{distance(la,lo,item.latitude,item.longitude)}}km</text>
                </view>
                <view class="time">
                    <text>&#9770{{item.timeAround}}</text>
                </view>
                <view class="address">
                    <text>&#9672{{item.storeAddress}}</text>
                    <text @click.stop="toDetail(item.storeId)">查看详情</text>
                </view>
            </view>
            <view class="tips" v-if="!storeList.length">
                抱歉，当前城市暂无门店。
            </view>
        </view>
        <view class="home" v-if="listShow[1]">
            <view class="mineItem" v-for="item in addressList" :key="item.siteId">
                <view class="info" @click="hometoMenuHander(item.siteId)">
                    <view class="addressInfo">{{item.site }}{{item.houseNum}}</view>
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
            <view v-if="!myId" class="noLogin">
            	<image src="../../static/images/orderImage.png"></image>
                <text @click="toLogin">请完成登录</text>
            </view>
            <button class='newAddress' :disabled="!myId" @click='addAddress'>新增地址</button>
        </view>
        <view class="luck" v-if="listShow[2]">
            <image src="../../static/images/orderImage.png"></image>
            <text>暂无瑞即购，敬请期待！</text>
        </view>
    </view>
</template>

<script>
	// npx uni-dev-tools watch
    export default {
        name: "send",
        data(){
        	return{
        		city:'成都',
        		type:1,//1显示门店，2显示收货地址
        		page:1,//1跳转菜单，2跳转结算
        		listShow:[true,false,false],
        		selectedIndex:1,
        		storeList:[],
        		searchInput:'',
        		addressList:[],
        		lo:0,
        		la:0,
        		myId:''
        	}
        },
        methods:{
        	toLogin(){
        		uni.reLaunch({
					url:'../mine/mine'
				})
        	},
        	storeHander(){//选项卡
        		this.$set(this.listShow,0,true)
        		this.$set(this.listShow,1,false)
        		this.$set(this.listShow,2,false)
        		this.selectedIndex=1;
        		this.type=1
        	},
        	homeHander(){//选项卡
        		this.$set(this.listShow,0,false)
        		this.$set(this.listShow,1,true)
        		this.$set(this.listShow,2,false)
        		this.selectedIndex=2;
        		this.type=2;
        	},
        	luckHander(){//选项卡
        		this.$set(this.listShow,0,false)
        		this.$set(this.listShow,1,false)
        		this.$set(this.listShow,2,true)
        		this.selectedIndex=3;
        	},
        	distance(la1, lo1, la2, lo2) {//两个经纬度之间的距离
				  var La1 = la1 * Math.PI / 180.0;
				  var La2 = la2 * Math.PI / 180.0;
				  var La3 = La1 - La2;
				  var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
				  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
				  s = s * 6378.137;
				  s = Math.round(s * 10000) / 10000;
				  s = s.toFixed(2);
				  return s;
			},
			getList(){//请求数据
				uni.request({
	        		method:'GET',
	        		url:'http://rhymin.cn:3000/getStore',
	        		success:res=>{
	        			console.log(res.data.result)
	        			this.storeList=res.data.result
	        			this.storeList=this.storeList.filter(item=>{
	        				return item.city==this.city
	        			})
	        		}
	        	});
			},
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
			searchIt(){//搜索
				if (!this.searchInput) {
					this.getList()
				}else {
					this.storeList=this.storeList.filter(item=>{
						return item.city.indexOf(this.searchInput) > -1||item.county.indexOf(this.searchInput) > -1||item.storeName.indexOf(this.searchInput) > -1||item.storeAddress.indexOf(this.searchInput) > -1
					})
				}
				
			},
			toCityHander(){//跳转选择城市页面
				uni.navigateTo({
					url:'../chooseCity/chooseCity?name='+this.city+'&page='+this.page
				})
			},
			toMenuHander(id){//门店跳转this.type==1
				this.storeList.forEach(item=>{
					if (id==item.storeId) {
						uni.setStorage({//存入门店信息
						    key: 'store',
						    data: item,
						    success: function () {
						        console.log('success for choosing store ');
						    }
						});
						let url;
						let distance=this.distance(this.la,this.lo,item.latitude,item.longitude)
						if (this.page==1) {//跳转菜单
							url='../menu/menu?name='+this.city+'&distance='+distance+'&type='+this.type
						}else {//跳转订单结算
							url='../pay/Pay?name='+this.city+'&distance='+distance+'&type='+this.type
						}
						console.log(url)
						uni.reLaunch({
							url:url
						})
					}
				})
			},
			hometoMenuHander(id){//收货地址跳转this.type==2
				this.addressList.forEach(item=>{
					if (id==item.siteId) {
						uni.setStorage({//存入门店信息
						    key: 'address',
						    data: item,
						    success: function () {
						        console.log('success');
						    }
						});
						let url;
						if (this.page==1) {//返回菜单
							url='../menu/menu?type='+this.type
						}else {//返回订单结算
							url='../pay/Pay?type='+this.type
						}
						
						console.log(url)
						uni.reLaunch({
							url:url
						})
					}
				})
			},
			addAddress(){
        		uni.navigateTo({
        			url:'../addAddress/addAddress'
        		})
        	},
        	toDetail(id){
        		console.log(id)
        		this.storeList.forEach(item=>{
        			if (id==item.storeId) {
        				uni.setStorage({//存入门店信息
						    key: 'store',
						    data: item,
						    success: function () {
						        console.log('success for choosing store ');
						    }
						});
						let distance=this.distance(this.la,this.lo,item.latitude,item.longitude)
						let url='../storeDetail/storeDetail?name='+this.city+'&distance='+this.distance
						uni.navigateTo({
							url:url
						})
        			}
        		})
        		
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
        	this.getList()
        	uni.getLocation({
        		success:res=>{
        			console.log(res)
        			this.la=res.latitude;
        			this.lo=res.longitude;	
        		}
        	})
        },
        onLoad(options){
        	console.log(options)
        	//需要知道返回的数据给那个页面,1返回菜单，2返回订单结算
        	if (options.page) this.page=options.page;
        	//1选择门店  type==2 选择收货地址	
        	if (options.type) {
        		this.type=options.type;
        		if (this.type==1) {//显示门店信息
        			this.storeHander()
        		}else {//显示收货地址信息
        			this.homeHander()
        		}
        	}
        	//选择门店需要知道城市以及返回城市
        	if (options.type==1) this.city=options.name;	
        },
        onShow(){
        	console.log(456)
        	if (this.myId) {
        		this.getAddressList()
        	}
        	this.getList()
        }
    }
</script>

<style lang="less" scoped>
#send{
	display: flex;
	flex-direction: column;
	// padding:0 15rpx;
	view{
		width: 100%;
	}
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
			padding:15rpx 0;
			margin:10rpx 0;
			background-color: white;
			border-radius:15rpx;
			align-items: center;
			.info{
				flex:1;
				display: flex;
				flex-direction: column;
				margin: 10rpx 0;
				view{
					width: 100%;
				}
				.addressInfo{
					margin-bottom: 15rpx;
					padding-left: 10rpx;
				}
				.myInfo{
					font-size: 25rpx;
					margin: 5rpx;
				}
				.myInfo text{
					padding: 2rpx 5rpx;
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
		.noLogin{
			display: flex;
			flex-direction: column;
			align-items: center;
			padding-top: 60rpx;
			text-align:center;
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
	.store{
		display: flex;
		flex-direction: column;
		align-items: center;
		.addressItem{
			display: flex;
			flex-direction: column;
			border-radius: 10rpx;
			background-color: white;
			width: 700rpx;
			margin: 15rpx;
			padding: 10rpx;
			color: grey;
			font-size: 20rpx;
			.name{
				display: flex;
				padding: 5rpx 0;
			}
			.name text:first-child{
				background-color: #6D87C4;
				color: white;
				border-radius: 5rpx;
				font-size: 30rpx;
				padding: 3rpx 10rpx;
			}
			.name text:nth-child(2){
				flex:1;
				color: black;
				padding-left: 10rpx;
				font-size: 30rpx;
			}
			.name text:last-child{
				width: 150rpx;
				text-align:center;
			}
			.time{
				padding: 5rpx 0;
			}
			.address{
				display: flex;
				padding: 5rpx 0;
			}
			.address text:first-child{
				flex:1;
			}
			.address text:last-child{
				width: 150rpx;
				color:#6D87C4;
				text-align:center;
			}
		}
		.tips{
			position: fixed;
			top: 50%;
			// width: 100%;
			text-align:center;
			left: 0;
		}
		
	}
	.navList{
		background-color:white; 
		width: 600rpx;
		height: 65rpx;
		margin:15rpx auto;
		display: flex;
		padding: 5rpx;
		border-radius: 40rpx;
		background-color: #6D87C4;
		text{
			flex:1;
			border-radius: 32rpx;
			text-align: center;
			line-height: 65rpx;
			color: white;
		}
		.select{
			background-color: white;
			color: #6D87C4;
		}
	}
	.search{
		background-color: white;
		width: 95%;
		display: flex;
		margin: 0 auto;
		align-items: center;
		border-radius: 10rpx;
		height: 50rpx;
		text{
			// width: 130rpx;
			padding-left: 25rpx;
			padding-right: 25rpx;
			font-size: 25rpx;
			border-right: 2rpx solid grey;
		}
		input{
			flex:1;
			font-size: 25rpx;
			color:grey;
			padding-left: 25rpx;
		}
	}
	.luck{
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align:center;
	}
}
</style>
<style>
page {
background-color: #F4F4F4;
}
</style>