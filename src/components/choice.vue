<template>
  <div class="choice">
    <div class="choiceContainer" v-if="type!=='switch'">
      <label v-for="(item,index) in choiceDatas"  :for="item.value+'_'+name" :class="type+'_label'">
        <input :name="name" :type="type" :value="item.value" :id="item.value+'_'+name" :checked="item.status?'checked':''" @change="inputChange(type,index,name,item)"/>
        <i :class="type+'_i'"></i>{{item.name}}
      </label>
    </div>
    <div class="switchContainer" v-else>
      <input type="checkbox" :id="'switch_'+switchName" :name="switchName" :checked="switchBool?'checked':''" @change="switchChange" />
      <label :for="'switch_'+switchName" class="switch_label"></label>
    </div>
  </div>

</template>
<script>
  export default {
    name:'choice',
    props:{
      choiceDatas:{
        type:Array,
        default:()=>{
          return []
        }
      },
      type:{
        type:String,
        default:'radio'
      },
      checked:{
        type:String,
        default:''
      },
      name:{
        type:String,
        default:''
      },
      switchData:{
        type:Array,
        default:()=>{
          return []
        }
      },
      switchBool:{
        type:Boolean,
        default:false
      },
      switchName:{
        type:String,
        default:''
      },
    },
    data(){
      return{
        checkboxArr:[]
      }
    },
    methods:{
      switchChange(){
        this.$emit('choice-change-switch',!this.switchBool)
      },
      inputChange(type,index,name,item){
        if(type === 'checkbox'){
          item.status = !item.status
          this.choiceDatas.splice(index,1,item)
          this.$emit('choice-change-checkbox',this.choiceDatas)
        }else{
          let choices = this.choiceDatas.slice(0)
          for(let i=0,len=choices.length;i<len;i++){
            if(i !== index){
              choices[i].status = false
            }else{
              choices[i].status = true
            }
            this.choiceDatas.splice(i,1,choices[i])
          }
          this.$emit('choice-change',index,name,item.value)
        }

      }
    }
  }
</script>
<style lang="less" scoped>
  .switchContainer{
    input{
      display: none;
    }
    .switch_label{
      position: relative;
      cursor: pointer;
      width:80px;
      height:24px;
      border-radius:24px;
      border:1px solid green;
      display: block;
    }
    .switch_label::before{
      content:"";
      position: absolute;
      width:74px;
      height:20px;
      border-radius:20px;
      top:1px;
      left:2px;
      transition:background-color .5s cubic-bezier(0,.92,.72,.93);
      background-color: #ccc;
    }
    .switch_label::after{
      content:"";
      position: absolute;
      width:20px;
      height:20px;
      border-radius:20px;
      background-color:#fff;
      border:none;
      transition:transform .5s cubic-bezier(0,.92,.72,.93);
      transform:translate(2px,1px);

    }
    input[type="checkbox"]:checked~.switch_label::after{
      transform:translate(56px,1px);

    }
    input[type="checkbox"]:checked~.switch_label::before{
      background-color: green;
    }

  }

  .choiceContainer{
    padding:5px  0;
    input{
      display: none;
    }
    label{
      position: relative;
      margin-left:40px;
      width:12px;
      height:12px;
      cursor: pointer;
    }
    .checkbox_label::before{
      content:'';
      width:12px;
      height:12px;
      border:1px solid #00f;
      position: absolute;
      top:50%;
      left:-20px;
      transform:translate(0,-50%);
    }
    .radio_label::before{
      content:'';
      width:12px;
      height:12px;
      border-radius:100%;
      border:1px solid #5cb85c;
      position: absolute;
      top:50%;
      left:-20px;
      transform:translate(0,-50%);
    }
    .radio_i{
      background: #5cb85c;
      width:6px;
      height:6px;
      border-radius:100%;
      position: absolute;
      top:50%;
      left:-16px;
      transform:translate(0,-50%);
      display: none;
    }
    .checkbox_i{
      background: #00f;
      width:10px;
      height:10px;
      position: absolute;
      top:50%;
      left:-18px;
      transform:translate(0,-50%);
      opacity:0;
      transition:opacity .5s ease;
    }
    input[type="radio"]:checked~ .radio_i{
      display: inline-block;
    }
    input[type="checkbox"]:checked~ .checkbox_i{
      opacity:1;
    }
  }
</style>
