<template>
  <div id="index">
    <div class="welcome">
      <p>欢迎进入易康保后台管理系统</p>
      <img src="static/images/123.gif" alt="">
    </div>

  </div>
</template>

<script>
  export default {
    name:'index',
    mounted(){
      this.$store.dispatch('changePathName','/首页')
    }
  }
</script>

<style lang="less" scoped>
  #index{
    .welcome{
      margin:100px auto;
      text-align: center;
      font-size:40px;
      color:#333;
      img{
        border-radius:5px;
      }
    }

  }
</style>
