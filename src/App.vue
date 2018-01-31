<template>
  <div id="app">
    <div class="container" :style="{'margin-left':!shouldHide?(miniMenu?miniMenuWidth:largeMenuWidth):'0px'}">
      <top-bar v-show="!shouldHide"></top-bar>
      <div class="views">
        <router-view/>
      </div>
    </div>
    <side-bar v-show="!shouldHide"></side-bar>
  </div>
</template>

<script>
  import sideBar from './components/sideBar'
  import topBar from './components/topBar'
  import {mapState} from 'vuex'
export default {
  name: 'app',
  data(){
    return{
      shouldHide:false
    }
  },
  components:{
    sideBar,topBar
  },
  computed:mapState({
    hadLogin:'hadLogin',
    miniMenu:'miniMenu',
    miniMenuWidth:'miniMenuWidth',
    largeMenuWidth:'largeMenuWidth'
  }),
  mounted(){
    if(this.$router.history.current.name === 'login'){
      this.shouldHide = true
    }else{
      this.shouldHide = false
    }
  },
  updated(){
    if(this.$router.history.current.name === 'login'){
      this.shouldHide = true
    }else{
      this.shouldHide = false
    }
    console.log(this.$router.history.current.name)

  }
}
</script>

<style lang="less">
  @import 'assets/css/base.less';
  @import 'assets/css/mylayers.less';
#app {
  .container{
    margin:0;
    transition:margin-left .5s ease;
    .views{
      padding-top:60px;
    }
  }
}

</style>
