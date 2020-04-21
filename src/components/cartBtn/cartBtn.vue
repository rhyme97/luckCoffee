<template>
  <view class="mycartBtn" :style="cartStyle">
    shoppaaaa
<!--    <image mode="scaleToFill" src="/src/static/icon/gouwuche.png"></image>-->
  </view>
</template>

<script>
  export default {
    name: "cartBtn",
    props: ['cartwidth'],
    data(){
      return {
        cartStyle: {width: '16px',height: '16px'}
      }
    },
    onload(){
      // this.cartStyle.width = this.cartwidth
    }
  }
</script>

<style scoped lang="less">
  .mycartBtn {
    width: 32rpx;
    height: 32rpx;
  }
image {
  width: 100%;
}
</style>
