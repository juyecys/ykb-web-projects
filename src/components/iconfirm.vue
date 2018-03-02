<template>
  <div class="iconfirm" v-show="show">
    <div class="cTitle">{{title}}</div>
    <div class="cBody">
      <slot></slot>
    </div>
    <div class="cFooter">
      <div class="cancel" @click="onCancel">{{cancelTxt}}</div>
      <div class="sure" @click="onConfirm">{{confirmTxt}}</div>
    </div>
  </div>
</template>
<script>
  export default {
    name:'iconfirm',
    props:{
      show:{
        type:Boolean,
        default:false
      },
      title:{
        type:String,
        default:''
      },
      confirmTxt:{
        type:String,
        default:'确定'
      },
      cancelTxt:{
        type:String,
        default:'取消'
      },
    },
    methods:{
      onConfirm(){
        this.$emit('onConfirm')
      },
      onCancel(){
        this.$emit('onCancel')
      }
    }
  }
</script>
<style lang="less" scoped>
  .iconfirm{
    position: absolute;
    left:50%;
    top:50%;
    transform: translate(-50%,-50%);
    border:1px solid #ececec;
    min-width:300px;
    background: #fff;
    z-index:101;
    box-shadow: 0 0 20px #999;
    border-radius:5px;
    .cBody{
      text-align: center;
    }
    .cFooter{
      display: flex;
      text-align:center;
      border-top:1px solid #ececec;
      align-items:center;
      height:40px;
       .sure,.cancel{
          width:50%;
         cursor: pointer;
        }
       .sure{
         color:#007aff;
         border-right:1px solid #ececec;
       }
      .cancel{
        color:#d43f3a;
      }
    }
  }
</style>
