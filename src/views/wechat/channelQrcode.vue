<template>
  <div id="channelQrcode">
    <operation-btn :btns="btns"></operation-btn>
    <modal :show="showModal" @makesure="addChannel" @cancel="cancel" title="新增渠道二维码" id="showModal">
      <div class="channelInput">
        <div class="channelItem">
          <span>推广渠道</span>
          <input type="text" v-model="channelName" placeholder="请输入推广渠道">
        </div>
        <div class="channelItem">
          <span>渠道编码</span>
          <input type="text" v-model="channelCode" placeholder="渠道编码只能是数字/大小写字母/_/-">
        </div>
      </div>
    </modal>
    <modal :show.sync="showInquiryModal" @makesure="makesure1" @cancel="cancel" title="查询渠道二维码" id="showInquiryModal">
      <div class="channelInput">
        <div class="channelItem">
          <span>推广渠道</span>
          <input type="text" v-model="inquiryChannelName" placeholder="请输入推广渠道">
        </div>
        <div class="channelItem">
          <span>渠道编码</span>
          <input type="text" v-model="inquiryChannelCode" placeholder="渠道编码只能是数字/大小写字母/_/-">
        </div>
      </div>
    </modal>
    <modal :show.sync="ModalForShowTdValue" @makesure="copyQrcodeUrl(showTdIndex)" @cancel="cancel" :confirmTxt="showTdIndex === 2?'复制二维码链接':'好的'" :title="tdTitle" id="ModalForShowTdValue">
      <div class="ModalForShowTdValue">
        <div class="tdValue" v-if="showTdIndex === 2">
          <img :src="tdObject.qrcodeUrl" alt="">
          <input type="text" :value="tdObject.qrcodeUrl" id="qrcodeUrl">
        </div>
        <div class="tdValue" v-if="showTdIndex === 3">
          <p><span>关注渠道：</span>{{tdObject.qrcodeName}}</p>
          <p><span>关注用户数：</span>{{tdObject.qrcodeCount}}人</p>
        </div>
      </div>
    </modal>
    <!--二维码信息-->
    <itable
      :ths="['渠道编码','渠道名','渠道二维码','关注用户数','渠道分组','最后修改人','最后修改时间']"
      :tds="['scene','channels','#查看#','#查看#','#暂无#','updatedBy','updatedDate']"
      :tableData="qrcodeResults"
      :totalPage="qrcodePageInfo.totalPage"
      :totalCount="qrcodePageInfo.totalCount"
      :nowPage="qrcodePageInfo.nowPage"
      :pageSize="qrcodePageInfo.pageSize"
      @pageHadChange="toNextPage"
      @pageSizeHadChange="changePageSize"
      @tdClick="showTdValue"
      @tdImgClick="operationTd"
    ></itable>
  </div>
