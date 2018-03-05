<template>
  <div id="wxmenu">
    <operation-btn :btns="btns"></operation-btn>
    <modal :show="showModal" :title="isAddMenu?'新增公众号菜单':'编辑公众号菜单'" @makesure="addWXMenu" @cancel="cancel" id="addWXMenu">
      <div class="wxmenuContainer">
        <div class="menuItem">
          <span>菜单名称</span>
          <input type="text" v-model="menuItem.name">
        </div>
        <div class="menuItem">
          <span>菜单级别</span>
          <div class="searchInputCon">
            <search-input :value.sync="menuItem.levelName" :searchkey.sync="menuItem.level" :searchData="['一级','二级']" :searchKeyValue="['1','2']" :onlySelect="true" @value-change="showParentMenu"></search-input>
          </div>
        </div>
        <div class="menuItem" v-if="menuItem.level === '2'">
          <span>父菜单</span>
          <div class="searchInputCon">
            <search-input :value.sync="menuItem.parentName" :searchData="parentMenu" :onlySelect="true"></search-input>
          </div>
        </div>
        <div class="menuItem">
          <span>菜单序号</span>
          <div class="searchInputCon">
            <search-input :value.sync="menuItem.sequence" :searchData="[1,2,3,4,5]" :onlySelect="true"></search-input>
          </div>
        </div>
        <div class="menuItem">
          <span>菜单类型</span>
          <div class="searchInputCon">
            <search-input :value.sync="menuItem.typeName" :searchkey.sync="menuItem.type" :searchData="['按钮菜单','消息菜单','图文菜单','网页菜单','父菜单']" :searchKeyValue="['click','text','article','view','group']" @value-change="searchInputValueChange" :onlySelect="true"></search-input>
          </div>
        </div>
        <div class="menuItem" v-if="menuItem.type === 'click' || menuItem.type === 'text' || menuItem.type === 'article' ">
          <span>编码</span>
          <input type="text" v-model="menuItem.key">
        </div>
        <div class="menuItem" v-if="menuItem.type === 'article'">
          <span>标题</span>
          <input type="text" v-model="menuItem.title">
        </div>
        <div class="menuItem" v-if="menuItem.type === 'text' || menuItem.type === 'article'">
          <span>内容</span>
          <textarea v-model="menuItem.content"></textarea>
          <!--<input type="text" v-model="menuItem.content">-->
        </div>
        <div class="menuItem" v-if="menuItem.type === 'article'">
          <span>图片链接</span>
          <input type="text" v-model="menuItem.imgUrl">
        </div>
        <div class="menuItem" v-if="menuItem.type === 'article' || menuItem.type === 'view'">
          <span>网页链接</span>
          <input type="text" v-model="menuItem.url">
        </div>
      </div>
    </modal>
    <itable
      :ths="['菜单名称','菜单级别','菜单序号','菜单类型','父菜单','URL','操作']"
      :tds="['name','levelName','sequence','typeName','parentName','#查看url#','##[static/images/write.png,static/images/delete.png]##']"
      :tableData="wxMenuResults"
      :totalPage="wxMenuPageInfo.totalPage"
      :totalCount="wxMenuPageInfo.totalCount"
      :nowPage="wxMenuPageInfo.nowPage"
      :pageSize="wxMenuPageInfo.pageSize"
      @pageHadChange="toNextPage"
      @pageSizeHadChange="changePageSize"
      @tdClick="showUrlValue"
      @tdImgClick="editTd"
    ></itable>
    <modal :show.sync="showModalForUrl" title="查看Url" @makesure="cancel"  :cancelShow="false" id="showModalForUrl">
      <div class="showUrl">
        <div class="url">
          <div v-if="menuUrl.indexOf('http')<=-1">{{menuUrl}}</div>
          <a :href="menuUrl" target="_blank" v-else>{{menuUrl}}</a>
        </div>
      </div>
    </modal>
  </div>
