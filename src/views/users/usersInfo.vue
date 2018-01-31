<template>
  <div class="usersInfo">
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
    <itable
      :ths="['名称','openId','二维码编码','创建日期']"
      :tds="['name','openId','qrCodeScene','createdDate']"
      :tableData="usersResults"
      :totalPage="usersPageInfo.totalPage"
      :totalCount="usersPageInfo.totalCount"
      :nowPage="usersPageInfo.nowPage"
      :pageSize="usersPageInfo.pageSize"
      @pageHadChange="toNextPage"
      @pageSizeHadChange="changePageSize"
    ></itable>
  </div>
</template>
<script>
  import operationBtn from '../../components/operationBtn'
  import modal from '../../components/modal'
  import itable from '../../components/itable'
  import maskLayer from '../../components/maskLayer'
  export default {
    name:'usersInfo',
    components:{
      operationBtn,modal,itable
    },
    mounted(){
      this.$store.dispatch('getUsers',{pageSize:10,nowPage:1})
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
      usersResults(){
        return this.$store.state.usersInfos.usersResults
      },
      usersPageInfo(){
        return this.$store.state.usersInfos.usersPageInfo
      },
      dateValue(){
        if(this.dateObj === null) {
          return null
        }
        return new Date(this.dateObj.start).toLocaleDateString() + '  至  ' + new Date(this.dateObj.end).toLocaleDateString()
      }
    },
    methods:{
      changePageSize(size){
        console.log(size)
        this.$store.dispatch('getUsers',{nowPage:this.usersPageInfo.nowPage,pageSize:size})
      },
      toNextPage(nextPage){
        console.log(nextPage)
        this.$store.dispatch('getUsers',{nowPage:nextPage,pageSize:this.usersPageInfo.pageSize})
      },
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
  .usersInfo{
    box-sizing:border-box;
    table{
      clear:both;
      width:100%;
      cursor:pointer;
      border-collapse:collapse;
      th{
        width:33.33%;
        background: #fff;
      }
      tr{
        width:100%;
        height:32px;
        line-height:32px;

        td{
          padding:5px 0;
        }
      }
      tr:nth-child(odd){
        background: #eee;
      }
      tr:hover{
        background: #ddd;
      }
    }
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
