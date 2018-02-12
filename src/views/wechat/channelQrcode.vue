<template>
  <div id="channelQrcode">
    <operation-btn :btns="btns"></operation-btn>
    <modal :show="showModal" @makesure="addChannel(0)" @cancel="hideAddChannelModal" confirmTxt="确定" title="新增渠道二维码" id="showModal">
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
    <modal :show="showInquiryModal" @makesure="addChannel(1)" @cancel="cancel" confirmTxt="确定" title="查询渠道二维码" id="showModal" :width="1000">
      <div class="muchContainer">
        <div class="sectionHeader">
          <div :class="['headerItem',showChannelInfo?'action':'']" @click="changeShowChannelInfo(true)">基本信息</div>
          <div :class="['headerItem',!showChannelInfo?'action':'']" @click="changeShowChannelInfo(false)">扫码后消息</div>
        </div>
        <div class="sectionBody" >
          <div class="bodyItem" v-show="showChannelInfo">
            <div class="channelInput">
              <div class="channelItem">
                <span>推广渠道</span>
                <input type="text" v-model="inquiryChannelName" placeholder="请输入推广渠道">
              </div>
              <div class="channelItem">
                <span>渠道编码</span>
                <input type="text" v-model="inquiryChannelCode" placeholder="渠道编码只能是数字/大小写字母/_/-" :disabled="updateChannel">
              </div>
            </div>
          </div>
          <div class="bodyItem" v-show="!showChannelInfo">
            <choice :choiceDatas="sengMsgFrom" type="checkbox"></choice>
            <operationBtn :btns="channelBtns"></operationBtn>
            <div class="messageContainer" v-show="sengMsgFrom[1].status">
              <ul>
                <li v-for="(item,index) in messages">
                  <message-for-wx
                    :message.sync="item"
                    :msgIndex="index+1"
                    @deleteThisMessage="deleteThisMessage"
                    @editThisMessage="editThisMessage"
                    @saveThisMessage="saveThisMessage"
                    @cancelEditThisMessage="cancelEditThisMessage"
                    @muchRichTextMessageChange="muchRichTextMessageChange"
                    @uploadImage="uploadImage"
                  ></message-for-wx>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </modal>
    <!--查看二维码信息-->
    <modal :show.sync="ModalForShowTdValue" @makesure="copyQrcodeUrl(showTdIndex)" @cancel="cancel" :confirmTxt="showTdIndex === 2?'复制二维码链接':'好的'" :title="tdTitle" id="ModalForShowTdValue">
      <div class="ModalForShowTdValue">
        <div class="tdValue" v-if="showTdIndex === 2">
          <img :src="tdObject.qrcodeUrl" alt="">
          <div class="tips">请右键，图片另存为或者复制图片</div>
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
      :ths="['渠道编码','渠道名','渠道二维码','关注用户数','渠道分组','最后修改人','最后修改时间','操作']"
      :tds="['scene','channels','#查看#','#查看#','#暂无#','updatedBy','updatedDate','##{../../static/images/write.png}##']"
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
    <modal :show="showTestMessageModal" @makesure="toSendMessageToSomeone" @cancel="hideTestMessageModal" confirmTxt="发送" title="测试关注后消息" id="showTestMessageModal">
      <div class="testMessage">
        <div class="testMessageInfoHeader">
          <input type="text" v-model="testPeopleOpenId" class="testPeopleOpenId">
          <div class="btn" @click="checkoutUser">查询</div>
        </div>
        <div class="testMessageInfoBody">
          <span class="nickName" v-show="testMessagesPeople!==''">
            {{testMessagesPeople}}
          </span>
        </div>
      </div>
    </modal>
    <div class="uploadFile" >
      <form id="uploadImageForm">
        <input type="file" name="file" id="uploadImage" accept="image/gif, image/jpeg, image/png" @change="toUploadImage" style="display: none;">
      </form>
    </div>
  </div>
