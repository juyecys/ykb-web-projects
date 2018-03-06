<template>
  <div id="users">
    <operation-btn :btns="btns"></operation-btn>
    <itable
      :ths="['用户名','所属角色','是否有效','过期时间','描述']"
      :tds="['name','role_name','enabled','exprie_date','#暂无#']"
      :tableData="usersResults"
      :totalPage="usersPageInfo.totalPage"
      :totalCount="usersPageInfo.totalCount"
      :nowPage="usersPageInfo.nowPage"
      :pageSize="usersPageInfo.pageSize"
      @pageHadChange="toNextPage"
      @pageSizeHadChange="changePageSize"
    ></itable>
  </div>
</template>
<script>
  import operationBtn from '../../components/operationBtn'
  import itable from '../../components/itable'
  export default {
    name:'users',
    components:{
      operationBtn,itable
    },
    computed:{
      usersResults(){
        return this.$store.state.system.userLists
      },
      usersPageInfo(){
        return this.$store.state.system.usersPageInfo
      }
    },
    data(){
      return {
        btns:[{
          name:'新增',
          event:this.addSystemUser
        }]
      }
    },
    mounted(){
      this.$store.dispatch('getAdminUser')
    },
    methods:{
      changePageSize(size){},
      toNextPage(nextPage){},
      addSystemUser(){
        console.log('addSystemUser')
      }
    }
  }
</script>
<style lang="less" scoped>

</style>
