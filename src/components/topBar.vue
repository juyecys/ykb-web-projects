<template>
  <div id="topBar">
    <div class="menuBtn" @click="changeMenuStyle">
      <img src="../../static/images/menu.png" alt="" >
    </div>
    <div class="pathName">
      {{pathname}}
    </div>
  </div>
</template>
<script>
  export default {
    name:'topBar',
    data(){
      return {

      }
    },
    computed:{
      pathname(){
        return this.$store.state.pathName
      },
      miniMenu(){
        return this.$store.state.miniMenu
      }
    },
    methods:{
      changeMenuStyle(){
        let menuBtn = document.querySelector('.menuBtn img')
        menuBtn.style.transform = "rotate("+(this.miniMenu?0:90)+"deg)"
        this.$store.dispatch('changeMiniMenu')
      }
    }

  }
</script>
<style lang="less" scoped>
  #topBar{
    height:50px;
    width:100%;
    border-bottom:1px solid #f4f4f4;
    background-color:#fff;
    position:fixed;
    top:0;
    box-shadow:0 1px 10px #999;
    z-index:90;
    .menuBtn{
      width:32px;
      height:32px;
      float:left;
      margin-top:10px;
      padding:0 0 0 12px;
      cursor:pointer;

      img{
        width:32px;
        height:32px;
        transition:transform .5s ease;
      }
    }
    .pathName{
      background: #fff;
      min-width:200px;
      float:left;
      margin-top:15px;
      color:#999;
      padding:0 24px;
    }
  }
</style>
