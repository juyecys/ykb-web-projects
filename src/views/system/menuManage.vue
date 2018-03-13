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
    <modal :show="showEditSystemMenu" title="编辑系统菜单" @makesure="toEditSystemMenu" @cancel="toCancelEditSystemMenu" id="showEditSystemMenu">
      <div class="editSystemMenu">
        <div class="modalItem">
          <div class="itemName">菜单名称</div>
          <div class="itemValue">
            <input type="text" v-model="menuName" placeholder="请输入菜单名称">
          </div>
        </div>
      </div>
      <div class="editSystemMenu">
        <div class="modalItem">
          <div class="itemName">菜单序号</div>
          <div class="itemValue">
            <input type="text" v-model.number="menuSequence" placeholder="请输入菜单序号">
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
        menuName:'',
        menuSequence:0,
        menuId:'',
        showEditSystemMenu:false,
        btns:[{
          name:'查询',
          event:this.inquiryUserInfo
        }]
      }
    },
    methods:{
      toCancelEditSystemMenu(){
        this.showEditSystemMenu = false
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
      inquiryUserInfo(){
        console.log('inquiryUserInfo')
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
</style>