</template>
<script>
  import operationBtn from '../../components/operationBtn'
  import searchInput from '../../components/searchInput'
  import modal from '../../components/modal'
  import Toast from '../../components/toast'
  import maskLayer from '../../components/maskLayer'
  import itable from '../../components/itable'
  export default {
    name:'wxmenu',
    components:{
      operationBtn,modal,searchInput,itable
    },
    data(){
      return {
        isAddMenu:false,
        menuUrl:'',
        showModalForUrl:false,
        showModal:false,
        menuItem:{
          "name":"",
          "level":"",
          "levelName":"",
          "type":"",
          "typeName":"",
          "key":"",
          "sequence":"",
          "title":"",
          "content":"",
          "url":"",
          "imgUrl":"",
          "parentName":''
        },
        parentMenu:[],
        parentMenuId:[],
        btns:[{
          name:'新增',
          event:this.addEvent
        },{
          name:'生成菜单',
          style:'successBtn',
          event:this.makeMenu
        }],
        menuType:{
          group:'父菜单',
          text:'消息菜单',
          article:'图文菜单',
          click:'按钮菜单',
          view:'网页菜单'
        }
      }
    },
    mounted(){
      console.log('mounted')
      if(this.$store.state.wechat.wxMenuInfos.wxMenuPageInfo.nowPage !== 1){
          this.$store.dispatch('getWXMenu',{pageSize:10,nowPage:1})
      }
      console.log()
    },
    computed:{
      levelName(){
        return this.menuItem.levelName
      },
      wxMenuResults(){
        let wxMenuResults = this.$store.state.wechat.wxMenuInfos.wxMenuResults,index=0
        for(let i=wxMenuResults.length-1;i>=0;i-- ){
          wxMenuResults[i].typeName = this.menuType[wxMenuResults[i].type]
          wxMenuResults[i].levelName = wxMenuResults[i].level===1?'一级':'二级'
          if(wxMenuResults[i].type === 'group'){
            console.log(wxMenuResults[i])
            this.parentMenu.splice(index,1,wxMenuResults[i].name)
            this.parentMenuId.splice(index,1,wxMenuResults[i].id)
            index++
          }
        }
        console.log(this.parentMenu)
        return wxMenuResults
      },
      wxMenuPageInfo(){
        return this.$store.state.wechat.wxMenuInfos.wxMenuPageInfo
      },
      clickOver(){
        return this.$store.state.clickOver
      }
    },
    methods:{
      editTd(tr,index){
        console.log(index,'editTd',tr)
        let odata = this.wxMenuResults[tr]
        if(index === 0){
          console.log(this.menuItem)
          if(odata.level === 1){
            this.menuItem.levelName = '一级'
            this.menuItem.level = '1'
          }else if(odata.level === 2){
            this.menuItem.levelName = '二级'
            this.menuItem.level = '2'
          }
          this.menuItem = {
            "name":"",
            "level":"",
            "levelName":"",
            "type":"",
            "typeName":"",
            "key":"",
            "sequence":"",
            "title":"",
            "content":"",
            "url":"",
            "imgUrl":"",
            "parentName":''
          }
          this.menuItem = Object.assign({},this.menuItem,this.wxMenuResults[tr])
          console.log(this.menuItem)
          console.log(this.menuItem.id)
          this.isAddMenu = false
          maskLayer.show()
          this.showModal = true
        }else{
          this.$store.dispatch('deleteWxMenu',{id:this.wxMenuResults[tr].id})
        }
      },
      showUrlValue(tr,td,key){
        console.log(key)
        if(td === 5){
          if(this.wxMenuResults[tr].hasOwnProperty('url')){
            this.menuUrl = this.wxMenuResults[tr].url
          }else{
            this.menuUrl = '这个菜单没有包含URL哦'
          }
          maskLayer.show()
          this.showModalForUrl = true
        }
      },
      changePageSize(size){
        console.log(size)
        this.$store.dispatch('getWXMenu',{nowPage:1,pageSize:size})
      },
      toNextPage(nextPage){
        console.log(nextPage)
        this.$store.dispatch('getWXMenu',{nowPage:nextPage,pageSize:this.wxMenuPageInfo.pageSize})
      },
      makeMenu(){
        if(this.clickOver){
          this.$store.dispatch('makeMenu')
        }else{
          Toast.error({
            'msg':'请不要重复点击按钮'
          })
        }
      },
      showParentMenu(){
        let wxMenuResults = this.wxMenuResults,index=0
        for(let i=wxMenuResults.length-1;i>=0;i-- ){
          if(wxMenuResults[i].type === 'group'){
            console.log(wxMenuResults[i])
            this.parentMenu.splice(index,1,wxMenuResults[i].name)
            this.parentMenuId.splice(index,1,wxMenuResults[i].id)
            index++
          }
        }
        console.log(this.parentMenu)
      },
      addEvent(){
        maskLayer.show()
        this.showModal = true
        this.isAddMenu = true
        this.menuItem = {
          "name":"",
          "level":"",
          "levelName":"",
          "type":"",
          "typeName":"",
          "key":"",
          "sequence":"",
          "title":"",
          "content":"",
          "url":"",
          "imgUrl":"",
          "parentName":''
        }
      },
      addWXMenu(){
        console.log(this.menuItem)
        let menuItem = this.menuItem
        if(menuItem.level === "1" && menuItem.name.length >4){
          Toast.error({
            msg:'一级菜单字数限制为不大于4个'
          })
          return
        }else if(menuItem.level === "2"){
          if(menuItem.name.length >7){
            Toast.error({
              msg:'一级菜单字数限制为不大于7个'
            })
            return
          }
          if(menuItem.parentName.length<=0){
            Toast.error({
              msg:'请选择父菜单'
            })
            return
          }
        }
        if(menuItem.sequence.length <=0){
          Toast.error({
            msg:'请选择菜单序号'
          })
          return
        }
        if(menuItem.type.length <=0){
          Toast.error({
            msg:'请选择菜单类型'
          })
          return
        }
        let id = ''
        console.log(this.parentMenu,menuItem.parentName)
        for(let i=this.parentMenu.length-1;i>=0;i--){
          console.log(menuItem.parentName , this.parentMenu[i])
          if(menuItem.parentName === this.parentMenu[i]){
            id = this.parentMenuId[i]
              break;
          }
        }
        console.log(this.isAddMenu,menuItem.id)
        let datas = {
          "name":menuItem.name,
          "level":Number(menuItem.level),
          "type":menuItem.type,
          "sequence":menuItem.sequence,
          "parentId":id
        }
        switch(menuItem.type){
          case 'group':
            break;
          case 'text':
            console.log(this.menuItemKeyValue() && this.menuItemContentValue())
            if(this.menuItemKeyValue() && this.menuItemContentValue()){
              datas.key = menuItem.key
              datas.content = menuItem.content
            }else{
              Toast.error({
                msg:'请填写完整的菜单信息'
              })
              return
            }
            break;
          case 'click':
            console.log(this.menuItemKeyValue())
            if(this.menuItemKeyValue()){
              datas.key = menuItem.key
            }else{
              Toast.error({
                msg:'请填写完整的菜单信息'
              })
              return
            }
            break;
          case 'article':
            console.log(this.menuItemKeyValue() && this.menuItemContentValue() && this.menuItemUrlValue())
            console.log(menuItem.title !=='' , menuItem.imgUrl !=='')
            if(this.menuItemKeyValue() && this.menuItemContentValue() && this.menuItemUrlValue() && menuItem.title !== '' && menuItem.imgUrl !==''){
              datas.key = menuItem.key
              datas.content = menuItem.content
              datas.url = menuItem.url
              datas.title = menuItem.title
              datas.imgUrl = menuItem.imgUrl
            }else{
              Toast.error({
                msg:'请填写完整的菜单信息'
              })
              return
            }
            break;
          case 'view':
            console.log(this.menuItemUrlValue())
            if(this.menuItemUrlValue()){
              datas.url = menuItem.url
            }else{
              console.log(datas)
              Toast.error({
                msg:'请填写完整的菜单信息'
              })
              return
            }
            break;
          default:return;
        }
        if(this.isAddMenu){
          this.$store.dispatch('addWXMenu',{datas:datas})
        }else{
          datas.id = menuItem.id
          this.$store.dispatch('editWXMenu',{datas:datas})
        }
        console.log(datas)
        this.showModal = false
        maskLayer.hide()
        this.menuItem = {
            "name":"",
            "level":"",
            "type":"",
            "key":"",
            "sequence":"",
            "title":"",
            "content":"",
            "url":"",
            "imgUrl":"",
            "parentName":''
        }
      },
      menuItemKeyValue(){
        if(this.menuItem.key.length<=0){
          return false
        }else{
          return true
        }
      },
      menuItemContentValue(){
        if(this.menuItem.content.length<=0){
          return false
        }else{
          return true
        }
      },
      menuItemUrlValue(){
        if(this.menuItem.url.length<=0){
          return false
        }else{
          return true
        }
      },
      cancel(){
        this.showModal = false
        maskLayer.hide()
      },
      searchInputValueChange(value){
        console.log(value,'searchInputValueChange')
      }
    }
  }
</script>
<style lang="less" scoped>
  #wxmenu{
    .wxmenuContainer{
      .menuItem{
        padding:10px 0;
        display:flex;
        justify-content:center;
        align-items:center;
        span{
          width:80px;
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
    .showUrl{
      a{
        word-break: break-all;
        word-wrap: break-word;
        color:#06e;
      }
    }
  }

</style>
