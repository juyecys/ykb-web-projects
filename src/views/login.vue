<template>
  <div id="login">
    <div class="login">
      <p>欢迎登录易康保管理后台</p>
      <input type="text" placeholder="请输入您的账号" name="" id="user" v-model="user">
      <input :type="isshowpsw?'text':'password'" placeholder="请输入您的密码" name="" id="passwd" v-model="passwd">
      <i class="passwdIcon" @click="showpsw"><img :src="isshowpsw?'static/images/showpsw.png':'static/images/hidepsw.png'" alt=""></i>
      <div class="loginsys" @click="toLogin">
        登录
      </div>
    </div>
  </div>
</template>

<script>
  import Toast from '../components/toast'
  export default {
    name:'login',
    data(){
      return {
        user:'',
        passwd:'',
        isshowpsw:false
      }
    },
    computed:{
      hadLogin(){
        return this.$store.state.hadLogin
      }
    },
    methods:{
      showpsw(){
        console.log(this.isshowpsw)
        this.isshowpsw = !this.isshowpsw
      },
      toLogin(){
        if(this.user !== '' && this.passwd !== ''){
          this.$store.dispatch('toLogin',{user:this.user,passwd:this.passwd,cb:(state=true)=>{
            if(state){
              console.log(window.sessionStorage.getItem('loginToPage'))
              this.$store.dispatch('getUserMenuList',{nowPage:1,pageSize:100})
              if(window.sessionStorage.getItem('loginToPage') !== null && window.sessionStorage.getItem('loginToPage')!==''){
                this.$router.push({
                  name:window.sessionStorage.getItem('loginToPage')
                })
                window.sessionStorage.setItem('loginToPage','')
              }else{
                this.$router.push({
                  name:'index'
                })
              }

            }else{
              Toast.error({
                msg:'可能是账号或者密码错误了哦'
              })
            }
          }})
        }else{
          alert('请正确输入账号和密码！')
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  #login{
    .login{
      width:500px;
      height:250px;
      background-color:#fff;
      margin:150px auto;
      border-radius:5px;
      box-shadow: 15px -10px 20px #ccc;
      position:relative;
      p{
        text-align: center;
        padding:10px 0;
        color:#fd9627;
        font-size: 18px;
        margin:0;
      }
      input{
        display: block;
        margin:10px auto;
        width:250px;
        height:32px;
        outline: none;
        border:none;
        border-bottom:1px solid #ccc;
        font-size: 14px;
        padding-right:40px;
      }
      .passwdIcon{
        position:absolute;
        right:130px;
        margin-top:-40px;
        cursor:pointer;
        img{
          width:24px;
          height:24px;
        }
      }
      .loginsys{
        width:250px;
        height:30px;
        line-height:30px;
        text-align: center;
        border:1px solid #1296db;
        margin:30px auto;
        color:#333;
        border-radius:5px;
        cursor:pointer;
        color:#1296db;
        transition:color .5s ease,background-color .5s ease;
      }
      .loginsys:hover{
        background-color:#1296db;
        color:#fff;
      }
    }
  }
</style>
