<!--suppress ALL -->
<template>
  <div id="bdChannelGroup">
    <operation-btn :btns="btns"></operation-btn>
    <itable
      :ths="['微信昵称','头像','姓名','出生年月','年龄','性别','手机号码','渠道名','创建时间','关联订单号','订单状态','备注','操作']"
      :tds="['nick_name','###head_img_url###','name','birthday','age','gender','mobile','channels','createdDate','order_no','status','remark','##{static/images/write.png}##']"
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
    <modal :show="showInquiryModal" @makesure="operateChannelGroup(1)" @cancel="cancel(1)" confirmTxt="确定" title="查询" id="showInquiryModal">
      <div class="bdChannelGroupContainer">
        <div class="channelItem">
          <span>渠道名称</span>
          <input type="text" v-model="queryForm.channels" placeholder="请输入渠道名称">
        </div>
        <div class="channelItem">
          <span>BD</span>
          <input type="text" v-model="queryForm.bd" placeholder="请输入BD">
        </div>
        <div class="channelItem">
          <span>微信昵称</span>
          <input type="text" v-model="queryForm.nick_name" placeholder="请输入微信昵称">
        </div>
        <div class="channelItem">
          <span>姓名</span>
          <input type="text" v-model="queryForm.name" placeholder="请输入姓名">
        </div>
        <div class="channelItem">
          <span>手机号码</span>
          <input type="text" v-model="queryForm.mobile" placeholder="请输入手机号">
        </div>
      </div>
    </modal>

    <modal :show="showModal" @makesure="operateChannelGroup(0)" @cancel="cancel(0)" confirmTxt="确定" title="编辑用户信息" id="showModal">
      <div class="bdChannelGroupContainer">
        <div class="channelItem">
          <span>微信昵称</span>
          <input type="text" v-model="channelForm.nick_name" placeholder="请输入微信昵称">
        </div>
        <div class="channelItem">
          <span>姓名</span>
          <input type="text" v-model="channelForm.name" placeholder="请输入姓名">
        </div>
        <div class="channelItem">
          <span>出生年月</span>
          <el-date-picker
            v-model="channelForm.birthday"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择年月日">
          </el-date-picker>
        </div>
        <div class="channelItem">
          <span>手机号</span>
          <input type="text" v-model="channelForm.mobile" placeholder="请输入手机号码">
        </div>
        <div class="channelItem">
          <span>性别</span>
          <el-radio-group v-model="channelForm.gender">
            <el-radio label=1>男</el-radio>
            <el-radio label=2>女</el-radio>
          </el-radio-group>
        </div>
        <div class="channelItem">
          <span>渠道</span>
          <el-select v-model="channelForm.bdChannelId" placeholder="请选择">
            <el-option
              v-for="item in channelList"
              :key="item.id"
              :label="item.channels"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="channelItem">
          <span>关联订单</span>
          <input type="text" v-model="channelForm.order_no" placeholder="请输入订单号">
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
          <img :src="tdObject.qrcodeUrl" alt="">
          <div class="tips">请右键，图片另存为或者复制图片</div>
          <input type="text" :value="tdObject.qrcodeUrl" id="qrcodeUrl">
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
      this.fetchChannelList()
      this.fetchList()
    },
    computed:{

    },
    data(){
      return{
        channelList: [],
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
      inQuiryAllChannel() {
        this.pagination.nowPage = 1;
        this.fetchList()
      },
      fetchChannelList() {
        axios.get('/ykb/mg/private/bdchannel/')
          .then(res=>{
          if (res.data.code === 2000) {
          console.log(res)
          this.channelList = res.data.result.result;
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
      convertDateFromString(dateString) {
        if (dateString) {
          var arr1 = dateString.split(" ");
          var sdate = arr1[0].split('-');
          var date = new Date(sdate[0], sdate[1]-1, sdate[2]);
          return date;
        }
      },
      ages(dateString)
      {
        var arr1 = dateString.split(" ");
        let str = arr1[0];
        let   r   =   str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
        if(r==null)return   false;
        var   d=   new   Date(r[1],   r[3]-1,   r[4]);
        if   (d.getFullYear()==r[1]&&(d.getMonth()+1)==r[3]&&d.getDate()==r[4])
        {
          var   Y   =   new   Date().getFullYear();
          return Y-r[1];
        }
        return 0;
      },
      fetchList(query) {
        axios.get('/ykb/mg/private/bduser/?page.nowPage='+ this.pagination.nowPage + '&page.pageSize='+ this.pagination.pageSize, {
          params: query
        })
            .then(res=>{
          if (res.data.code === 2000) {
              console.log(res)
              this.bdChannelResult = res.data.result;
              for (let r of this.bdChannelResult.result) {
                try {r.age = this.ages(r.birthday);
                } catch (e) {}
              }
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
        this.channelForm = {
          id: '',
          channels: '',
          bd:'',
        }
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
            if(this.isNullOrEmpty(this.channelForm.name)){
              toast.error({
                msg:'请填写姓名'
              })
              return
            }

            if(!this.isPhone(this.channelForm.mobile)){
              toast.error({
                msg:'请填写正确手机号码'
              })
              return
            }

            console.log('dddd')

            if(this.isNullOrEmpty(this.channelForm.id)){
            }
            this.channelForm.bd_channel_id = this.channelForm.bdChannelId;
            axios.post('/ykb/mg/private/bduser/',this.channelForm)
              .then(res=>{
                console.log(res)
                if(res.data.code === 2000){
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
