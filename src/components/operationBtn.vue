<template>
  <div class="operationBtn">
    <div  v-for="item in btns" :class="['btn',item.hasOwnProperty('style')?item.style:'normalBtn']" @click="item.event">{{item.name}}</div>
  </div>
</template>
<script>
  export default {
    name:'operationBtn',
    props:{
      btns:{
        type:Array,
        default:()=>{
          return []
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .operationBtn{
    display:flex;
    .btn{
      min-width:80px;
      height:32px;
      line-height:32px;
      border-radius:3px;
      text-align: center;
      margin:10px;
      cursor: pointer;
      color:#fff;
      border:none;
      padding:0 10px;
    }
    .normalBtn{
      background-color: #007AFF;
    }
    .successBtn{
      background-color: #5cb85c;
    }
    .dangerBtn{
      background-color: #d43f3a;
    }
  }
</style>
