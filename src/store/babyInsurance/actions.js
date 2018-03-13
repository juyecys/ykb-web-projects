/*
*
*Author: Fuxiaoke
*Create Time: 2018-03-13 11:24
*
*/
import * as types from './mutation-type'
import * as rootTypes from  '../mutation-type'
import axios from 'axios';
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
