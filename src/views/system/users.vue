<template>
  <div id="users">
    <operation-btn :btns="btns"></operation-btn>
    <itable
      :ths="['openid','省份','城市','微信名称','关注时间','关注渠道','渠道分组']"
      :tds="['open_id','province','city','nick_name','subscribe_time','channels','channel_group_name']"
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
