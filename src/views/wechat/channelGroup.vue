<template>
  <div id="channelGroup">
    <operation-btn :btns="btns"></operation-btn>

  </div>
</template>
<script>
  import operationBtn from '../../components/operationBtn'
  import modal from '../../components/modal'
  import itable from '../../components/itable'
  import maskLayer from '../../components/maskLayer'
  export default {
    name:'channelGroup',
    components:{
      operationBtn,modal,itable
    },
    data(){
      return{
        btns:[{
          name:'新增',
          event:this.addChannelGroup
        },{
          name:'查询',
          style:'successBtn',
          event:this.addChannelGroup
        }]
      }
    },
    methods:{
      addChannelGroup(){
        console.log('addChannelGroup')
      }
    }
  }
</script>
<style lang="less" scoped>

</style>
