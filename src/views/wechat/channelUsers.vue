<template>
  <div class="channelUsers">
    <operationBtn :btns="btns"></operationBtn>
    <modal :show.sync="showModal" title="查询用户信息" @makesure="inquiryUserInfo" @cancel="cancel" id="showModal">
      <div class="inquiryContainer">
        <div class="datePicker">
          <v-date-picker
            mode='range'
            drag-color='#9fcfdf'
            :show-caps=true
            :is-expanded=true
            popover-visibility="hover"
            input-placeholder="选择日期"
            v-model='dateObj'>
            <input type="text" class="picker" v-model="dateValue" placeholder="选择日期" >
          </v-date-picker>
          <div class="closePicker" @click="cleanDate">清除</div>
        </div>
      </div>
    </modal>
  </div>
</template>
<script>
  import operationBtn from '../../components/operationBtn'
  import modal from '../../components/modal'
  import maskLayer from '../../components/maskLayer'
  export default {
    name:'channelUsers',
    components:{
      operationBtn,modal
    },
    data(){
      return {
        dateObj:null,
        showModal:false,
        btns:[{
          name:'查询',
          event:this.toInquiryUserInfo
        }]
      }
    },
    computed:{
      dateValue(){
        if(this.dateObj === null) {
          return null
        }
        return new Date(this.dateObj.start).toLocaleDateString() + '  至  ' + new Date(this.dateObj.end).toLocaleDateString()
      }
    },
    methods:{
      cleanDate(){
        this.dateObj = null
      },
      inquiryUserInfo(){
        maskLayer.hide()

      },
      cancel(){
        maskLayer.hide()
        console.log('cancel inquiryUserInfo')
      },
      toInquiryUserInfo(){
        maskLayer.show()
        this.showModal = true;
        console.log('inquiryUserInfo')
      }
    }
  }
</script>
<style lang="less" scoped>
  .channelUsers{
    box-sizing:border-box;
  .inquiryContainer{
    text-align: center;
    display: flex;
    justify-content: center;
  }
  .datePicker{
    position:relative;
    width:330px;
    display:flex;
  .picker{
    border:1px solid #007AFF;
    outline:none;
    width:250px;
    height:32px;
    padding:0 10px;
    border-radius:2px;
  }
  .closePicker{
    width:80px;
    height:32px;
    line-height:32px;
    text-align: center;
    cursor: pointer;
    border:1px solid #007AFF;
    border-left:none;
    color:#fff;
    background-color: #007AFF;
    border-radius:2px;
    margin-left:-2px;
  }
  }
  }
</style>
