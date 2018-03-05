/**
 * Created by FuxiaoKe on 2018/3/5.
 */
import * as types from './mutation-type'
import * as rootTypes from  '../mutation-type'
import axios from 'axios';
console.log(types.ADMINUSERLISTDATA)
export const getAdminUser = ({commit})=>{
  axios.get('/ykb/mg/private/user/')
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
