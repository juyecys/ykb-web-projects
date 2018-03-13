<template>
  <div id="users">
    <operation-btn :btns="btns"></operation-btn>
    <itable
      :ths="['用户名','所属角色','是否有效','过期时间','描述','操作']"
      :tds="['name','roleName','enableText','expireDate','description','##[static/images/write.png,static/images/delete.png]##']"
      :tableData="usersResults"
      :totalPage="usersPageInfo.totalPage"
      :totalCount="usersPageInfo.totalCount"
      :nowPage="usersPageInfo.nowPage"
      :pageSize="usersPageInfo.pageSize"
      @pageHadChange="toNextPage"
      @pageSizeHadChange="changePageSize"
      @tdImgClick="operateThisRow"
    ></itable>
    <modal :show="showAddSystemUserModal" :title="isAdd?'新增系统用户':'编辑系统用户'" @makesure="toAddSystemUser" @cancel="toCancel" id="showAddSystemUserModal">
      <div class="addSystemUser">
        <div class="addItem">
          <div class="itemName">用户</div>
          <div class="itemValue">
            <input type="text" v-model="newUserName" placeholder="请输入用户名称">
          </div>
        </div>
        <div class="addItem" v-if="isAdd">
          <div class="itemName">密码</div>
          <div class="itemValue">
            <input type="text" v-model="newUserPassword" placeholder="请输入密码">
          </div>
        </div>
        <div class="addItem">
          <div class="itemName">所属角色</div>
          <div class="itemValue">
            <search-input
              :value.sync="roleName"
              :searchkey.sync="roleId"
              :searchData="roleList.roleName"
              :searchKeyValue="roleList.roleId"
              :onlySelect="true"
            ></search-input>
          </div>
        </div>
        <div class="addItem">
          <div class="itemName">是否有效</div>
          <div class="itemValue">
            <choice :choiceDatas="effectiveUser" ></choice>
          </div>
        </div>
        <div class="addItem">
          <div class="itemName">过期时间</div>
          <div class="itemValue">
            <v-date-picker
              mode='single'
              :show-caps=true
              :is-expanded=true
              popover-visibility="focus"
              input-placeholder="选择日期"
              v-model='expireDate'>
              <input type="text" class="picker" id="endDateYMD" v-model="expireDateYMD" placeholder="选择日期" >
            </v-date-picker>
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
  import searchInput from '../../components/searchInput'
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
      searchInput,
      modal,
      choice
    },
    computed:{
      expireDateYMD(){
        if(this.expireDate !== ''){
          return dateFormat(this.expireDate,'yyyy-mm-dd','','')
        }else{
          return ''
        }
      },
      usersResults(){
        let list = this.$store.state.system.userLists
        list.map(item=>{
          if(item.enabled){
            item.enableText = '是'
          }else{
            item.enableText = '否'
          }
          return item
        })
        return list
      },
      usersPageInfo(){
        return this.$store.state.system.usersPageInfo
      },
      roleList(){
        console.log(this.$store.state.system.roleList)
        let roleList = this.$store.state.system.roleList,
          roleId = [],
          roleName = []
        roleList.map(item=>{
          if(item.active){
            roleId.push(item.id)
            roleName.push(item.name)
          }
        })
        return {
          roleId,roleName
        }
      }
    },
    data(){
      return {
        effectiveUser:[{
          name:'是',
          value:true,
          status:true
        },{
          name:'否',
          value:false,
          status:false
        }],
        isAdd:false,
        userId:'',
        desc:'',
        expireDate:'',
        newUserName:'',
        newUserPassword:'',
        showAddSystemUserModal:false,
        roleId:'',
        roleName:'',
        btns:[{
          name:'新增',
          event:this.addSystemUser
        }]
      }
    },
    mounted(){
      this.$store.dispatch('getAdminUser',{nowPage:1,pageSize:10})
      this.$store.dispatch('getAllRole')
    },
    methods:{
      operateThisRow(index,_index){
        console.log(index,_index,)
        let self= this
        if(_index === 0){
          let data = self.usersResults[index]
          self.userId = data.id
          self.desc = ''
          self.expireDate = new Date(data.expireDate)
          self.newUserName = data.name
          self.roleId = data.roleId
          self.roleName = data.roleName
          self.effectiveUser[0].status = data.enabled
          self.effectiveUser[1].status = !data.enabled
          self.isAdd = false
          self.showAddSystemUserModal = true
          maskLayer.show()
        }else{
          this.$store.dispatch('deleteThisSystemUser',self.usersResults[index].id)
        }
      },
      toCancel(){
        this.showAddSystemUserModal = false
        maskLayer.hide()
      },
      toAddSystemUser(){
        let self = this
        if(self.roleName !=='' && self.newUserName !== '' && self.expireDate !=='' && (!self.isAdd || self.isAdd && self.newUserPassword !== '')){
          console.log('ok')
          let obj = {
            name:self.newUserName,
            password:self.newUserPassword,
            roleId:self.roleId,
            description:self.desc,
            expireDate:dateFormat(self.expireDate,'yyyy-mm-dd','HH:mm:dd'),
            enabled:self.effectiveUser[0].status?self.effectiveUser[0].status:self.effectiveUser[1].status
          }
          if(!self.isAdd){
            obj.id = self.userId
          }
          console.log(obj)
          this.$store.dispatch('operateSystemUser',obj)
          this.toCancel()
        }else{
          console.log('no')
          toast.error({
            msg:'请填写必要的用户信息！'
          })
        }
      },
      changePageSize(size){
        this.$store.dispatch('getAdminUser',{nowPage:1,pageSize:size})
      },
      toNextPage(nextPage){
        this.$store.dispatch('getAdminUser',{nowPage:nextPage,pageSize:this.usersPageInfo.pageSize})
      },
      addSystemUser(){
        let self = this
          self.isAdd = true
          self.userId = ''
          self.desc = ''
          self.expireDate = ''
          self.newUserName = ''
          self.newUserPassword = ''
          self.roleId = ''
          self.roleName = ''
          self.effectiveUser[0].status = true
          self.effectiveUser[1].status = false
        self.showAddSystemUserModal = true
        maskLayer.show()
      }
    }
  }
</script>
<style lang="less" scoped>
  #users{
    .addSystemUser{
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
