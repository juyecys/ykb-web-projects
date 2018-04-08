<template>
  <div id="messageForWx">
    <div class="messageItem">
      <div class="itemHeader">
        <div class="leftPart">消息{{msgIndex}}:<span :style="{'color':!message.canEdit?'#d43f3a':'#007AFF','margin-left':'10px'}">{{!message.canEdit?'已锁定不可修改':'可修改'}}</span></div>
        <div class="rightPart">
          <span>消息类型:</span><search-input :value.sync="message.typeName" :searchkey.sync="message.msg_type" :searchData="['文本消息','图片消息','图文消息','多图文','模板消息']" :searchKeyValue="['text','image','article','article_list','template']" :onlySelect="true" :canEdit="message.canEdit"></search-input>
        </div>
      </div>
      <div class="itemBody">
        <div class="mask" v-show="!message.canEdit"></div>
        <div class="itemContainer" v-if="message.msg_type === 'text'">
          <div class="leftPart">
            <span>消息内容:</span>
          </div>
          <div class="rightPart">
            <textarea name="textMsg" id="textMsg" v-model="message.content" placeholder="请输入消息内容"></textarea>
          </div>
        </div>
        <div class="itemContainer" v-if="message.msg_type === 'image'" >
          <div class="leftPart">
            <span>插入图片:</span>
          </div>
          <div class="rightPart">
            <div class="addPicture">
              <img :src="message.media_url !==''?message.media_url:'static/images/add.png'" alt="" class="addImage" @click="uploadWxImage(msgIndex-1)">
            </div>
          </div>
        </div>
        <div class="moreItem" v-if="message.msg_type === 'article'">
          <div class="itemContainer">
            <div class="leftPart">
              <span>插入图片:</span>
            </div>
            <div class="rightPart">
              <div class="addPicture">
                <img :src="message.article_list[0].pic_url!==''?message.article_list[0].pic_url:'static/images/add.png'" alt="" class="addImage" @click="uploadImage(0)">
                <span class="addImageTips">插入图片(推荐900X500像素)</span>
              </div>
            </div>
          </div>
          <div class="itemContainer">
            <div class="leftPart">
              <span>标题:</span>
            </div>
            <div class="rightPart">
              <input type="text" v-model="message.article_list[0].title" placeholder="请输入消息标题">
            </div>
          </div>
          <div class="itemContainer">
            <div class="leftPart">
              <span>摘要:</span>
            </div>
            <div class="rightPart">
              <input type="text" v-model="message.article_list[0].description" placeholder="请输入消息摘要">
            </div>
          </div>
          <div class="itemContainer">
            <div class="leftPart">
              <span>跳转链接:</span>
            </div>
            <div class="rightPart">
              <input type="text" v-model="message.article_list[0].url" placeholder="请输入消息跳转链接">
            </div>
          </div>
        </div>
        <div class="moreItemContainer">
          <div class="itemContainer" v-if="message.msg_type === 'article_list'">
            <div class="leftPart">消息数:</div>
            <div class="rightPart">
              <search-input :value.sync="articlesCount"  :searchData="['1','2','3','4','5']"  :onlySelect="true" @valueChange="choiceThisItem"></search-input>
              <span class="addImageTips">慎重！这里的更改会改动数据的！比如消息数从3到1的话，会真正地删除2条消息的内容的！</span>
            </div>
          </div>
          <div class="moreItem" v-for="(oitem,oindex) in message.article_list" v-show="message.msg_type === 'article_list'">
            <div class="moreItemTitle" v-show="message.msg_type === 'article_list'"> {{oindex===0?'头条消息':'二级消息'+oindex}}</div>
            <div class="itemContainer">
              <div class="leftPart">
                <span>插入图片:</span>
              </div>
              <div class="rightPart">
                <div class="addPicture">
                  <img src="static/images/add.png" alt="" class="addImage" @click="uploadImage(oindex)">
                  <span class="addImageTips">{{oindex!==0?'插入图片(推荐200X200像素)':'插入图片(推荐900X500像素)'}}</span>
                </div>
              </div>
            </div>
            <div class="itemContainer">
              <div class="leftPart">
                <span>标题:</span>
              </div>
              <div class="rightPart">
                <input type="text" v-model="oitem.title" placeholder="请输入消息标题">
              </div>
            </div>
            <div class="itemContainer">
              <div class="leftPart">
                <span>跳转链接:</span>
              </div>
              <div class="rightPart">
                <input type="text" v-model="oitem.url" placeholder="请输入消息跳转链接">
              </div>
            </div>
          </div>
        </div>
        <div class="templateContain" v-if="message.msg_type === 'template'">
          <div class="itemContainer">
            <div class="leftPart">
              <span>模板Id:</span>
            </div>
            <div class="rightPart">
              <input type="text" v-model="message.templateMessage.templateId" placeholder="请输入模板Id">
            </div>
          </div>
          <div class="itemContainer">
            <div class="leftPart">
              <span>标题:</span>
            </div>
            <div class="rightPart">
              <input type="text" v-model="message.templateMessage.first" placeholder="请输入消息标题">
            </div>
          </div>
          <div class="itemContainer" v-for="keyword in 5">
            <div class="leftPart">
              <span>关键词{{keyword}}:</span>
            </div>
            <div class="rightPart">
              <input type="text" v-model="message.templateMessage['keyword'+keyword]" :placeholder="'请输入关键词'+keyword">
            </div>
          </div>
          <div class="itemContainer">
            <div class="leftPart">
              <span>正文:</span>
            </div>
            <div class="rightPart">
              <input type="text" v-model="message.templateMessage.remark" placeholder="请输入正文">
            </div>
          </div>
          <div class="itemContainer">
            <div class="leftPart">
              <span>跳转链接:</span>
            </div>
            <div class="rightPart">
              <input type="text" v-model="message.templateMessage.url" placeholder="请输入跳转链接">
            </div>
          </div>
          <div class="itemContainer">
            <div class="leftPart">
              <span>注意:</span>
            </div>
            <div class="rightPart">
              <p>请严格按照消息模板填写关键词，不要填多，否则消息不能正常发送</p>
            </div>
          </div>
        </div>
        <choice :name="'open'+msgIndex" :choiceDatas="message.radioData"></choice>
      </div>
      <div class="itemFooter">
        <div class="btn" @click="editThisMessage(message,msgIndex)" v-show="!message.canEdit">修改</div>
        <div class="btn cancel" @click="cancelEditThisMessage" v-show="message.canEdit">取消</div>
        <div class="btn delete" @click="deleteThisMessage" v-show="message.canEdit">删除</div>
        <div class="btn save" @click="saveThisMessage" v-show="message.canEdit">保存</div>
      </div>
      <iconfirm
        :show="show"
        @onConfirm="onConfirm"
        @onCancel="onCancel"
      >
        <p>确定删除消息{{msgIndex}}吗？</p>
      </iconfirm>
      <div class="mask" v-show="show" style="background-color: rgba(0,0,0,.5)"></div>
    </div>
  </div>
