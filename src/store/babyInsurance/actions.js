/*
*
*Author: Fuxiaoke
*Create Time: 2018-03-13 11:24
*
*/
import * as types from './mutation-type'
import * as rootTypes from  '../mutation-type'
import axios from 'axios';
//获取订单列表
export const getBabyInsuranceOrderList = ({commit},{nowPage,pageSize}) =>{
  axios.post('/ykb/mg/private/order/page',{page:{nowPage,pageSize}})
    .then(res=>{
      console.log(res,types)
      if(res.data.code === 2000){
        commit(types.BABYINSURANCEORDERLIST,res.data.result)
      }else{
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(rootTypes.ERRORSTATUS,error)
    })
}
//搜索订单
export const searchOrder = ({commit},obj) =>{
  axios.post('/ykb/mg/private/order/page',obj)
    .then(res=>{
      console.log(res,types)
      if(res.data.code === 2000){
        commit(types.BABYINSURANCEORDERLIST,res.data.result)
      }else{
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(rootTypes.ERRORSTATUS,error)
    })
}
//获取投保意向列表
export const getLatentOrder = ({commit},obj) =>{
  axios.post('/ykb/mg/private/insure/page',{page:obj})
    .then(res=>{
      console.log(res,types)
      if(res.data.code === 2000){
        commit(types.LATENTORDERLIST,res.data.result)
      }else{
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(rootTypes.ERRORSTATUS,error)
    })
}
//获取投保意向列表
export const searchLatentOrder = ({commit},obj) =>{
  axios.post('/ykb/mg/private/insure/page',obj)
    .then(res=>{
      console.log(res,types)
      if(res.data.code === 2000){
        commit(types.LATENTORDERLIST,res.data.result)
      }else{
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(rootTypes.ERRORSTATUS,error)
    })
}
//修改订单状态以及备注
export const editOneOrder = ({commit},obj) =>{
  axios.post('/ykb/mg/private/order/',obj)
    .then(res=>{
      console.log(res,types)
      if(res.data.code === 2000){
        commit(types.CHANGEONEORDERDATA,res.data.result)
      }else{
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(rootTypes.ERRORSTATUS,error)
    })
}
//获取订单日志
export const getThisOrderLog = ({commit},orderNumber) =>{
  console.log(orderNumber)
  axios.get('/ykb/mg/private/order/record?orderNumber='+orderNumber)
    .then(res=>{
      console.log(res,types)
      if(res.data.code === 2000){
        commit(types.ORDERLOGLIST,res.data.result)
      }else{
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(rootTypes.ERRORSTATUS,error)
    })
}