</template>
<script>
  import operationBtn from '../../components/operationBtn'
  import messageForWx from '../../components/messageForWx'
  import modal from '../../components/modal'
  import itable from '../../components/itable'
  import choice from '../../components/choice'
  import Toast from '../../components/toast'
  import maskLayer from '../../components/maskLayer'
  export default {
    name:'channelQrcode',
    components:{
      operationBtn,modal,itable,messageForWx,choice
    },
    mounted(){
      if(this.$store.state.qrcodeInfos.qrcodePageInfo.nowPage !== 1){
        this.$store.dispatch('getChannels',{nowPage:1,pageSize:10})
      }
      //this.$store.dispatch('getWxMessages','CHANNEL')
    },
    watch:{
      channelWxMessages(val){
        console.log(val,'watch')
        this.messages = val.slice(0)
      },
      uploadImageUrl(val){
        console.log(val,this.msgIndex)
        let message = this.messages[this.msgIndex]
        console.log(message,message.article_list[this.imageIndex],this.imageIndex)
        message.article_list[this.imageIndex].pic_url = val
        this.messages.splice(this.msgIndex,1,message)
      }
    },
    computed:{
      qrcodeResults(){
        return this.$store.state.qrcodeInfos.qrcodeResults
      },
      qrcodePageInfo(){
        return this.$store.state.qrcodeInfos.qrcodePageInfo
      },
      channelWxMessages(){
        let wxMessages = this.$store.state.channelWxMessages
        if(wxMessages.length === 0){
          wxMessages.push({
            type:'CHANNEL',
            typeName:'',
            msg_type:'',
            canEdit:true,
            imgUrl:'',
            article_list:[{
              title:"",
              description:"",
              url:"",
              pic_url:""
            }],
            radioData:[{
              name:'开启',
              value:true,
              status:false
            },{
              name:'关闭',
              value:false,
              status:true
            }]
          })
        }else{
          for(let i=wxMessages.length-1;i>=0;i--){
            wxMessages[i].canEdit = false
            if(wxMessages[i].status){
              wxMessages[i].radioData = [{
                name:'开启',
                value:true,
                status:true
              },{
                name:'关闭',
                value:false,
                status:false
              }]
            }else{
              wxMessages[i].radioData = [{
                name:'开启',
                value:true,
                status:false
              },{
                name:'关闭',
                value:false,
                status:true
              }]
            }

            if(wxMessages[i].msg_type === 'text'){
              wxMessages[i].typeName = '文字消息'
              continue;
            }
            if(wxMessages[i].msg_type === 'image'){
              wxMessages[i].typeName = '图片消息'
              continue;
            }
            if(wxMessages[i].msg_type === 'article'){
              wxMessages[i].typeName = '图文消息'
              continue;
            }
            if(wxMessages[i].msg_type === 'article_list'){
              wxMessages[i].typeName = '图文消息'
              continue;
            }
          }
        }

        console.log(wxMessages)
        return wxMessages
      },
      testMessagesPeople(){
        return this.$store.state.testMessagesPeople
      },
      uploadImageUrl(){
        return this.$store.state.uploadImageUrl
      }
    },
    data(){
      return {
        updateChannel:false,//是否是更新渠道信息，是就禁止更改渠道编码的输入
        testPeopleOpenId:'',//给测试人员发送渠道的推送消息的openid
        showTestMessageModal:false,//显示查找测试人员openid的模态窗
        imageIndex:0,//多图文的第几个消息的插入图片编号
        msgIndex:0,//第几个消息
        sengMsgFrom:[{
          name:'使用统一消息模板(关注时，优先发送)',
          value:'wx',
          status:true
        },{
          name:'渠道消息模板(关注时或已关注时扫码)',
          value:'channel',
          status:false
        },],
        messages:[],//消息列表
        channelBtns:[{
          name:'新增渠道消息',
          event:this.addWxMessage
        },{
          name:'预览',
          event:this.testWxMessages
        }],
        showChannelInfo:true,//编辑的时候，true显示的是渠道信息，false就显示扫码后发送消息部分
        ModalForShowTdValue:false,//查看二维码信息以及关注人数的模态窗的控制值
        tdTitle:"",//查看二维码信息以及关注人数的模态窗的标题值
        showTdIndex:0,//查看二维码信息以及关注人数的模态窗的确定键的事件
        tdObject:{//查看二维码信息以及关注人数的模态窗的内容对象
          qrcodeUrl:'',
          qrcodeName:'',
          qrcodeCount:0
        },
        inquiryChannelName:'',//查询渠道信息的渠道名
        inquiryChannelCode:'',//查询渠道信息的渠道编码
        inquiryChannelId:'',//查询渠道信息的渠道ID
        channelName:'',//新增渠道信息的渠道名
        channelCode:'',//新增渠道信息的渠道编码
        showInquiryModal:false,//显示查询渠道信息的模态窗
        showModal:false,//显示新增渠道信息的模态窗
        btns:[{
          name:'新增',
          event:this.addEvent
        }]
      }
    },
    methods:{
      //上传图片
      toUploadImage(){
        console.log(123)
        let oinput = document.getElementById('uploadImageForm'),
          formData = new FormData(oinput);
        console.log(formData,oinput)
        this.$store.dispatch('uploadImage',{data:formData})
      },
      //上传图片的点击事件
      uploadImage(msgIndex,index){
        console.log(msgIndex,index,'-------------------')
        if(index !== 0){//不为0的时候，是多图文里面的消息图片上传
          this.imageIndex = index
        }
        this.msgIndex = msgIndex
        let oinput = document.querySelector('#uploadImage')
        oinput.click()
      },
      //查询该openid的用户
      checkoutUser(){
        this.$store.dispatch('checkoutUser',this.testPeopleOpenId)
      },
      //发送推送消息给测试用户
      toSendMessageToSomeone(){
        if(this.testMessagesPeople !== ''){
          this.$store.dispatch('toSendMessageToSomeone',{open_id:this.testPeopleOpenId,type:'CHANNEL',qr_code_scene:this.inquiryChannelCode})
        }else{
          Toast.error({
            msg:'没找到对应的openId的微信用户,发送失败'
          })
          return
        }
        this.showTestMessageModal = false
        maskLayer.hide()
      },
      //隐藏模态窗
      cancel(){
        this.showTestMessageModal = false
        maskLayer.hide()
      },
      //新增消息
      addWxMessage(){
        console.log('新增')
        if(this.sengMsgFrom[1].status){
          this.messages.push({
            typeName:'',
            msg_type:'',
            canEdit:true,
            imgUrl:'',
            article_list:[{
              title:"",
              description:"",
              url:"",
              pic_url:""
            }],
            radioData:[{
              name:'开启',
              value:true,
              status:false
            },{
              name:'关闭',
              value:false,
              status:true
            }]
          })
        }else{
          Toast.error({
            msg:'请先确定选择渠道消息模板！'
          })
        }

      },
      //显示测试的模态窗
      testWxMessages(){
        console.log('预览')
        this.showTestMessageModal = true
        maskLayer.show()
      },
      //多图文消息变动（暂时没做）
      muchRichTextMessageChange(count,index){
        let len = this.messages[index].article_list.length
        if(len < count){
          for(let i=len;i<count;i++){
            this.messages[index].article_list.push({
              pic_url:'',
              url:'',
              title:''
            })
          }
        }else{
          this.messages[index].article_list.splice(count,len-count)
        }
      },
      //删除消息的操作
      deleteThisMessage(item,index){
        //this.messages.splice(index,1)
        if(item.hasOwnProperty('id')){
          this.$store.dispatch('deleteThisMessage',{id:item.id,messages:this.messages})
        }else{
          this.messages.splice(index,1)
        }
      },
      //保存消息
      saveThisMessage(item,index){
        let obj = {}
        switch(item.msg_type){
          case 'text':
            if(item.content === ''){
              Toast.error({
                msg:'请填写文字消息的内容'
              })
              return
            }
            obj = {
              type:'CHANNEL',
              msg_type:'text',
              content:item.content
            }
            item.hasOwnProperty('id') && (obj.id = item.id)
            break;
          case 'image':
            if(item.imgUrl === ''){
              Toast.error({
                msg:'请上传图片消息的图片'
              })
              return
            }
            break;
          case 'article':
            if(item.article_list[0].title === ''){
              Toast.error({
                msg:'请填写图文消息标题'
              })
              return
            }
            if(item.article_list[0].description === ''){
              Toast.error({
                msg:'请填写图文消息摘要'
              })
              return
            }
            if(item.article_list[0].pic_url === ''){
              Toast.error({
                msg:'请上传图文消息的图片'
              })
              return
            }
            if(item.article_list[0].url === ''){
              Toast.error({
                msg:'请填写图文消息跳转链接'
              })
              return
            }
            obj = {
              type:'CHANNEL',
              msg_type:'article',
              article_list:[{
                title:item.article_list[0].title,
                description:item.article_list[0].description,
                pic_url:item.article_list[0].pic_url,
                url:item.article_list[0].url
              }]
            }
            item.hasOwnProperty('id') && (obj.id = item.id)
            break;
          case 'articles':
            let articles = item.article_list
            for(let i=articles.length-1;i>=0;i--){
              if(articles[i].title === ''){
                Toast.error({
                  msg:`请填写多图文消息的${i===0?'头条消息':'二级消息'+i}的标题`
                })
                return
              }
              if(articles[i].pic_url === ''){
                Toast.error({
                  msg:'请上传多图文消息的图片'
                })
                return
              }
              if(articles[i].url === ''){
                Toast.error({
                  msg:`请填写多图文消息的${i===0?'头条消息的':'二级消息'+i}的跳转链接`
                })
                return
              }
            }
            break;
          default:Toast.error({
            msg:'请填写消息类型！'
          })
            return
            break;
        }
        item.canEdit = false;
        for(let i=1;i>=0;i--){
          if(this.messages[index].radioData[i].status === true){
            obj.status = this.messages[index].radioData[i].value
          }
        }
        obj.qr_code_scene = this.inquiryChannelCode,
        this.messages.splice(index,1,item)
        console.log(this.messages[index],obj)
        this.$store.dispatch('saveThisMessage',{obj})
        let mes = this.messages.slice(0)
        this.messages=[]
        this.$nextTick(()=>{
          this.messages = mes.slice(0)
        })
      },
      //取消编辑这条消息
      cancelEditThisMessage(item,index){
        item.canEdit = false;
        this.messages.splice(index,1,item)
        let mes = this.messages.slice(0)
        this.messages=[]
        this.$nextTick(()=>{
          this.messages = mes.slice(0)
        })
      },
      //编辑这条消息
      editThisMessage(item,index){
        item.canEdit = true;
        this.messages.splice(index,1,item)
        let mes = this.messages.slice(0)
        this.messages=[];//为了触发视图更新
        this.$nextTick(()=>{
          this.messages = mes.slice(0)
          console.log(this.messages)
        })
        console.log(this.messages)
      },
      //切换查询二维码的tab页
      changeShowChannelInfo(bool){
        this.showChannelInfo = bool
      },
      //对这行表格进行操作
      operationTd(index,_index){
        console.log(index,'operationTd',_index)
        if(_index === 0){
          this.updateChannel = true
          maskLayer.show()
          this.showInquiryModal = true
          console.log(this.qrcodeResults[index])
          let qrcodeResult = this.qrcodeResults[index]
          this.inquiryChannelName = qrcodeResult.channels
          this.inquiryChannelCode = qrcodeResult.scene
          this.inquiryChannelId = qrcodeResult.id
          this.sengMsgFrom[0].status = qrcodeResult.send_subscribe_message
          this.sengMsgFrom[1].status = qrcodeResult.send_channel_message
          console.log(this.inquiryChannelId,'this.inquiryChannelId')
          //this.messages = []
          this.$store.dispatch('getThisChannelWxMessage',{type:'CHANNEL',scene:qrcodeResult.scene})
          //this.$store.dispatch('getWxMessages','CHANNEL')
        }
      },
      //复制二维码连接
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
      //查看二维码信息以及关注人数
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
      //改变页大小
      changePageSize(size){
        console.log(size)
        this.$store.dispatch('getChannels',{pageSize:size,nowPage:1})
      },
      //跳转下一页
      toNextPage(nextPage){
        console.log(nextPage)
        this.$store.dispatch('getChannels',{pageSize:this.qrcodePageInfo.pageSize,nowPage:nextPage})
      },
      //显示新增的模态窗
      addEvent(){
        console.log('add')
        maskLayer.show()
        this.showModal = true
        this.updateChannel = false
        this.inquiryChannelName=''
        this.inquiryChannelCode=''
      },
      //新增或编辑渠道信息
      addChannel(type){
        let self = this,
            channelName = self.inquiryChannelName,
            channelCode = self.inquiryChannelCode
        console.log(self,channelName,channelCode)
        if(channelName!=='' && channelCode!==''){
          if(/[^0-9a-zA-Z_-]/.test(channelCode)){
            Toast.error({
              msg:'渠道编码只能是数字或大小写字母或下划线_或破折号-'
            })
            return
          }
          console.log(123)
          if(type === 0){//0意味着新增的
            self.$store.dispatch('addChannel',{id:'',name:channelName,code:channelCode,sendSubscribeMessage:true,sendChannelMessage:false})
            this.showModal = false
          }else{
            self.$store.dispatch('addChannel',{id:this.inquiryChannelId,name:channelName,code:channelCode,sendSubscribeMessage:this.sengMsgFrom[0].status,sendChannelMessage:this.sengMsgFrom[1].status})
            this.showInquiryModal = false
          }
          maskLayer.hide()
        }else{
          Toast.error({
            msg:'请输入完整的信息'
          })
        }
      },
      //关闭编辑渠道信息的模态窗
      cancel(){
        this.showInquiryModal = false
        maskLayer.hide()
        console.log('sure cancel')
      },
      //关闭新增渠道信息的模态窗
      hideAddChannelModal(){
        this.showModal = false
        maskLayer.hide()
      },
      //关闭发送消息给测试人员的模态窗
      hideTestMessageModal(){
        this.showTestMessageModal = false
      }
    }
  }
