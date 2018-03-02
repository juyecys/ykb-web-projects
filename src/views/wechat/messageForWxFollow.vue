<template>
  <div id="messageForWxFollow">
    <operationBtn :btns="btns"></operationBtn>
    <div class="messageContainer">
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
    <modal :show="showTestMessageModal" @makesure="toSendMessageToSomeone" @cancel="cancel" confirmTxt="发送" title="测试关注后消息" id="showTestMessageModal">
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
  import modal from '../../components/modal'
  import maskLayer from '../../components/maskLayer.js'
  import messageForWx from '../../components/messageForWx'
  import operationBtn from '../../components/operationBtn'
  import Toast from '../../components/toast'
  export default {
    name:'messageForWxFollow',
    components:{
      messageForWx,operationBtn,modal
    },
    watch:{
      wxMessages(val){
        //console.log(val,'watch')
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
      wxMessages(){
        let wxMessages = this.$store.state.wxMessages
        //console.log(wxMessages,'----')
        for(let i=wxMessages.length-1;i>=0;i--){
          //!wxMessages[i].hasOwnProperty('canEdit')&&(wxMessages[i].canEdit = false)
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
            wxMessages[i].typeName = '文本消息'
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
        //console.log(wxMessages)
        return wxMessages
      },
      testMessagesPeople(){
        return this.$store.state.testMessagesPeople
      },
      uploadImageUrl(){
        return this.$store.state.uploadImageUrl
      }
    },
    mounted(){
      this.$store.dispatch('getWxMessages','SUBSCRIBE')
    },
    data(){
      return {
        testPeopleOpenId:'',
        showTestMessageModal:false,
        btns:[{
          name:'新增',
          event:this.addWxMessage
        },{
          name:'预览',
          event:this.testWxMessages
        }],
        messages:[],
        imageIndex:0,
        msgIndex:0
      }
    },
    methods:{
      toUploadImage(){
        console.log(123)
        let oinput = document.getElementById('uploadImageForm'),
          formData = new FormData(oinput);
          console.log(formData,oinput)
        this.$store.dispatch('uploadImage',{data:formData})
      },
      uploadImage(msgIndex,index){
        console.log(msgIndex,index,'-------------------')
        if(index !== 0){//不为0的时候，是多图文里面的消息图片上传
          this.imageIndex = index
        }
        this.msgIndex = msgIndex
        let oinput = document.querySelector('#uploadImage')
        oinput.click()
      },
      checkoutUser(){
        this.$store.dispatch('checkoutUser',this.testPeopleOpenId)
      },
      toSendMessageToSomeone(){
        if(this.testMessagesPeople !== ''){
          this.$store.dispatch('toSendMessageToSomeone',{open_id:this.testPeopleOpenId,type:'SUBSCRIBE',qr_code_scene:''})
          this.testPeopleOpenId = ''
          this.testMessagesPeople = ''
        }else{
          Toast.error({
            msg:'没找到对应的openId的微信用户,发送失败'
          })
          return
        }
        this.showTestMessageModal = false
        maskLayer.hide()
      },
      cancel(){
        this.showTestMessageModal = false
        maskLayer.hide()
      },
      addWxMessage(){
        console.log('新增')
        this.messages.push({
          type:'SUBSCRIBE',
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
            status:true
          },{
            name:'关闭',
            value:false,
            status:false
          }]
        })

      },
      testWxMessages(){
        console.log('预览')
        this.showTestMessageModal = true
        maskLayer.show()
      },
      openThisMessage(index,name,item,msgIndex){
        console.log('--',index,'--',name,'--',item,msgIndex,this.messages[msgIndex])
      },
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
      deleteThisMessage(item,index){
        //this.messages.splice(index,1)
        this.$store.dispatch('deleteThisMessage',{id:item.id,messages:this.messages})
      },
      saveThisMessage(item,index){
        let obj = {}
        switch(item.msg_type){
          case 'text':
            if(item.content === ''){
              Toast.error({
                msg:'请填写文本消息的内容'
              })
              return
            }
            obj = {
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
        obj.type='SUBSCRIBE'
        this.messages.splice(index,1,item)
        console.log(this.messages[index],obj)
        this.$store.dispatch('saveThisMessage',{obj})
        /*let mes = this.messages.slice(0)
        this.messages=[]
        this.$nextTick(()=>{
          this.messages = mes.slice(0)
        })*/
      },
      cancelEditThisMessage(item,index){
        if(item.hasOwnProperty('id')){
          item.canEdit = false;
          this.messages.splice(index,1,item)
        }else{
          this.messages.splice(index,1)
        }
      },
      editThisMessage(item,index){
        item.canEdit = true;
        this.messages.splice(index,1,item)
      },
      searchInputValueChange(value){
        console.log(value,'searchInputValueChange',this.messages)
      }
    }
  }
</script>
<style lang="less" scoped>
  #messageForWxFollow{
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
    .messageContainer{
      padding: 0 10px;
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
</style>
