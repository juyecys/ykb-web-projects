import * as types from './mutation-type'
import axios from 'axios';
import router from '../router';
import Toast from '../components/toast';

let withNoAuthority = (error,errorCode)=>{
  Toast.error({msg:error})
  if(errorCode === "4001"){
    router.push({
      name:'login'
    })
  }
  console.log(router.history.current.name)
}
export const mutations = {
  [types.BTNCLICKING](state){
    state.clickOver = false
  },
  [types.BTNCLICKOVER](state){
    state.clickOver = true
  },
  [types.ERRORCODE](state,{error,code}){
    Toast.error({msg:error})
    if(code === "4001"){
      router.push({
        name:'login'
      })
    }
  },
  [types.ERRORSTATUS](state,error){
    Toast.error({msg:error})
  },

  //[type.xxx](state,{params}){}
  [types.PATHNAME](state,{name}){
    state.pathName = name
    let titles = name.split('/');
    if(titles.length>=3){
      document.title= '易康保 - '+titles[2]
    }else if(titles.length>1){
      document.title= '易康保 - '+titles[1]
    }

  },
  [types.MINIMENU](state){
    console.log(state.miniMenu)
    state.miniMenu = !state.miniMenu
  },
  [types.TOLOGIN](state,{user,passwd,cb}){
    axios.post('/ykb/mg/public/user/login',{name:user,password:''+passwd})
       .then((res)=>{
          if(res.data.code === 2000){
            state.hadLogin = true
            typeof cb === 'function' && cb(true)
          }else{
            typeof cb === 'function' && cb(false)
          }
       }).catch((error)=>{
          withNoAuthority(error,state.hadLogin)
        })
  },
  /*获取系统菜单列表*/
  [types.USERMENULIST](state,data){
    console.log(data)
    state.userMenuList = data.result
  },

  /*上传图片*/
  [types.UPLOADIMAGE](state,{data}){
    axios.post('/ykb/mg/private/file/upload',data)
         .then(res=>{
            console.log(res)
           if(res.data.code === 2000){
              state.uploadImageUrl = res.data.result
           }else{
             withNoAuthority(res.data.code+" "+res.data.desc,res.data.code)
           }

         })
         .catch(error=>{
            console.log(error)
           withNoAuthority(error,state.hadLogin)
         })
  },
}
