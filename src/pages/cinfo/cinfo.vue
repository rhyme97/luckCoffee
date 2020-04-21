<template>
    <view id="box">
        <img :src="data.imgsrc" alt="">
		<view id="nameBox">
			<text>{{data.name}}</text>
			<text>{{data.ename}}</text>
		</view>
		<view id="radioBox">
			<radio-group v-if="data.temperature" @change="radio1">
				<text>温度</text>
				<label class="radio">
				<radio value="1" color="skyblue" :checked="data.defaultTemperature=='冷'"></radio>冷
				</label>
				<label class="radio">
				<radio value="2" color="skyblue" :checked="data.defaultTemperature=='热'"></radio>热
				</label>
			</radio-group>
			<radio-group v-if="data.sugar" @change="radio2">
				<text>糖</text>
				<label class="radio">
				<radio value="1" color="skyblue" :checked="data.defaultSugar=='无糖'"></radio>无糖
				</label>
				<label class="radio">
				<radio value="2" color="skyblue" :checked="data.defaultSugar=='半糖'"></radio>半塘
				</label>
				<label class="radio">
				<radio value="3" color="skyblue" :checked="data.defaultSugar=='全糖'"></radio>全糖
				</label>
			</radio-group>
			<radio-group v-if="data.milk" @change="radio3">
				<text>奶油</text>
				<label class="radio">
				<radio value="1" color="skyblue" :checked="data.defaultMilk=='默认奶油'"></radio>默认奶油
				</label>
				<label class="radio">
				<radio value="2" color="skyblue" :checked="data.defaultMilk=='半份奶'"></radio>半份奶
				</label>
				<label class="radio">
				<radio value="3" color="skyblue" :checked="data.defaultMilk=='双份奶'"></radio>双份奶
				</label>
				<label class="radio">
				<radio value="4" color="skyblue" :checked="data.defaultMilk=='无奶'"></radio>无奶油
				</label>
			</radio-group>
		</view>
		<view id="xqBox">
			<text class="xq">商品详情</text>
			<text>{{data.remark}}</text>
			<text>主要原材料：{{data.makeUp}}</text>
		</view>
		<view id="caozBox">
			<view class="caozBox">
				<text>￥{{data.price*num}}</text>
				<text>{{data.name}}￥{{data.price}}{{num!=0?'*'+num:''}}</text>
				<view>
					<button :plain="true" @click="buyta">立即购买</button>
					<button @click="tocar">加入购物车</button>
				</view>
			</view>
			<view id="numBox">
				<text class="dda" @click="dda">-</text>
				<text>{{num}}</text>
				<text class="add" @click="add">+</text>
			</view>
		</view>
    </view>
</template>
<script>
    export default {
        name: "home",
        data(){
        	return{
        		data:{},
        		num:1,
        		obj:{
        			temperature:'',
        			milk:'',
        			sugar:''
        		},
        		userId:'',
        	}
        },
        created(){
        	uni.getStorage({
        		key:'userId',
        		success:res=>{
        			this.userId = res.data
        		},
        	})
        },
        onLoad(options){
        	let obj = JSON.parse(decodeURIComponent(options.item))
        	uni.setNavigationBarTitle({
        		title:obj.name
        	})
        	console.log(obj)
        	this.data = obj
        	switch(obj.defaultMilk){
        		case '默认奶油':this.obj.milk = '1';break;
        		case '单份奶':this.obj.milk = '2';break;
        		case '双份奶':this.obj.milk = '3';break;
        		case '无奶':this.obj.milk = '4'
        	}
        	switch(obj.defaultSugar){
        		case '无糖':this.obj.sugar = '1';break;
        		case '半塘':this.obj.sugar = '2';break;
        		case '全糖':this.obj.sugar = '3';break;
        	}
        	switch(obj.defaultTemperature){
        		case '冷':this.obj.temperature = '1';break;
        		case '热':this.obj.temperature = '2'
        	}
        },
        methods:{
        	radio1(e){
        		console.log(e.detail.value)
        		this.obj.temperature = e.detail.value
        	},
        	radio2(e){
        		console.log(e.detail.value)
        		this.obj.sugar = e.detail.value
        	},
        	radio3(e){
        		console.log(e.detail.value)
        		this.obj.milk = e.detail.value
        	},
        	add(){
        		this.num++
        	},
        	dda(){
        		if(this.num>1){
        			this.num--
        		}
        	},
        	tocar(){
        		let data = {
        			standard:'',
        			goodsNum:'',
        			goodsId:'',
        			checked:1,
        			userId:this.userId
        		}
        		for(let key in this.obj){
        			if(this.obj[key]==''){
        				this.obj[key] = '0'
        			}
        			data.standard += this.obj[key]+','
        		}
        		data.standard = data.standard.substring(0,5)
        		data.goodsNum = this.num
        		data.goodsId = this.data.id
        		//192.168.1.105
        		if(this.userId!=''){
        			uni.request({
        				url:'http://rhymin.cn:3000/addShopCar',
        				method:'post',
        				data:data,
        				success:res=>{
        					console.log(res)
        					if(res.data.code == 200){
        						uni.switchTab({
        							url:'/pages/menu/menu'
        						})
        					}
        				}
        			})
        		}else{
        			uni.showModal({
        				content:'请先登录!',
        				success:function(res){
        					if(res.confirm){
        						uni.switchTab({
        							url:'/pages/mine/mine'
        						})
        					}else if(res.cancel){

        					}
        				}
        			})
        		}
        	},
        	buyta(){
        		let data = {
        			standard:'',
        			goodsNum:'',
        			goodsId:'',
        			checked:1,
        			userId:this.userId
        		}
        		for(let key in this.obj){
        			if(this.obj[key]==''){
        				this.obj[key] = '0'
        			}
        			data.standard += this.obj[key]+','
        		}
        		data.standard = data.standard.substring(0,5)
        		data.goodsNum = this.num
        		data.goodsId = this.data.id
        		if(this.userId!=''){
        			uni.request({
        				url:'http://rhymin.cn:3000/addShopCar',
        				method:'post',
        				data:data,
        				success:res1=>{
        					if(res1.data.code == 200){
        						console.log(res1.data.shopId)
        						uni.request({
        							url:'http://rhymin.cn:3000/getShopCar',
        							method:'post',
        							data:{userId:this.userId},
        							success:res2=>{
        								// console.log(res2.data.result)
        								uni.request({
        									url:'http://rhymin.cn:3000/updateShopCheck',
        									method:'post',
        									data:{
        										userId:this.userId,
        										shopId:res1.data.shopId,
        										checked:2
        									},
        									success:res3=>{
        										console.log(res3)
        										if(res3.data.tips == 'success'){
        											uni.request({
        												url:'http://rhymin.cn:3000/getShopCar',
        												method:'post',
        												data:{userId:this.userId},
        												success:res4=>{
        													res4.data.result.filter(item=>{
        														if(item.shopId == res1.data.shopId){
        															let arr = []
        															arr.push(item)
        															getApp().globalData.myShop = arr
        															uni.navigateTo({
        																url:'/pages/pay/Pay',
        															})
        														}
        													})
        												}
        											})
        										}
        									}
        								})
        								
        							}
        						})
        					}
        				}
        			})
        		}else{
        			uni.showModal({
        				content:'请先登录!',
        				success:function(res){
        					if(res.confirm){
        						uni.switchTab({
        							url:'/pages/home/home'
        						})
        					}else if(res.cancel){

        					}
        				}
        			})
        		}
        	}
        }
    }