</template>
<script>
  import choice from './choice'
  import searchInput from './searchInput'
  import iconfirm from './iconfirm'
  import maskLayer from './maskLayer'
  export default {
    name:'messageForWx',
    components:{
      searchInput,choice,iconfirm
    },
    data(){
      return {
        show:false,
        articlesCount:'1'
      }
    },
    props:{
      msgIndex:{
        type:Number,
        default:1
      },
      message:{
        type:Object,
        default:()=>{
          return {}
        }
      }
    },
    mounted(){
      if(this.message.hasOwnProperty('list') && this.message.list.length >0){
        this.articlesCount = this.message.list.length + ''
      }
    },
    methods:{
      uploadWxImage(index){
        console.log('uploadWxImage',index)
        this.$emit('uploadWxImage',index)
      },
      uploadImage(index){
        this.$emit('uploadImage',this.msgIndex-1,index)
      },
      onCancel(){
        this.show = false
        //maskLayer.hide()
      },
      onConfirm(){
        this.$emit('deleteThisMessage',this.message,this.msgIndex-1)
        this.show = false
        //maskLayer.hide()
      },
      choiceThisItem(item){
        console.log(item,'---------------------------')
        this.$emit('muchRichTextMessageChange',item-0,this.msgIndex-1)
      },
      editThisMessage(item,index){
        this.message.canEdit = true
        this.$emit('editThisMessage',this.message,this.msgIndex-1)
      },
      deleteThisMessage(){
        //maskLayer.show()
        this.show = true
      },
      cancelEditThisMessage(){
        this.$emit('cancelEditThisMessage',this.message,this.msgIndex-1)
      },
      saveThisMessage(){
        this.$emit('saveThisMessage',this.message,this.msgIndex-1)
      },/*
      openThisMessage(index,name,item){
        this.$emit('openThisMessage',index,name,item,this.msgIndex-1)
      }*/
    }
  }
</script>
<style lang="less" scoped>
  .mask{
    position: absolute;
    left:0;
    right:0;
    top:0;
    bottom:0;
    z-index:99;
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
    .messageItem{

      position: relative;
      .itemHeader{
        .leftPart{
          padding:10px 0;
        }
        .rightPart{
          display: flex;
          align-items:center;
          span{
            width:75px;
            text-align: right;
            margin:0 15px 0 0;
          }
        }
      }
    .itemBody{
      position:relative;
      .moreItemTitle{
        padding:10px 0 0 0;
        color:#d43f3a;
        text-align: center;
        width:600px;
        position: relative;
      }
      .moreItemTitle::before{
        content:'';
        width:40%;
        height:1px;
        border-bottom:1px dashed #ccc;
        position: absolute;
        left:0;
        top:50%;
        transform: translate(0,50%);
      }
      .moreItemTitle::after{
        content:'';
        width:40%;
        height:1px;
        border-bottom:1px dashed #ccc;
        position: absolute;
        right:0;
        top:50%;
        transform: translate(0,50%);
      }
      .itemContainer{
        display:flex;
        padding:10px 0 0 0;
        align-items:center;
      .leftPart{
        width:75px;
        text-align: right;
        margin:0 15px 0 0;
      }
      .rightPart{
        display: flex;
        align-items:center;
        .addPicture{
          display: flex;
          align-items:center;
        }
        .addImageTips{
          margin-left:15px;
          color:#999;
        }
        textarea{
          resize:none;
          border-color:#ccc;
          width:500px;
          height:180px;
          border-radius:5px;
          outline:none;
          padding:10px;
          line-height:1.4;
          font-size:14px;
          color:#333;
        }
        img{
          max-height: 200px;
          cursor: pointer;
        }
        input{
          width:500px;
          border:1px solid #ccc;
          border-radius:2px;
          outline:none;
          padding:10px;
        }
      }
    }
  }
    .itemFooter{
      display:flex;
      .btn{
        width: 80px;
        height: 32px;
        line-height: 32px;
        border-radius: 3px;
        text-align: center;
        margin: 10px;
        cursor: pointer;
        border: 1px solid #007AFF;
        padding: 0 10px;
      }
      .cancel{
        border-color:#d43f3a;
        color:#d43f3a;
      }
      .delete{
        border-color:#f00;
        color:#f00;
      }
      .save{
        color:#007AFF;
      }
    }
  }
  }
</style>
