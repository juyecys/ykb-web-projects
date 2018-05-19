<!--suppress ALL -->
<template>
  <div id="bdChannelGroup">
    <operation-btn :btns="btns"></operation-btn>
    <itable
      :ths="['渠道名称','渠道编码','渠道二维码','BD姓名','备注','最后修改人','最后修改时间','操作']"
      :tds="['channels','channels_code','#查看#','bd','remark','updatedBy','updatedDate','##{static/images/write.png}##']"
      :tableData="bdChannelResult.result"
      :totalPage="bdChannelResult.totalPage"
      :totalCount="bdChannelResult.totalCount"
      :nowPage="bdChannelResult.nowPage"
      :pageSize="bdChannelResult.pageSize"
      :toPagination="isToPagination"
      @pageHadChange="toNextPage"
      @tdClick="showTdValue"
      @pageSizeHadChange="changePageSize"
      @tdImgClick="operationTd"
    ></itable>
    <modal :show="showInquiryModal" @makesure="operateChannelGroup(1)" :footerBtn="inquiryOrderBtn" @cancel="cancel(1)" confirmTxt="确定" title="查询" id="showInquiryModal">
      <div class="bdChannelGroupContainer">
        <div class="channelItem">
          <span>渠道名称</span>
          <input type="text" v-model="queryForm.channels" placeholder="请输入渠道名称">
        </div>
        <div class="channelItem">
          <span>渠道编码</span>
          <input type="text" v-model="queryForm.channels_code" placeholder="请输入渠道编码">
        </div>
        <div class="channelItem">
          <span>BD姓名</span>
          <input type="text" v-model="queryForm.bd" placeholder="请输入BD姓名">
        </div>
      </div>
    </modal>

    <modal :show="showModal" @makesure="operateChannelGroup(0)" @cancel="cancel(0)" confirmTxt="确定" :title="isAdd?'新增渠道信息':'编辑渠道信息'" id="showModal">
      <div class="bdChannelGroupContainer">
        <div class="channelItem">
          <span>渠道名称</span>
          <input type="text" v-model="channelForm.channels" placeholder="请输入渠道名称">
        </div>
        <div v-if="isNullOrEmpty(channelForm.id)" class="channelItem">
          <span>渠道编码</span>
          <input type="text" v-model="channelForm.channels_code" placeholder="请输入渠道编码">
        </div>
        <div class="channelItem">
          <span>BD姓名</span>
          <input type="text" v-model="channelForm.bd" placeholder="请输入BD姓名">
        </div>
        <div class="channelItem">
          <span>备注</span>
          <textarea type="text" v-model="channelForm.remark" placeholder="请填写备注"></textarea>
        </div>

      </div>
    </modal>

    <modal :show.sync="ModalForShowTdValue" @makesure="copyQrcodeUrl(showTdIndex)" @cancel="cancel(0)" :confirmTxt="'复制二维码链接'" title="查看渠道二维码" id="ModalForShowTdValue">
      <div class="ModalForShowTdValue">
        <div class="tdValue" v-if="showTdIndex === 2">
          <img class="imgsize" :src="tdObject.qrcodeUrl" alt="">
          <div class="tips">请右键，图片另存为或者复制图片</div>
          <div class="text">
            <input type="text" :value="tdObject.qrcodeUrl" id="qrcodeUrl">
          </div>
        </div>
        <div class="tdValue" v-if="showTdIndex === 3">
          <p><span>关注渠道：</span>{{tdObject.qrcodeName}}</p>
          <p><span>关注用户数：</span>{{thisQrcodePersonalCount}}人</p>
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
  import axios from 'axios';

  export default {
    name:'channelGroup',
    components:{
      operationBtn,modal,itable,choice
    },
    mounted(){
      this.fetchList()
    },
    computed:{

    },
    data(){
      return{
        queryForm: {
          channels: '',
          channels_code: '',
          bd: ''
        },
        showTdIndex: 0,
        tdObject: {},
        ModalForShowTdValue: false,
        bdChannelResult: {},
        btns:[{
          name:'新增',
          event:this.addBdChannel
        },{
          name:'查询',
          style:'successBtn',
          event:this.inQuiryChannelGroup
        },{
          name:'查询全部',
          event:this.inQuiryAllChannel
        }],
        inquiryOrderBtn:[{
          name:'清除条件',
          event:this.cleanInquiryValue
        }],
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
        isToPagination:true,

        channelForm:{

        },
        pagination: {
          pageSize: 10,
          nowPage: 1
        }
      }
    },
    methods:{
      cleanInquiryValue() {
        this.queryForm = {}
      },
      inQuiryAllChannel() {
        this.pagination.nowPage = 1;
        this.fetchList()
      },
      fetchList(query) {
        axios.get('/ykb/mg/private/bdchannel/?page.nowPage=' + this.pagination.nowPage + '&page.pageSize='+ this.pagination.pageSize,{
          params: query
        })
            .then(res=>{
          if (res.data.code === 2000) {
              console.log(res)
              this.bdChannelResult = res.data.result;
            }else{
              toast.error({
                msg:res.data.desc
              })
            }
          })
          .catch(error=>{
              toast.error({
              msg:'系统错误，请稍后重试'
            })
          })
      },
      addBdChannel() {
        this.channelForm = {
          channels: '',
          channeld_code,
          bd:'',
        }
      },
      showTdValue(index,_index) {
        console.log(index)
        console.log(_index)

        if (_index === 2) {
          this.showTdIndex = 2
          this.$set(this.tdObject,'qrcodeUrl',this.bdChannelResult.result[index].qr_code_url)
          this.$set(this.tdObject,'qrcodeName',this.bdChannelResult.result[index].channels)
          this.ModalForShowTdValue = true;
          maskLayer.show()
        }
      },
      operationTd(index,_index){
        console.log(index)
        if (_index === 0) {
          console.log('点击了编辑')
          this.channelForm = this.bdChannelResult.result[index];
          this.showModal = true
          maskLayer.show()
        }
      },
      copyQrcodeUrl(index){
        let url = document.querySelector('#qrcodeUrl')
        url.select();
        document.execCommand("Copy");
        toast.success({
          msg:'已经复制好了二维码链接了'
        })
        maskLayer.hide()
      },
      addBdChannel(){

        this.showModal = true
        maskLayer.show()
      },
      inQuiryChannelGroup(){
        this.showInquiryModal = true
        maskLayer.show()
      },
      operateChannelGroup(code){
        console.log('operateChannelGroup',code)
        switch (code){
          case 0:
            if(this.isNullOrEmpty(this.channelForm.channels)){
              toast.error({
                msg:'请填写渠道名称'
              })
              return
            }

            if(this.isNullOrEmpty(this.channelForm.channels_code)){
              toast.error({
                msg:'请填写渠道编码'
              })
              return
            }

            if(this.isNullOrEmpty(this.channelForm.id)){
              if (document.domain.indexOf('staging') > -1) {
                this.channelForm.qr_code_url = "http://staging.chengyisheng.com.cn/ykb/wp/public/login/?ykb_url=http://staging.chengyisheng.com.cn/ykb_qianhai/index.htmlssssbuyInsurancessss"+this.channelForm.channels_code
              } else if (document.domain.indexOf('localhost') > -1) {
                this.channelForm.qr_code_url = "http://staging.chengyisheng.com.cn/ykb/wp/public/login/?ykb_url=http://staging.chengyisheng.com.cn/ykb_qianhai/index.htmlssssbuyInsurancessss"+this.channelForm.channels_code
              } else {
                this.channelForm.qr_code_url = "http://m.chengyisheng.com.cn/ykb/wp/public/login/?ykb_url=http://m.chengyisheng.com.cn/ykb_qianhai/index.htmlssssbuyInsurancessss"+this.channelForm.channels_code
              }

               // http://staging.chengyisheng.com.cn/ykb/wp/public/login/?ykb_url=http://staging.chengyisheng.com.cn/ykb_qianhai/index.html#/orderList

              this.channelForm.qr_code_url = encodeURIComponent(this.channelForm.qr_code_url);

              console.log(this.channelForm.qr_code_url)

                let link = window.location.hostname === 'm.chengyisheng.com.cn'?
                  'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7bfb03bc9c23b615&redirect_uri=' + this.channelForm.qr_code_url + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
                  :
                  'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx51e37306f30d52a9&redirect_uri=' + this.channelForm.qr_code_url + '&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect'
              this.channelForm.qr_code_url = link
            }

            axios.post('/ykb/mg/private/bdchannel/',this.channelForm)
              .then(res=>{
                console.log(res)
                if(res.data.code === 2000){
                  this.pagination.nowPage = 1;
                  this.fetchList()

                  toast.success({
                    msg:'操作成功'
                  })
                  this.cancel(0)
                }else{
                  toast.error({
                    msg:res.data.desc
                  })
                }
              })
              .catch(error=>{
                  toast.error({
                  msg:'系统错误，请稍后重试'
                })
              })
            break;
          case 1:
            this.fetchList(this.queryForm);
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
        this.showModal = false;
        this.showInquiryModal = false;
        this.ModalForShowTdValue = false;
        maskLayer.hide()
      },
      //改变页大小
      changePageSize(size){
        console.log(size)
        this.pagination.pageSize = size;
        this.pagination.nowPage = 1;
        this.fetchList()
      },
      //跳转下一页
      toNextPage(nextPage){
        console.log(nextPage)
        this.pagination.nowPage = nextPage;
        this.fetchList()
      },
    }
  }
</script>
<style lang="less" scoped>
  .imgsize{
    width: 256px;
    height:256px;
    margin: 0 auto;
    display: block;
  }
  .tips,.text{
    text-align: center;
    margin: 0 auto;
  }
  .bdChannelGroupContainer{
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
