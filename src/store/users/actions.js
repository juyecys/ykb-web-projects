/**
 * Created by FuxiaoKe on 2018/3/5.
 */

import * as types from './mutation-type'
import * as rootTypes from  '../mutation-type'
import axios from 'axios';
//用户列表，获取用户信息
export const getUsers = ({commit},{nowPage,pageSize}) =>{
  axios.get('/ykb/mg/private/wechatuser/?nowPage='+nowPage+'&pageSize='+pageSize)
    .then((res)=>{
      if(res.data.code === 2000){
        commit(types.GETUSERS,res.data.result)
      }else{
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(rootTypes.ERRORSTATUS,error)
    })
}

//用户列表，获取所有的渠道
export const getAllChannel = ({commit}) =>{
  axios.get('/ykb/mg/private/wechat/qrcode/query')
    .then(res=>{
      console.log(res)
      if(res.data.code === 2000){
        commit(types.ALLCHANNELLIST,res.data.result)
      }else{
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(rootTypes.ERRORSTATUS,error)
    })
}

//用户列表，搜索用户
export const searchUser = ({commit},data) =>{
  axios.get('/ykb/mg/private/wechatuser/',{
    params:data
  })
    .then(res=>{
      console.log(res)
      if(res.data.code === 2000){
        commit(types.SEARCHUSERLIST,res.data.result)
      }else{
        commit(types.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(types.ERRORSTATUS,error)
    })
}

//渠道二维码，获取所有的渠道分组
export const getAllChannelGroup = ({commit}) =>{
  axios.get('/ykb/mg/private/channelgroup/query')
    .then(res=>{
      console.log(res)
      if(res.data.code === 2000){
        commit(types.ALLCHANNELGROUPLIST,res.data.result)
      }else{
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(rootTypes.ERRORSTATUS,error)
    })
}
