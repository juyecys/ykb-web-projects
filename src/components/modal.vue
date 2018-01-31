<template>
  <div class="modal" :style="{'webkit-transform':show?'translate(-50%,0%)':'translate(-50%,-200%)','width':width+'px'}" :id="id">
    <div class="modalHeader">{{title}}</div>
    <div class="modalBody">
      <slot></slot>
    </div>
    <div class="modalFooter">
      <div class="makesure" @click="makesure(id)">{{confirmTxt}}</div>
      <div class="makecancel" @click="cancel(id)" v-show="cancelShow">{{cancelTxt}}</div>
    </div>
  </div>
</template>
<script>
  export default {
    name:'modal',
    props:{
      id:{
        type:String,
        default:'id'
      },
      cancelShow:{
        type:Boolean,
        default:true
      },
      show:{
        type:Boolean,
        default:false
      },
      msg:{
        type:String,
        default:'这是测试'
      },
      confirmTxt:{
        type:String,
        default:'好的'
      },
      cancelTxt:{
        type:String,
        default:'取消'
      },
      title:{
        type:String,
        default:'这是测试'
      },
      width:{
        type:Number,
        default:500
      }
    },
    methods:{
      makesure(){
        console.log('click sure')
        this.$emit('makesure')
        this.$emit('update:show',false)
      },
      cancel(){
        console.log('click cancel')
        this.$emit('cancel')
        this.$emit('update:show',false)
      }
    }
  }
</script>
<style lang="less" scoped>
  .modal{
    position: absolute;
    min-height:120px;
    background-color: #fff;
    box-shadow:0 0 20px #333;
    left:50%;
    top:5%;
    transition: transform .5s ease;
    transform:translate(-50%,-200%);
    border-radius:5px;
    z-index:101;
    p{
      text-align: center;
      font-size:18px;
    }
    .modalHeader{
      padding:15px;
      background: #008a83;
      color:#fff;
      border-top-left-radius:4px;
      border-top-right-radius:4px;
    }
    .modalBody{
      padding:10px;
      margin-bottom:40px;
    }
    .modalFooter{
      //border-top:1px solid #eee;
      overflow:hidden;
      padding:5px 10px;
      .makesure,.makecancel{
        min-width:80px;
        padding:0 10px;
        height:32px;
        line-height:32px;
        float:right;
        margin-left:10px;
        text-align: center;
        color:#fff;
        background-color:#1296bd;
        border-radius:2px;
        cursor:pointer;
      }
      .makecancel{
        right:100px;
        background-color: palevioletred;
      }
    }

  }
</style>
