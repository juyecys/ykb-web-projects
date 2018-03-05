<template>
  <div id="channelGroup">
    <operation-btn :btns="btns"></operation-btn>
    <itable
      :ths="['渠道分组编码','渠道分组名','备注','最后修改人','最后修改时间','是否生效','操作']"
      :tds="['scene','name','remark','updatedBy','updatedDate','statusDesc','##{static/images/search.png,static/images/write.png}##']"
      :tableData="channelGroupResult"
      :totalPage="channelGroupPageInfo.totalPage"
      :totalCount="channelGroupPageInfo.totalCount"
      :nowPage="channelGroupPageInfo.nowPage"
      :pageSize="channelGroupPageInfo.pageSize"
      :toPagination="isToPagination"
      @pageHadChange="toNextPage"
      @pageSizeHadChange="changePageSize"
      @tdImgClick="operationTd"
    ></itable>
    <modal :show="showInquiryModal" @makesure="operateChannelGroup(1)" @cancel="cancel(1)" confirmTxt="确定" title="查询" id="showInquiryModal">
      <div class="channelGroupContainer">
        <div class="channelItem">
          <span>渠道分组名称</span>
          <input type="text" v-model="inquiryChannelGroupName" placeholder="请输入渠道分组名称">
        </div>
      </div>
    </modal>
    <modal :show="showChannelGroupListModal" @makesure="operateChannelGroup(2)" @cancel="cancel(2)" confirmTxt="确定" :title="'渠道分组名：'+channelGroupName" id="showChannelGroupListModal">
      <div class="channelGroupContainer">
        <itable
          :minTableWidth="100"
          :toPagination="false"
          :totalCount="thisChannelGroupList.length"
          :ths="['渠道名称','关注人数']"
          :tds="['channels','scan_time']"
          :tableData="thisChannelGroupList"
        ></itable>
      </div>
    </modal>
    <modal :show="showModal" @makesure="operateChannelGroup(0)" @cancel="cancel(0)" confirmTxt="确定" :title="isAdd?'新增渠道分组信息':'编辑渠道分组信息'" id="showModal">
      <div class="channelGroupContainer">
        <div class="channelItem">
          <span>渠道分组名称</span>
          <input type="text" v-model="channelGroupName" placeholder="请输入渠道分组名称">
        </div>
        <div class="channelItem">
          <span>备注</span>
          <textarea type="text" v-model="channelGroupRemark" placeholder="请填写备注"></textarea>
        </div>
        <div class="channelItem">
          <span style="line-height:2;">是否生效</span>
          <div class="choiceContainer">
            <choice @choice-change-switch="channelGroupStatusChange" type="switch" :switchBool="channelGroupStatus"></choice>
          </div>
        </div>
      </div>
    </modal>
  </div>
