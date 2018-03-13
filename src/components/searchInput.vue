<template>
  <div class="searchInput">
    <input type="text" :placeholder="placeholder" v-model="value" @keyup="toSearchData"  @focus="showSearchBlock" @blur="hideSearchBlock" :readonly="onlySelect" :style="{'cursor':onlySelect?'pointer':'','background':canEdit?'':'#eee'}">
    <div class="showSearchData" v-show="inputing && canEdit" :id="'id'+inputId">
      <ul>
        <li v-for="(item,index) in datas" @click="choiceThisItem(item,index)">{{item}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
  export default {
    name:'searchInput',
    data(){
      return {
        inputing:false,
        inputId:new Date().getTime()
      }
    },
    props:{
      placeholder:{
        type:String,
        default:'请选择'
      },
      value:{
        type:String,
        default:''
      },
      searchData:{
        type:Array,
        default:()=>{
          return []
        }
      },
      onlySelect:{
        type:Boolean,
        default:false
      },
      canEdit:{
        type:Boolean,
        default:true
      },
      searchkey:{
        type:String,
        default:''
      },
      searchKeyValue:{
        type:Array,
        default:()=>{
          return []
        }
      }
    },
    computed:{
      datas(){
        return this.searchData
      }
    },
    methods:{
      choiceThisItem(item,index){
        this.value = item
        this.$emit('update:searchkey',this.searchKeyValue[index])
        this.$emit('update:value',item)
        this.$emit('valueChange',item)
        this.inputing = false
      },
      hideSearchBlock(){
        if(!this.onlySelect){
          this.$emit('update:value',this.value)
          this.$emit('valueChange',this.value)
        }
        if(this.datas.length === 0){
          this.inputing = false
        }else{
          setTimeout(()=>{
            this.inputing = false
          },300)
        }
      },
      showSearchBlock(){
        if(this.canEdit){
          if(this.searchData.length >10){
            document.querySelector('#id'+this.inputId).style.overflowY = 'scroll'
          }
            setTimeout(()=>{
              this.inputing = true
          },300)
        }

      },
      toSearchData(){
        if(this.onlySelect) {
          return
        }
        let searchData = this.searchData
        this.datas.splice(0,this.datas.length)
        for(let item of searchData){
          console.log(item,item.indexOf(this.value),this.value)
          if(item.indexOf(this.value) > -1){
            this.datas.push(item)
          }
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .searchInput{
    max-width:500px;
    height:32px;
    position:relative;
    input{
      height:32px;
      border:1px solid #ccc;
      border-radius:2px;
      width:100%;
      max-width:500px;
      outline:none;
      padding:0 10px;
      box-sizing:border-box;
    }
    .showSearchData{
      width:100%;
      max-width:500px;
      max-height:300px;
      overflow-y: hidden;
      background-color: #fff;
      border:1px solid #ccc;
      border-top:none;
      position: absolute;
      z-index:10;
      box-sizing:border-box;
      padding: 0 10px;
      li{
        height:30px;
        line-height:30px;
        border-bottom:1px solid #ccc;
        cursor: pointer;
      }
      li:last-child{
        border:none
      }
    }
  }
</style>
