<template>
  <div id="role">
    <operation-btn :btns="btns"></operation-btn>
    <itable
      :ths="['角色名','是否有效','描述','操作']"
      :tds="['name','enableText','description','##[static/images/write.png,static/images/delete.png]##']"
      :tableData="rolesResults"
      :totalPage="rolesPageInfo.totalPage"
      :totalCount="rolesPageInfo.totalCount"
      :nowPage="rolesPageInfo.nowPage"
      :pageSize="rolesPageInfo.pageSize"
      @pageHadChange="toNextPage"
      @pageSizeHadChange="changePageSize"
      @tdImgClick="operateThisRow"
    ></itable>
    <modal :show="showAddSystemRoleModal" :title="isAdd?'新增系统角色':'编辑系统角色'" @makesure="toAddSystemRole" @cancel="toCancel" id="showAddSystemRoleModal">
      <div class="addSystemRole">
        <div class="addItem">
          <div class="itemName">角色名称</div>
          <div class="itemValue">
            <input type="text" v-model="newRoleName" placeholder="请输入角色名称">
          </div>
        </div>
        <div class="addItem">
          <div class="itemName">是否有效</div>
          <div class="itemValue">
            <choice :choiceDatas="effectiveRole" ></choice>
          </div>
        </div>
        <div class="addItem">
          <div class="itemName">描述</div>
          <div class="itemValue">
            <textarea name="desc" id="desc" v-model="desc" placeholder="请输入描述"></textarea>
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
  import dateFormat from '../../components/dateFormat';
  import maskLayer from '../../components/maskLayer'
  import toast from '../../components/toast'
  export default {
    name:'users',
    components:{
      operationBtn,
      itable,
      modal,
      choice
    },
    computed:{
      rolesResults(){
        let list = this.$store.state.system.roleLists
        list.map(item=>{
          if(item.isActive){
            item.enableText = '是'
          }else{
            item.enableText = '否'
          }
          return item
        })
        return list
      },
      rolesPageInfo(){
        return this.$store.state.system.rolesPageInfo
      }
    },
    data(){
      return {
        effectiveRole:[{
          name:'是',
          value:true,
          status:true
        },{
          name:'否',
          value:false,
          status:false
        }],
        isAdd:false,
        roleId:'',
        desc:'',
        newRoleName:'',
        showAddSystemRoleModal:false,
        btns:[{
          name:'新增',
          event:this.addSystemRole
        }]
      }
    },
    mounted(){
      this.$store.dispatch('getAdminRole',{nowPage:1,pageSize:10})
    },
    methods:{
      operateThisRow(index,_index){
        console.log(index,_index,)
        let self= this
        if(_index === 0){
          let data = self.rolesResults[index]
          self.roleId = data.id
          self.desc = ''
          self.newRoleName = data.name
          self.effectiveRole[0].status = data.isActive
          self.effectiveRole[1].status = !data.isActive
          self.isAdd = false
          self.showAddSystemRoleModal = true
          maskLayer.show()
        }else{
          this.$store.dispatch('deleteThisSystemRole',self.rolesResults[index].id)
        }
      },
      toCancel(){
        this.showAddSystemRoleModal = false
        maskLayer.hide()
      },
      toAddSystemRole(){
        let self = this
        if(self.newRoleName !== ''){
          console.log('ok')
          let obj = {
            name:self.newRoleName,
            description:self.desc,
            code:'ROLE_ADMIN',
            isActive:self.effectiveRole[0].status?self.effectiveRole[0].status:self.effectiveRole[1].status
          }
          if(!self.isAdd){
            obj.id = self.roleId
          }
          console.log(obj)
          this.$store.dispatch('operateSystemRole',obj)
          this.showAddSystemRoleModal = false
          maskLayer.hide()
        }else{
          console.log('no')
          toast.error({
            msg:'请填写必要的用户信息！'
          })
        }
      },
      changePageSize(size){
        this.$store.dispatch('getAdminRole',{nowPage:1,pageSize:size})
      },
      toNextPage(nextPage){
        this.$store.dispatch('getAdminRole',{nowPage:nextPage,pageSize:this.usersPageInfo.pageSize})
      },
      addSystemRole(){
        let self = this
        self.isAdd = true
        self.roleId = ''
        self.desc = ''
        self.newRoleName = ''
        self.effectiveRole[0].status = true
        self.effectiveRole[1].status = false
        self.showAddSystemRoleModal = true
        maskLayer.show()
      }
    }
  }
</script>
<style lang="less" scoped>
  #role{
  .addSystemRole{
  .addItem{
    display: flex;
  //align-items: center;
    justify-content:center;
    min-height:32px;
    margin-top:10px;
  .itemName{
    width:100px;
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
  }
</style>
