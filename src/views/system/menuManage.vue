<template>
  <div class="menuManage">
    <operationBtn :btns="btns"></operationBtn>
  </div>
</template>
<script>
  import operationBtn from '../../components/operationBtn'
  export default {
    name:'menuManage',
    components:{
      operationBtn
    },
    data(){
      return {
        btns:[{
          name:'查询',
          event:this.inquiryUserInfo()
        }]
      }
    },
    methods:{
      inquiryUserInfo(){
        console.log('inquiryUserInfo')
      }
    }
  }
</script>
<style lang="less" scoped>

</style>
