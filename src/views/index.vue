<template>
  <div id="index">
    <div class="welcome">
      <p>欢迎进入易康保后台管理系统</p>
      <img src="../../static/images/123.gif" alt="">
    </div>

  </div>
</template>

<script>
  import chart from '../components/chart'
  import modal from '../components/modal'
  import searchInput from '../components/searchInput'
  import choice from '../components/choice'
  import Toast from '../components/toast.js'
  export default {
    name:'index',
    components:{
      chart,modal,searchInput,choice
    },
    computed:{
      dateValue(){
        if(this.dateObj === null) {
          return null
        }
        return new Date(this.dateObj.start).toLocaleDateString() + '-' + new Date(this.dateObj.end).toLocaleDateString()
      }
    },
    data(){
      return {
        radioValue:'',
        checkboxValue:[],
        switchBool:false,
        radioDatas1:[{
          name:'张三',
          value:'zhangsan'
        },{
          name:'李四',
          value:'lisi'
        },{
          name:'钱五',
          value:'qianwu'
        },{
          name:'小二',
          value:'xiaoer'
        }],
        radioDatas:[{
          name:'张三',
          value:'zhangsan'
        },{
          name:'李四',
          value:'lisi'
        },{
          name:'钱五',
          value:'qianwu'
        },{
          name:'小二',
          value:'xiaoer'
        }],
        dateObj:null,
        showModal:false,
        inputValue:'',
        chartsData: {
          options:{
            select:false
          },
          chartHeader: [
              {
                  index:0,
                  key:'id',
                  value: 'ID',
                  width: '20%'
              },
              {
                  index:1,
                  key:'name',
                  value: '名称',
                  width: '30%'
              },
              {
                  index:2,
                  key:'phone',
                  value: '电话',
                  width: '20%'
              },
              {
                  index:3,
                  key:'time',
                  value: '时间',
                  width: '10%'
              }
          ],
          chartLists: [{ id:'1',
                   name:'haha',
                   phone:'15622316910',
                   time:'2017-11-11',
                   checkbox:{
                    disabled:false,
                    checked:false
                   }
                 },{ id:'2',
                   name:'hehe',
                   phone:'15622316952',
                   time:'2017-11-18',
                   checkbox:{
                    disabled:false,
                    checked:false
                   }
                 }],
          actions:[{
            type:'delete',
            text:'删除',
            func:(row)=>{
              this.a(row)
            }
          },{
            type:'edit',
            text:'编辑',
            func:(row)=>{
              this.b(row)
            }
          }]
        },
      }
    },
    methods:{
      choiceChange(type,index,name,item){
        console.log(type,index,name,item)
      },
      cleanDate(){
        this.dateObj = null
      },
      cd(){
        console.log(this.dateObj)
      },
      a(row){
        console.log(event,row)
      },
      b(row){
        console.log(row)
      },
      c(row){
        console.log(row)
      },
      makesure(){
        console.log('makesure')
      },
      cancel(){
        console.log('cancel')
      }
    },
    mounted(){
      //Toast.success({msg:'成功操作了成功操作了',duration:3000})
      //Toast.error({msg:'发生了一些未知的错误',duration:4000})
      //Toast.normal({msg:'普通操作',duration:5000})
      //this.showModal = true
      //this.$store.dispatch('toTest')
      this.$store.dispatch('changePathName','/首页')
    }
  }
</script>

<style lang="less" scoped>
  #index{
    .welcome{
      margin:100px auto;
      text-align: center;
      font-size:40px;
      color:#333;
      img{
        border-radius:5px;
      }
    }

  }
</style>