</script>

<style scoped lang="less">
	#box{
		background-color: rgba(185,185,185,0.3);
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		img{
			width: 100%;
		}
		#nameBox{
			width: 90%;
			margin:14rpx auto;
			display: flex;
			flex-direction: column;
			background-color:white;
			padding: 12rpx 0 12rpx 14rpx;
			border-radius: 16rpx;
			text:nth-of-type(1){
				font-size: 24rpx;
				font-weight: 500;
				letter-spacing: 12rpx;
			}
			text:nth-of-type(2){
				font-size: 18rpx;
				font-weight: 100;
			}
		}
	}
	#radioBox{
		font-size: 20rpx;
		width: 90%;
		margin:14rpx auto;
		background-color:white;
		padding: 12rpx 0 12rpx 14rpx;
		border-radius: 16rpx;
		text{
			padding:0 30rpx 0 14rpx;
			display: inline-block;
			width: 60rpx;
		}
		radio-group{
			padding: 20rpx 0 20rpx 0;
			label{
				padding:0 10rpx 0 10rpx;
				radio{
					transform: scale(0.7);
				}
			}
		}
	}
	#xqBox{
		width: 90%;
		margin:14rpx auto;
		display: flex;
		flex-direction: column;
		background-color:white;
		padding: 14rpx 0 100px 14rpx;
		border-radius: 16rpx;
		.xq{
			font-size: 24rpx;
			font-weight: 300;
			padding:12rpx 0 12rpx 0;
		}
		text:not(.xq){
			font-size: 20rpx;
			font-weight: 100;
		}
	}
	#caozBox{
		width: 100%;
		background-color:white;
		position: fixed;
		bottom: 0rpx;
		left:0rpx;
		.caozBox{
			width: 90%;
			margin:20rpx auto;
			display: flex;
			flex-direction: column;
			padding:14rpx 0 14rpx 14rpx;
			text:nth-of-type(1){
				font-size: 24rpx;
				font-weight: 400;
				color:red;
			}
			text:nth-of-type(2){
				font-size: 18rpx;
				font-weight: lighter;
			}
			view{
				display: flex;
				justify-content: space-around;
				padding-top:20rpx;
				button:nth-of-type(1){
					width: 200rpx;
					border-radius:20rpx;
					height: 50rpx;
					line-height: 50rpx;
					font-size: 24rpx;
					font-weight: 100;
					border:1px solid skyblue;
				}
				button:nth-of-type(2){
					width: 200rpx;
					border-radius:20rpx;
					height: 50rpx;
					line-height: 50rpx;
					font-size: 24rpx;
					font-weight: 100;
					background-color:skyblue;
					color:white;
				}
			}
		}
		#numBox{
				display: flex;
				justify-content: space-around;
				width: 180rpx;
				height: 36rpx;
				position:absolute;
				top:40rpx;
				right: 18rpx;
				text-align: center;
				.add{
					width: 40rpx;
					height: 40rpx;
					line-height: 40rpx;
					border-radius:20rpx;
					border:1px solid skyblue;
					text-align: center;
					color:white;
					background-color:skyblue;
				}
				.dda{
					width: 40rpx;
					height: 40rpx;
					line-height: 40rpx;
					border-radius:20rpx;
					color:skyblue;
					border:1px solid skyblue;
					text-align: center;
				}
		}
		
	}
	</style>