<!--suppress ALL -->
<template>
  <div id="bdChannelGroup">
    <operation-btn :btns="btns"></operation-btn>

    <div class="bdChannelGroupContainer">
      <span>Banner设置</span>
      <div class="channelItem" v-for="(banner,index) in bannerList">
        <p>
          <img class="banner" :src="banner.img"/>
          <span>
            {{banner.link}}
          </span>
        </p>
        <p>
          <img src="static/images/write.png" @click="editBanner(index)"/>
          <img src="static/images/delete.png" @click="removeBanner(index)"/>
        </p>
      </div>
      <p>
          <img src="static/images/add.png" @click="editBanner(-1)"/>
      </p>
    </div>



    <div class="bdChannelGroupContainer">
      <span>图片设置</span>
      <div style="display: flex" v-for="(img, index) in imgs">
        <p>
          <img class="banner" :src="img" />
        </p>
        <p>
          <img src="static/images/write.png" @click="uploadImage('imgs', index)"/>
        </p>
        <p>
          <img src="static/images/delete.png" @click="removeImg(index)"/>
        </p>
      </div>
      <p>
        <img src="static/images/add.png" @click="uploadImage('imgs', -1)"/>
      </p>
    </div>

    <div class="bdChannelGroupContainer">
        <span>客服二维码</span>
      <p>
        <img class="banner" :src="kefu ? kefu : 'static/images/add.png'" @click="uploadImage('kefu')"/>
      </p>
    </div>

    <div class="bdChannelGroupContainer">
        <span>Email接收列表</span>
      <div class="channelItem">
        <textarea  type="text" v-model="email" placeholder="Email接收列表"></textarea>
      </div>
    </div>

    <modal :show="showModal" @makesure="editBannerDo(0)" @cancel="cancel(0)" confirmTxt="确定" title="banner设置" id="showModal">
      <div class="Modal bdChannelGroupContainer">
        <div class="channelItem">
          <span>图片</span>
          <p>
            <img class="banner" :src="channelForm.img ? channelForm.img : 'static/images/add.png'" @click="uploadImage('banner')"/>
          </p>
        </div>
        <div class="channelItem">
          <span>banner连接</span>
          <input type="text" v-model="channelForm.link" placeholder="请输入banner连接，留空为不跳转">
        </div>
      </div>
    </modal>

    <form id="uploadImageForm">
      <input type="file" name="file" id="uploadImage" accept="image/gif, image/jpeg, image/png" @change="toUploadImage" style="display: none;">
    </form>
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
      uploadImageUrl(){
        return this.$store.state.uploadImageUrl
      },
    },
    data(){
      return{
        bannerList: [],
        imgs: [],
        email: '',
        kefu:'',
        remark:'',

        uploadData: {
          type:'',
          index: 0,
        },

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
          name:'保存',
          event:this.save
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
    watch:{
      uploadImageUrl(val){
        console.log('上传成功的地址：' + val)

        switch (this.uploadData.type) {
          case 'banner':
            this.$set(this.channelForm,'img',val)
            break;

          case 'imgs':
            if (this.uploadData.index >= 0) {
              this.imgs.splice(this.uploadData.index, 1, val)
            } else {
              this.imgs.push(val)
            }
            break;
          case 'kefu':
            console.log('kefu' + val)
            this.kefu = val
            break;
        }

      },
    },
    methods:{
      save() {
        let form = {
          name: 'bdChannel',
          banners: JSON.stringify(this.bannerList),
          imgs: JSON.stringify(this.imgs),
          kefu: this.kefu,
          email: this.email
        }

        axios.post('/ykb/mg/private/activity/' ,form)
          .then(res=>{
          if (res.data.code === 2000) {
              toast.success({
                msg:'保存成功'
              })
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
      editBanner(index) {
        if(index >= 0) {
          let b = this.bannerList[index];
          this.channelForm = {
            index: index,
            img: b.img,
            link: b.link
          }
        } else {
          this.channelForm = {
            index: -1
          }
        }
        this.showModal = true;
      },
      editBannerDo() {
        if (this.channelForm.index >= 0) {
          this.bannerList.splice(this.channelForm.index, 1, this.channelForm)
        } else {
          this.bannerList.push(this.channelForm)
        }
        this.cancel();
      },
      removeBanner(index) {
        this.bannerList.splice(index, 1)
      },

      removeImg(index) {
        this.imgs.splice(index, 1)
      },

      uploadImage(type,index){
        console.log(type,index,'图片上传')
        this.uploadData.type = type;
        this.uploadData.index = index;
        let oinput = document.querySelector('#uploadImage')
        oinput.click()
      },

      toUploadImage() {
        console.log(123)
        let oinput = document.getElementById('uploadImageForm'),
          formData = new FormData(oinput);
        console.log(formData,oinput)
        this.$store.dispatch('uploadImage',{data:formData})
      },

      uploadImageUrl(val){
        console.log('uploadImageUrl->',val,this.msgIndex)
        let message = this.messages[this.msgIndex]
        console.log(message,message.article_list[this.imageIndex],this.imageIndex)
        message.article_list[this.imageIndex].pic_url = val
        this.messages.splice(this.msgIndex,1,message)
      },

      fetchList(query) {
        axios.get('/ykb/mg/private/activity/' ,{
          params: {
            name: 'bdChannel'
          }
        })
            .then(res=>{
          if (res.data.code === 2000) {
              console.log(res)
              let d = res.data.result.result[0];

              if (this.isNullOrEmpty(d)) {
                return;
              }

              this.kefu = d.kefu;
              this.email = d.email;
              try {
                this.imgs = JSON.parse(d.imgs);
              } catch (e) {
                this.imgs = []
              }
              try {
                this.bannerList = JSON.parse(d.banners);
              } catch (e) {
                this.bannerList = [];
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
      addBdChannel() {
        this.channelForm = {
          id: '',
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

            if(this.isNullOrEmpty(this.channelForm.bd)){
              toast.error({
                msg:'请填写BD姓名'
              })
              return
            }

            if(this.isNullOrEmpty(this.channelForm.id)){
              this.channelForm.qr_code_url = process.env.API_URL + "/ykb_qianhai/index.html?c="+this.channelForm.channels_code
            }

            axios.post('/ykb/mg/private/bdchannel/',this.channelForm)
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
        this.pagination.pageSize = size;
        this.pagination.nowPage = nextPage;
        this.fetchList()
      },
    }
  }
</script>
<style lang="less" scoped>
  .Modal{
    padding-left: 0 !important;
    background: transparent !important;
    .channelItem span{
      width: 26% !important;
    }
  }
  .bdChannelGroupContainer{
    padding: 20px;
    padding-left: 100px;
    background: #dcdfe6;
    width:100%;
    margin-bottom: 20px;
    .channelItem{
      margin:20px 0;
      display:flex;
      span{
        font-size:14px;
        margin-right:20px;
        width:40%;
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
        width: 500px;
        height:150px;
      }
      .choiceContainer{
        width:300px;
        text-align: left;
      }
    }
  }
  .banner{
    width: 200px !important;
    display: block;
  }

</style>
