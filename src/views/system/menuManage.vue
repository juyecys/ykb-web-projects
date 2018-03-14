<template>
  <div id="menuManage">
    <operationBtn :btns="btns"></operationBtn>
    <itable
      :ths="['菜单名称','是否父菜单','序号','链接字符串','操作']"
      :tds="['name','isParentMenu','sequence','resource','##[static/images/write.png]##']"
      :tableData="menuList"
      :totalPage="menuPageInfo.totalPage"
      :totalCount="menuPageInfo.totalCount"
      :nowPage="menuPageInfo.nowPage"
      :pageSize="menuPageInfo.pageSize"
      @pageHadChange="toNextPage"
      @pageSizeHadChange="changePageSize"
      @tdImgClick="operateThisRow"
    ></itable>
    <modal :show="showEditSystemMenu" title="编辑系统菜单" @makesure="toEditSystemMenu" @cancel="toHideSystemMenuModal(0)" id="showEditSystemMenu">
      <div class="modalItemContainer">
        <div class="modalItem">
          <div class="itemName">菜单名称</div>
          <div class="itemValue">
            <input type="text" v-model="menuName" placeholder="请输入菜单名称">
          </div>
        </div>
        <div class="modalItem">
          <div class="itemName">菜单序号</div>
          <div class="itemValue">
            <input type="text" v-model.number="menuSequence" placeholder="请输入菜单序号">
          </div>
        </div>
      </div>
    </modal>
    <modal :show="showAddSystemMenu" title="新增系统菜单" @makesure="toAddSystemMenu" @cancel="toHideSystemMenuModal(1)" id="showAddSystemMenu">
      <div class="modalItemContainer">
        <div class="modalItem">
          <div class="itemName">Name</div>
          <div class="itemValue">
            <input type="text" v-model="aMenuName" placeholder="请输入菜单名称">
          </div>
        </div>
        <div class="modalItem">
          <div class="itemName">Code</div>
          <div class="itemValue">
            <input type="text" v-model="aMenuCode" placeholder="请输入菜单Code">
          </div>
        </div>
        <div class="modalItem">
          <div class="itemName">IsParentMenu</div>
          <div class="itemValue">
            <choice :choiceDatas="aMenuIsParentMenu"></choice>
          </div>
        </div>
        <div class="modalItem" v-show="aMenuIsParentMenu[1].status">
          <div class="itemName">Resource</div>
          <div class="itemValue">
            <input type="text" v-model="aMenuResource" placeholder="请输入菜单Resource">
          </div>
        </div>
        <div class="modalItem" v-show="aMenuIsParentMenu[1].status">
          <div class="itemName">ParentCode</div>
          <div class="itemValue">
            <input type="text" v-model="aMenuParentMenuCode" placeholder="请输入父菜单名称">
          </div>
        </div>
        <div class="modalItem">
          <div class="itemName">menuSequence</div>
          <div class="itemValue">
            <input type="text" v-model.number="aMenuSequence" placeholder="请输入菜单序号">
          </div>
        </div>
      </div>
    </modal>
  </div>