</template>
<script>
  import operationBtn from '../../components/operationBtn'
  import modal from '../../components/modal'
  import itable from '../../components/itable'
  import choice from '../../components/choice'
  import maskLayer from '../../components/maskLayer'
  import toast from '../../components/toast'
  export default {
    name:'channelGroup',
    components:{
      operationBtn,modal,itable,choice
    },
    mounted(){
      this.$store.dispatch('getChannelGroup',{pageSize:10,nowPage:1})
      //this.addChannelGroup()
    },
    computed:{
      channelGroupResult(){
        let data = this.$store.state.wechat.channelGroupList.result
        console.log(data)
        if(data !== undefined){
          for(let i=0,len=data.length;i<len;i++){
            if(data[i].status){
              data[i].statusDesc = '已生效'
            }else{
              data[i].statusDesc = '未生效'
            }
          }
          return data
        }else{
           return []
        }
      },
      channelGroupPageInfo(){
        return this.$store.state.wechat.channelGroupList.pageInfo
      },
      thisChannelGroupList(){
        return this.$store.state.wechat.thisChannelGroupList
      }
    },
    data(){
      return{
        btns:[{
          name:'新增',
          event:this.addChannelGroup
        }/*,{
          name:'查询',
          style:'successBtn',
          event:this.inQuiryChannelGroup
        },{
          name:'查询全部',
          event:this.inQuiryAllChannelGroup
        }*/],
        showInquiryModal:false,
        showModal:false,
        showChannelGroupListModal:false,
        inquiryChannelGroupName:'',
        channelGroupName:'',
        channelGroupRemark:'',
        channelGroupStatus:false,
        channelGroupId:'',
        channelGroupScene:'',
        isAdd:true,
        isToPagination:true
      }
    },
    methods:{
      inQuiryAllChannelGroup(){
        this.isToPagination = true
        this.$store.dispatch('getChannelGroup')
      },
      channelGroupStatusChange(bool){
        console.log(bool,'channelGroupStatusChange')
        this.channelGroupStatus = bool
      },
      operationTd(index,_index){
        console.log(index,'operationTd',_index)
        if(_index === 0){//查看这个分组下面二维码的信息
          this.showChannelGroupListModal = true
          maskLayer.show()
          this.channelGroupName = this.channelGroupResult[index].name
          this.channelGroupId = this.channelGroupResult[index].id
          this.$store.dispatch('getThisChannelGroupList',{channel_group_id:this.channelGroupId})
        }else if(_index === 1){
          this.isAdd = false
          this.channelGroupName = this.channelGroupResult[index].name
          this.channelGroupRemark = this.channelGroupResult[index].remark
          this.channelGroupStatus= this.channelGroupResult[index].status
          this.channelGroupId= this.channelGroupResult[index].id
          this.channelGroupScene= this.channelGroupResult[index].scene
          this.showModal = true
          maskLayer.show()
        }
      },
      addChannelGroup(){
        this.isAdd = true
        this.channelGroupName = ''
        this.channelGroupRemark = ''
        this.channelGroupStatus= false
        this.channelGroupId= ''
        this.channelGroupScene= ''
        this.showModal = true
        maskLayer.show()
      },
      inQuiryChannelGroup(){
        this.showInquiryModal = true
        maskLayer.show()
      },
      operateChannelGroup(code){
        //code为0的时候，isadd为true，为新增渠道分组信息，false为编辑某个渠道信息，
        //code为1的时候，是模糊查询某个渠道分组信息，
        //code为2的时候，是查询某个渠道分组下个渠道的具体信息
        console.log('operateChannelGroup',code)
        switch (code){
          case 0:
            if(this.channelGroupName !== ''){
              let data = {
                name:this.channelGroupName,
                remark:this.channelGroupRemark,
                status:this.channelGroupStatus
              }
              console.log(data)
              //return
              if(this.isAdd){
                this.$store.dispatch('addChannelGroup',data)
              }else{
                data.id = this.channelGroupId
                data.scene = this.channelGroupScene
                this.$store.dispatch('editChannelGroup',data)
              }
              this.cancel(0)
            }else{
              toast.error({
                msg:'请填写渠道分组名称'
              })
              return
            }
            break;
          case 1:
            if(this.inquiryChannelGroupName !== ''){
              console.log(this.inquiryChannelGroupName)
              this.isToPagination =false
              this.$store.dispatch('inquiryChannelGroupInfo',this.inquiryChannelGroupName)
            }else {
              toast.error({
                msg:'请填写渠道分组名称'
              })
              return
            }
            this.cancel(1)
            break;
          case 2:
            this.cancel(2)
            break;
          default:
            console.log('code is error')
        }
      },
      cancel(code){
        console.log('cancel',code)
        if(code === 0){
          this.showModal = false
        }else if(code === 1){
          this.showInquiryModal = false
        }else if(code === 2){
          this.showChannelGroupListModal = false
        }
        maskLayer.hide()
      },
      //改变页大小
      changePageSize(size){
        console.log(size)
        this.$store.dispatch('getChannelGroup',{pageSize:size,nowPage:1})
      },
      //跳转下一页
      toNextPage(nextPage){
        console.log(nextPage)
        this.$store.dispatch('getChannelGroup',{pageSize:this.channelGroupPageInfo.pageSize,nowPage:nextPage})
      },
    }
  }
</script>
<style lang="less" scoped>
  .channelGroupContainer{
    width:100%;
    text-align:center;
    .channelItem{
      margin:20px 0;
      display:flex;
      justify-content:center;
      span{
        font-size:14px;
        margin-right:20px;
        width:90px;
        height:36px;
        line-height:36px;
        text-align: right;
      }
      input,textarea{
        width:300px;
        height:36px;
        line-height:36px;
        outline:none;
        border-radius:2px;
        border:none;
        border:1px solid #ccc;
        padding: 0 10px;
      }
      textarea{
        resize: none;
        height:100px;
      }
      .choiceContainer{
        width:300px;
        text-align: left;
      }
    }
  }

</style>