</script>
<style lang="less" scoped>
  #channelQrcode{
    .testMessage{
      .testMessageInfoHeader{
        display: flex;
        justify-content:center;
      }
      .testMessageInfoBody{
        text-align:center;
      .nickName{
        border:1px solid #007aff;
        border-radius:32px;
        padding:5px 10px;
        margin:10px auto;
        display: inline-block;
      }
      }
      .testPeopleOpenId{
        width:300px;
        height:32px;
        border:1px solid #999;
        border-top-left-radius:30px;
        border-bottom-left-radius:30px;
        outline:none;
        padding-left:10px;
        font-size:16px;
      }
      .btn{
        width:80px;
        text-align: center;
        height:32px;
        line-height:32px;
        border:1px solid #999;
        border-left:none;
        border-top-right-radius:30px;
        border-bottom-right-radius:30px;
        cursor: pointer;
      }
  }
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
    .muchContainer{
    padding:0 10px;
      .sectionHeader{
        display: flex;
        height:40px;
        align-items:center;
        text-align: center;
        border:1px solid #ececec;
        background:#ececec;
        .action{
          background: #fff;
        }
        .headerItem{
          width:50%;
          height:39px;
          line-height:39px;
          cursor: pointer;
          margin-top:1px;
        }
      }
      .sectionBody{
        border:1px solid #ececec;
        margin-top:0px;
        padding:0 10px;
        li{
          background: #fff;
          margin:30px 0;
          padding:10px;
          box-shadow: 0 0 10px #999;
          border-radius:5px;
          min-width:800px;
        }
        li:first-child{
          margin:20px 0;
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
        .tips{
          text-align: center;
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
