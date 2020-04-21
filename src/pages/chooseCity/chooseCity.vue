<template>
    <view class="city">
        <text class="mycity">当前定位城市:{{nowCity}}</text>
        <view>
            <uni-indexed-list :options="cityList" :showSelect="false" @click="bindClick">
            </uni-indexed-list>
        </view>
    </view>
</template>
<script>
import uniIndexedList from '@dcloudio/uni-ui/lib/uni-indexed-list/uni-indexed-list.vue'
export default {
    name: "chooseCity",
    components: {
        uniIndexedList
    },
    data() {
        return {
            nowCity: '成都',
            cityList: [{
                "letter": "A",
                "data": ["鞍山"]
            }, {
                "letter": "B",
                "data": [
                    "保定",
                    "宝鸡",
                    "巴中",
                    "北京",
                    "本溪"
                ]
            }, {
                "letter": "C",
                "data": [
                    "成都",
                    "重庆",
                    "长沙",
                    "潮州",
                    "长春"
                ]
            }, {
                "letter": "D",
                "data": [
                    "大连",
                    "德阳",
                    "德州",
                    "东莞",
                    "丹阳"
                ]
            }, {
                "letter": "E",
                "data": [
                    "鄂州",
                    "恩施",
                ]
            }, {
                "letter": "F",
                "data": [
                    "佛山",
                    "阜阳",
                    "福州",
                ]
            }, {
                "letter": "G",
                "data": [
                    "赣州",
                    "广汉",
                    "广州",
                    "桂林",
                    "贵阳"
                ]
            }, {
                "letter": "H",
                "data": [
                    "哈尔滨",
                    "海口",
                    "杭州",
                    "淮安",
                    "黄山"
                ]
            }, {
                "letter": "J",
                "data": [
                    "荆州",
                    "九江"
                ]
            }, {
                "letter": "K",
                "data": [
                    "昆明"
                ]
            }, {
                "letter": "L",
                "data": [
                    "兰州",
                    "乐山",
                    "丽江"
                ]
            }, {
                "letter": "M",
                "data": [
                    "绵阳"
                ]
            }, {
                "letter": "N",
                "data": [
                    "南宁"
                ]
            }, {
                "letter": "P",
                "data": [
                    "莆田",
                    "濮阳"
                ]
            }, {
                "letter": "Q",
                "data": [
                    "秦皇岛",
                    "齐齐哈尔"
                ]
            }, {
                "letter": "S",
                "data": [
                    "上海",
                    "深圳",
                    "苏州"
                ]
            }, {
                "letter": "T",
                "data": [
                    "唐山",
                    "天津"
                ]
            }, {
                "letter": "W",
                "data": [
                    "温州",
                    "武汉"
                ]
            }, {
                "letter": "X",
                "data": [
                    "厦门",
                    "徐州"
                ]
            }, {
                "letter": "Y",
                "data": [
                    "烟台",
                    "岳阳"
                ]
            }, {
                "letter": "Z",
                "data": [
                    "中山",
                    "珠海"
                ]
            }],
            page:1
        }
    },
    methods: {
        bindClick(e) {
            console.log(e.item.name)
            uni.navigateTo({
            	url:'../send/send?name='+e.item.name+'&page='+this.page
            })
        }
    },
    created(){

    },
     onLoad(options){
        	console.log(options)
             this.page = options.page
        	if (options.name) {
               
        		this.nowCity=options.name;
        	}else {
        		this.nowCity='未知'
        	}
        	
        }
}
</script>
<style lang="less" scoped>
.city{
	display: flex;
	flex-direction: column;
	.mycity{
		height: 50rpx;
		width: 100%;
	}
	view{
		width: 100%;
		flex: 1;
	}

}
</style>