</template>
<script>
  import operationBtn from '../../components/operationBtn'
  import modal from '../../components/modal'
  import itable from '../../components/itable'
  import Toast from '../../components/toast'
  import maskLayer from '../../components/maskLayer'
  export default {
    name:'channelQrcode',
    components:{
      operationBtn,modal,itable
    },
    mounted(){
      if(this.$store.state.qrcodeInfos.qrcodePageInfo.nowPage !== 1){
        this.$store.dispatch('getChannels',{nowPage:1,pageSize:10})
      }
    },
    computed:{
      qrcodeResults(){
        return this.$store.state.qrcodeInfos.qrcodeResults
      },
      qrcodePageInfo(){
        return this.$store.state.qrcodeInfos.qrcodePageInfo
      }
    },
    data(){
      return {
        ModalForShowTdValue:false,
        tdTitle:"",
        showTdIndex:0,
        tdObject:{
          qrcodeUrl:'',
          qrcodeName:'',
          qrcodeCount:0
        },
        inquiryChannelName:'',
        inquiryChannelCode:'',
        channelName:'',
        channelCode:'',
        showInquiryModal:false,
        showModal:false,
        showModal2:false,
        inputValue:'',
        btns:[{
          name:'新增',
          event:this.addEvent
        }]
      }
    },
    methods:{
      operationTd(index){
        console.log(index,'operationTd')
      },
      copyQrcodeUrl(index){
        if(index === 2){
          let url = document.querySelector('#qrcodeUrl')
          url.select();
          document.execCommand("Copy");
          Toast.success({
            msg:'已经复制好了二维码链接了'
          })
        }
        maskLayer.hide()
      },
      showTdValue(index,_index){
        if(_index === 2){
          this.showTdIndex = 2
          console.log(this.qrcodeResults[index].qrCodeUrl)
          this.$set(this.tdObject,'qrcodeUrl',this.qrcodeResults[index].qrCodeUrl)
          this.$set(this.tdObject,'qrcodeName',this.qrcodeResults[index].channels)
          this.$set(this.tdObject,'qrcodeCount',this.qrcodeResults[index].scanTime)
          this.tdTitle = '查看渠道二维码'
          this.ModalForShowTdValue = true
          maskLayer.show()
        }else if(_index === 3){
          this.showTdIndex = 3
          this.$set(this.tdObject,'qrcodeUrl','')
          this.$set(this.tdObject,'qrcodeName',this.qrcodeResults[index].channels)
          this.$set(this.tdObject,'qrcodeCount',this.qrcodeResults[index].scanTime)
          this.tdTitle = '查看关注用户数'
          this.ModalForShowTdValue = true
          maskLayer.show()
        }
      },
      changePageSize(size){
        console.log(size)
        this.$store.dispatch('getChannels',{pageSize:size,nowPage:1})
      },
      toNextPage(nextPage){
        console.log(nextPage)
        this.$store.dispatch('getChannels',{pageSize:this.qrcodePageInfo.pageSize,nowPage:nextPage})
      },
      addEvent(){
        console.log('add')
        maskLayer.show()
        this.showModal = true
      },
      inquiryEvent(){
        console.log('inquiry')
        maskLayer.show()
        this.showInquiryModal = true
      },
      secondModal(){
        this.showModal2 = true
      },
      deleteEvent(){
        console.log('delete')
      },
      addChannel(){
        let self = this,
            channelName = self.channelName,
            channelCode = self.channelCode
        console.log(channelName,channelCode)
        if(channelName!=='' && channelCode!==''){
          if(/[^0-9a-zA-Z_-]/.test(channelCode)){
            Toast.error({
              msg:'渠道编码只能是数字或大小写字母或下划线_或破折号-'
            })
            return
          }
          console.log(123)
          self.$store.dispatch('addChannel',{name:channelName,code:channelCode})
          this.showModal = false
          maskLayer.hide()
        }else{
          Toast.error({
            msg:'请输入完整的信息'
          })
        }
      },
      makesure(id){
        maskLayer.hide()
        console.log('sure modal',id)
      },
      cancel(id){
        this.showModal = false
        maskLayer.hide()
        console.log('sure cancel',id)
      },
      makesure1(id){
        maskLayer.hide()
        console.log('sure modal1----',id)
      }
    }
  }
</script>
<style lang="less" scoped>
  #channelQrcode{
    .channelInput{
      width:100%;
      text-align:center;
      .channelItem{
        margin:20px 0;
        span{
          font-size:14px;
          margin-right:10px;
        }
        input{
          width:300px;
          height:36px;
          line-height:36px;
          outline:none;
          border-radius:2px;
          border:none;
          border:1px solid #ccc;
          padding: 0 10px;
        }
      }
    }
    .ModalForShowTdValue{
      text-align:left;

      .tdValue{
        text-align: center;
        img{
          width:250px;
          height:250px;
        }
        input{
          opacity:0;
          display: block;
        }
        p{
          word-break: break-all;
          word-wrap: break-word;
          margin:10px 0;
          text-align: left;
          display:flex;
          span{
            width:120px;
            text-align: left;
          }
        }

      }
    }
  }
</style>
