/**
 * Created by FuxiaoKe on 2018/3/5.
 */
import * as types from './mutation-type'
import * as rootTypes from  '../mutation-type'
import axios from 'axios';
console.log(types.ADMINUSERLISTDATA)
/*获取系统用户*/
export const getAdminUser = ({commit},{nowPage,pageSize})=>{
  axios.get('/ykb/mg/private/user/?page.nowPage='+nowPage+'&page.pageSize='+pageSize)
    .then(res=>{
      console.log(res,types)
      if(res.data.code === 2000){
        console.log(types.ADMINUSERLISTDATA)
        commit(types.ADMINUSERLISTDATA,res.data.result)
      }else{
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(rootTypes.ERRORSTATUS,error)
    })
}
/*获取所有的系统角色*/
export const getAllRole = ({commit})=>{
  axios.get('/ykb/mg/private/role/query')
    .then(res=>{
      console.log(res,types)
      if(res.data.code === 2000){
        console.log(types.ADMINUSERLISTDATA)
        commit(types.ALLROLELIST,res.data.result)
      }else{
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(rootTypes.ERRORSTATUS,error)
    })
}
//新增系统用户
export const operateSystemUser = ({commit},obj)=>{
  axios.post('/ykb/mg/private/user/',obj)
    .then(res=>{
      console.log(res,types)
      if(res.data.code === 2000){
        console.log(types.ADMINUSERLISTDATA)
        commit(types.OPERATESYSTEMUSER,res.data.result)
      }else{
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(rootTypes.ERRORSTATUS,error)
    })
}
/*删除选中的系统用户*/
export const deleteThisSystemUser = ({commit},id)=>{
  axios.post('/ykb/mg/private/user/delete?id='+id)
    .then(res=>{
      console.log(res,types)
      if(res.data.code === 2000){
        console.log(types.DELETETHISSYSTEMUSER)
        commit(types.DELETETHISSYSTEMUSER,id)
      }else{
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(rootTypes.ERRORSTATUS,error)
    })
}

//获取系统角色列表
export const getAdminRole = ({commit},{nowPage,pageSize})=>{
  axios.get('/ykb/mg/private/role/?page.nowPage='+nowPage+'&page.pageSize='+pageSize)
    .then(res=>{
      console.log(res,types)
      if(res.data.code === 2000){
        console.log(types.ADMINROLELISTDATA)
        commit(types.ADMINROLELISTDATA,res.data.result)
      }else{
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(rootTypes.ERRORSTATUS,error)
    })
}
//新增系统角色
export const operateSystemRole = ({commit},obj)=>{
  axios.post('/ykb/mg/private/role/',obj)
    .then(res=>{
      console.log(res,types)
      if(res.data.code === 2000){
        console.log(types.ADMINUSERLISTDATA)
        commit(types.OPERATESYSTEMROLE,res.data.result)
      }else{
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(rootTypes.ERRORSTATUS,error)
    })
}
/*删除选中的系统用户*/
export const deleteThisSystemRole = ({commit},id)=>{
  axios.post('/ykb/mg/private/role/delete?id='+id)
    .then(res=>{
      console.log(res,types)
      if(res.data.code === 2000){
        console.log(types.DELETETHISSYSTEMROLE)
        commit(types.DELETETHISSYSTEMROLE,id)
      }else{
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(rootTypes.ERRORSTATUS,error)
    })
}
//获取系统菜单列表
export const getMenuList = ({commit},{nowPage,pageSize})=>{
  axios.get('/ykb/mg/private/menu/?page.nowPage='+nowPage+'&page.pageSize='+pageSize)
    .then(res=>{
      console.log(res,types)
      if(res.data.code === 2000){
        commit(types.SYSTEMMENULIST,res.data.result)
      }else{
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(rootTypes.ERRORSTATUS,error)
    })
}
//编辑系统菜单
export const editSystemMenu = ({dispatch,commit},{id,name,sequence})=>{
  axios.post('/ykb/mg/private/menu/',{id,name,sequence})
    .then(res=>{
      console.log(res,types)
      if(res.data.code === 2000){
        commit(types.CHANGESYSTEMMENU,res.data.result)
        dispatch('getUserMenuList',{nowPage:1,pageSize:100})
      }else{
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(rootTypes.ERRORSTATUS,error)
    })
}
//新增系统菜单
export const addSystemMenu = ({dispatch,commit},obj)=>{
  axios.post('/ykb/mg/private/menu/',obj)
    .then(res=>{
      console.log(res,types)
      if(res.data.code === 2000){
        commit(types.ADDSYSTEMMENU,res.data.result)
        dispatch('getUserMenuList',{nowPage:1,pageSize:100})
      }else{
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(rootTypes.ERRORSTATUS,error)
    })
}