</template>
<script>
  import operationBtn from '../../components/operationBtn'
  import itable from '../../components/itable'
  import modal from '../../components/modal'
  import choice from '../../components/choice'
  //import dateFormat from '../../components/dateFormat';
  import maskLayer from '../../components/maskLayer'
  import toast from '../../components/toast'
  export default {
    name:'menuManage',
    components:{
      operationBtn,
      itable,
      modal,
      choice
    },
    computed:{
      menuList(){
        let list = this.$store.state.system.menuList
        list.map(item=>{
          if(item.parentMenu){
          item.isParentMenu = '是'
        }else{
          item.isParentMenu = '否'
        }
        return item
      })
        return list
      },
      menuPageInfo(){
        return this.$store.state.system.menuPageInfo
      }
    },
    mounted(){
      this.$store.dispatch('getMenuList',{nowPage:1,pageSize:25})
    },
    data(){
      return {
        //新增系统菜单
        showAddSystemMenu:false,
        aMenuName:'',
        aMenuCode:'',
        aMenuSequence:'',
        aMenuResource:'',
        aMenuParentMenuCode:'',
        aMenuIsParentMenu:[{
          name:'YES',
          value:true,
          status:false
        },{
          name:'NO',
          value:false,
          status:true
        }],
        //结束新增系统菜单
        menuName:'',
        menuSequence:0,
        menuId:'',
        showEditSystemMenu:false,
        btns:[{
          name:'新增菜单',
          event:this.addSystemMenu
        }]
      }
    },
    methods:{
      toAddSystemMenu(){
        let self= this,
          canSubmit=true,
          arr = [{
            key:'name',
            value:self.aMenuName
          },{
            key:'code',
            value:self.aMenuCode
          },{
            key:'sequence',
            value:self.aMenuSequence
          }],
          obj = {}
        for(let i=arr.length-1;i>=0;i--){
          if(self.noEmpty(arr[i].value)){
            obj[arr[i].key] = arr[i].value
          }else{
            toast.error({
              msg:'请完整填写系统菜单内容！'
            })
            canSubmit = false
            break;
          }
        }
        if(self.aMenuIsParentMenu[1].status){
          if(self.noEmpty(self.aMenuParentMenuCode) && self.noEmpty(self.aMenuResource)){
            obj.isParentMenu = false
            obj.resource = self.aMenuResource
            obj.parentMenuCode = self.aMenuParentMenuCode
          }else{
            toast.error({
              msg:'请填写系统父菜单Code！'
            })
            canSubmit = false
            return
          }
        }else{
          obj.isParentMenu = true
        }

        if(canSubmit){
          self.$store.dispatch('addSystemMenu',obj)
          self.toHideSystemMenuModal(1)
        }
      },
      noEmpty(val){
        if(val !== '' && val !== null || (typeof val === 'number' && val !== 0)){
          return true
        }else{
          return false
        }
      },
      toHideSystemMenuModal(code){
        if(code === 0){
          this.showEditSystemMenu = false
        }else{
          this.showAddSystemMenu  = false
        }
        maskLayer.hide()
      },
      toEditSystemMenu(){
        if(this.menuName !== '' && this.menuSequence!== ''){
          this.$store.dispatch('editSystemMenu',{id:this.menuId,name:this.menuName,sequence:this.menuSequence})
        }
        this.showEditSystemMenu = false
        maskLayer.hide()
      },
      operateThisRow(index,_index){
        console.log(index,_index)
        if(_index === 0){
          this.menuId = this.menuList[index].id
          this.menuName = this.menuList[index].name
          this.menuSequence = this.menuList[index].sequence
          this.showEditSystemMenu = true
          maskLayer.show()
        }
      },
      changePageSize(size){
        this.$store.dispatch('getMenuList',{nowPage:1,pageSize:size})
      },
      toNextPage(nextPage){
        this.$store.dispatch('getMenuList',{nowPage:nextPage,pageSize:this.menuPageInfo.pageSize})
      },
      addSystemMenu(){
        this.showAddSystemMenu  = true
        maskLayer.show()
      }
    }
  }
</script>
<style lang="less" scoped>
  #menuManage{
    .modalItem{
      display: flex;
      justify-content:center;
      min-height:32px;
      margin-top:10px;
      .itemName{
        width:120px;
        padding-top:5px;
        padding-right:20px;
        text-align: right;
      }
      .itemValue{
        width:300px;
        textarea{
          width:300px;
          height:100px;
          resize:none;
          padding:10px;
          border-radius:3px;
          outline:none;
          border-color:#ccc;
        }
        input{
          width:300px;
          height:32px;
          border:1px solid #ccc;
          border-radius:2px;
          padding-left:10px;
          outline:none;
        }
      }
    }
  }
</style>
