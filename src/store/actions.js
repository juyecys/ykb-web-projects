import * as types from '../store/mutation-type';
import axios from 'axios';
export const changePathName = ({commit},name) =>{
  console.log(name)
  commit(types.PATHNAME,{name})
}
export const changeMiniMenu = ({commit}) =>{
  console.log('---=-=-=')
  commit(types.MINIMENU)
}

export const toLogin = ({commit},{user,passwd,cb}) =>{
  console.log(user,passwd,cb)
  commit(types.TOLOGIN,{user,passwd,cb})
}

export const btnClicking = ({commit})=>{
  commit(types.BTNCLICKING)
}

export const btnClickOver = ({commit})=>{
  commit(types.BTNCLICKOVER  )
}

export const uploadImage = ({commit},{data}) =>{
  commit(types.UPLOADIMAGE,{data})
}

export const getUserMenuList = ({commit},{nowPage,pageSize}) =>{
  axios.get('/ykb/mg/private/menu/?page.nowPage='+nowPage+'&page.pageSize='+pageSize)
    .then(res=>{
      console.log(res,types)
      if(res.data.code === 2000){
        commit(types.USERMENULIST,res.data.result)
      }else{
        commit(types.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(types.ERRORSTATUS,error)
    })
}

export const getProvinceList = ({commit}) =>{
  axios.get('/ykb/mg/private/province/')
    .then(res=>{
      console.log(res,types)
      if(res.data.code === 2000){
        commit(types.PROVINCELIST,res.data.result)
      }else{
        commit(types.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(types.ERRORSTATUS,error)
    })
}

export const toTest = ({commit}) =>{
  commit(types.TEST)
}
