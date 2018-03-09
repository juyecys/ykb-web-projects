<template>
  <div id="menuManage">
    <operationBtn :btns="btns"></operationBtn>
    <itable
      :ths="['菜单名称','是否父菜单','序号','链接字符串','操作']"
      :tds="['name','isParentMenu','sequence','resource','##[static/images/write.png,static/images/delete.png]##']"
      :tableData="menuList"
      :totalPage="menuPageInfo.totalPage"
      :totalCount="menuPageInfo.totalCount"
      :nowPage="menuPageInfo.nowPage"
      :pageSize="menuPageInfo.pageSize"
      @pageHadChange="toNextPage"
      @pageSizeHadChange="changePageSize"
      @tdImgClick="operateThisRow"
    ></itable>
  </div>
</template>
<script>
  import operationBtn from '../../components/operationBtn'
  import itable from '../../components/itable'
  import modal from '../../components/modal'
  //import choice from '../../components/choice'
  //import dateFormat from '../../components/dateFormat';
  import maskLayer from '../../components/maskLayer'
  import toast from '../../components/toast'
  export default {
    name:'menuManage',
    components:{
      operationBtn,
      itable,
      modal,
    },
    computed:{
      menuList(){
        let list = this.$store.state.system.menuList
        list.map(item=>{
          if(item.isActive){
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
        btns:[{
          name:'查询',
          event:this.inquiryUserInfo
        }]
      }
    },
    methods:{
      operateThisRow(index,_index){
        console.log(index,_index)
      },
      changePageSize(size){
        this.$store.dispatch('getMenuList',{nowPage:1,pageSize:size})
      },
      toNextPage(nextPage){
        this.$store.dispatch('getMenuList',{nowPage:nextPage,pageSize:this.menuPageInfo.pageSize})
      },
      inquiryUserInfo(){
        console.log('inquiryUserInfo')
      }
    }
  }
</script>
<style lang="less" scoped>

</style>
