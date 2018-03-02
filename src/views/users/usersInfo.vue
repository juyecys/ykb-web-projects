<template>
  <div class="usersInfo">
    <operationBtn :btns="btns"></operationBtn>
    <modal :show.sync="showModal" title="查询用户信息" @makesure="inquiryUserInfo" @cancel="cancel" id="showModal">
      <div class="inquiryContainer">
        <div class="usersInquiryItem">
          <span>省份</span>
          <input type="text" v-model="province">
        </div>
        <div class="usersInquiryItem">
          <span>城市</span>
          <input type="text" v-model="city">
        </div>
        <div class="usersInquiryItem">
          <span>渠道分组名称</span>
          <div class="searchInputCon">
            <search-input :value.sync="channelGroup" :searchData="channelGroupList" :onlySelect="true"></search-input>
          </div>
        </div>
        <div class="usersInquiryItem">
          <span>渠道名称</span>
          <div class="searchInputCon">
            <search-input :value.sync="channelName" :searchData="channelList" :onlySelect="true"></search-input>
          </div>
        </div>
        <div class="usersInquiryItem">
          <span>关注时间</span>
          <div class="searchInputCon" style="display:flex;align-items: center;text-align: center;">
            <div class="datePicker">
              <v-date-picker
                mode='single'
                drag-color='#9fcfdf'
                :show-caps=true
                :is-expanded=true
                popover-visibility="focus"
                input-placeholder="选择日期"
                v-model='startDate'>
                <input type="text" class="picker" id="startDateYMD" v-model="startDateYMD" placeholder="选择日期" >
              </v-date-picker>
              <img src="../../../static/images/close.png" alt="" @click="cleanDate(0)">
            </div>
            <div style="text-align: center;width:100px;" >至</div>
            <div class="datePicker">
              <v-date-picker
                mode='single'
                drag-color='#9fcfdf'
                :show-caps=true
                :is-expanded=true
                popover-visibility="focus"
                input-placeholder="选择日期"
                v-model='endDate'>
                <input type="text" class="picker" id="endDateYMD" v-model="endDateYMD" placeholder="选择日期" >
              </v-date-picker>
              <img src="../../../static/images/close.png" alt="" @click="cleanDate(1)">
            </div>
          </div>
        </div>
      </div>
    </modal>
    <itable
      :ths="['openid','省份','城市','微信名称','关注时间','关注渠道','渠道分组']"
      :tds="['open_id','province','city','nick_name','subscribe_time','channels','channel_group_name']"
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
  import searchInput from '../../components/searchInput'
  import operationBtn from '../../components/operationBtn'
  import modal from '../../components/modal'
  import itable from '../../components/itable'
  import maskLayer from '../../components/maskLayer'
  export default {
    name:'usersInfo',
    components:{
      operationBtn,modal,itable,searchInput
    },
    mounted(){
      this.$store.dispatch('getUsers',{pageSize:10,nowPage:1})
      this.$store.dispatch('getAllChannelGroup')
      this.$store.dispatch('getAllChannel')
    },
    data(){
      return {
        province:'',
        city:'',
        channelGroup:'',
        channelName:'',
        dateObj:null,
        startDate:'',
        endDate:'',
        showModal:false,
        btns:[{
          name:'查询',
          event:this.toInquiryUserInfo,
          style:'successBtn'
        },{
          name:'查询全部',
          event:this.toInquiryAllUserInfo
        }],
        isQuery:false,
        queryData:{}
      }
    },
    computed:{
      endDateYMD(){
        if(this.endDate !== ''){
          let D = new Date(this.endDate)
          return D.getFullYear()+'-'+(D.getMonth()>=9?(D.getMonth()+1):'0'+(D.getMonth()+1))+'-'+(D.getDate()>9?D.getDate():'0'+D.getDate())
        }else{
          return ''
        }
      },
      startDateYMD(){
        if(this.startDate !== ''){
          let D = new Date(this.startDate)
          return D.getFullYear()+'-'+(D.getMonth()>=9?(D.getMonth()+1):'0'+(D.getMonth()+1))+'-'+(D.getDate()>9?D.getDate():'0'+D.getDate())
        }else{
          return ''
        }
      },
      channelGroupList(){
        return this.$store.state.allChannelGroupList.map((item)=>{
          return item.name
        })
      },
      channelList(){
        return this.$store.state.allChannelList.map((item)=>{
          return item.channels
        })
      },
      usersResults(){
        return this.$store.state.usersInfos.usersResults
      },
      usersPageInfo(){
        return this.$store.state.usersInfos.usersPageInfo
      },
      searchDate(){
        if(this.dateObj === null) {
          return null
        }
        return new Date(this.dateObj.start).toLocaleDateString() + '  至  ' + new Date(this.dateObj.end).toLocaleDateString()
      }
    },
    methods:{
      toInquiryAllUserInfo(){
        this.isQuery = false
        this.queryData = {}
        this.$store.dispatch('getUsers',{pageSize:10,nowPage:1})
      },
      changePageSize(size){
        console.log(size)
        if(!this.isQuery){
          this.$store.dispatch('getUsers',{nowPage:this.usersPageInfo.nowPage,pageSize:size})
        }else{
          this.queryData.nowPage = this.usersPageInfo.nowPage
          this.queryData.pageSize = size
          this.$store.dispatch('searchUser',this.queryData)
        }

      },
      toNextPage(nextPage){
        console.log(nextPage)
        if(!this.isQuery){
          this.$store.dispatch('getUsers',{nowPage:nextPage,pageSize:this.usersPageInfo.pageSize})
        }else{
          this.queryData.nowPage = nextPage
          this.queryData.pageSize = this.usersPageInfo.pageSize
          this.$store.dispatch('searchUser',this.queryData)
        }

      },
      cleanDate(index){
        if(index === 0){
          this.startDate = ''
        }else{
          this.endDate = ''
        }
      },
      inquiryUserInfo(){
         maskLayer.hide()
        let data={}
        console.log(this.province !==null)
        if(this.province !=='' || this.city !== '' || this.channelGroup!== '' || this.channelName!=='' || this.startDateYMD !== '' || this.endDateYMD !==''){
          if(this.province !==''){
            data.province = this.province
          }
          if(this.city !==''){
            data.city = this.city
          }
          if(this.channelGroup !==''){
            data.channelGroupName = this.channelGroup
          }
          if(this.channelName !==''){
            data.channels = this.channelName
          }
          if(this.startDateYMD !==''){
            data.subscribeDateStart = this.startDateYMD + ' 00:00:00'
          }
          if(this.endDateYMD !==''){
            data.subscribeDateEnd = this.endDateYMD + ' 00:00:00'
          }
          console.log(data)
          data.nowPage = 1
          data.pageSize = 10
          this.queryData = Object.assign({},data)
          console.log(this.queryData)
          this.$store.dispatch('searchUser',data)
          this.isQuery = true
        }else{
          Toast.error({
            msg:'请选择一个搜索条件'
          })
        }
      },
      cancel(){
         maskLayer.hide()
        console.log('cancel inquiryUserInfo')
      },
      toInquiryUserInfo(){
        this.province = '' ;
        this.city =  '';
        this.channelGroup =  '';
        this.channelName = '' ;
        this.startDate =  '';
        this.endDate = '';
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
      flex-wrap:wrap;
      .usersInquiryItem{
        padding:10px 0;
        display:flex;
        justify-content:center;
        align-items:center;
        span{
          width:120px;
          margin-right:20px;
          text-align: right;
        }
        .searchInputCon{
          width:280px;
          height:32px;
        }
        input,textarea{
          width:280px;
          height:32px;
          outline:none;
          border:1px solid #ccc;
          padding:0 10px;
          border-radius:3px;
          font-size:12px;
        }
        textarea{
          height:120px;
          resize:none;
          padding:10px;
        }
      }
    }
  #startDateYMD{
    width:120px;
  }
  #endDateYMD{
    width:120px;
  }
    .datePicker{
      position:relative;
      width:330px;
      display:flex;
      img{
        width:16px;
        height:16px;
        position: absolute;
        right:8px;
        top:8px;
      }
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
