/**
 * Created by FuxiaoKe on 2018/3/5.
 */
import * as types from './mutation-type';
import * as rootTypes from '../mutation-type';
import axios from 'axios';
import Toast from '../../components/toast';
//渠道二维码增删改查
export const addChannel = ({commit},{id,channel_group_id,channel_group_name,name,code,sendSubscribeMessage,sendChannelMessage}) =>{
  console.log(id,channel_group_id,channel_group_name,name,code,sendSubscribeMessage,sendChannelMessage)
  let data = {
    channels: name,
    send_subscribe_message: sendSubscribeMessage,
    send_channel_message: sendChannelMessage
  }, isadd = true
  if (channel_group_id !== '') {
    data.channel_group_id = channel_group_id
    data.channel_group_name = channel_group_name
  }
  if (code !== '') {
    data.scene = code
  }
  if (id !== '') {
    data.id = id
    isadd = false
  }

  axios.post('/ykb/mg/private/wechat/qrcode', data)
    .then((res) => {
      if (res.data.code === 2000) {
        commit(types.ADDCHANNEL,res.data.result)
      } else {
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch((error) => {
        commit(rootTypes.ERRORSTATUS,error)
  })
}

export const getChannels = ({commit},{nowPage,pageSize}) =>{
  console.log('-----------',nowPage,pageSize)
  axios.get('/ykb/mg/private/wechat/qrcode/?page.nowPage=' + nowPage + '&page.pageSize=' + pageSize)
    .then((res) => {
      if (res.data.code === 2000) {
        console.log(res)
        commit(types.GETCHANNELs,res.data.result)
      } else {
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch((error) => {
    commit(rootTypes.ERRORSTATUS,error)
  })

}

//渠道二维码，获取该渠道用户关注数
export const getQrcodeCount = ({commit},qrcodeScene) =>{
  axios.get('/ykb/mg/private/wechatuser/count?qrCodeScene='+qrcodeScene)
    .then(res=>{
      console.log(res)
      if(res.data.code === 2000){
        commit(types.SETQRCODECOUNT,res.data.result)
      }else{
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(rootTypes.ERRORSTATUS,error)
    })
}

export const inquirySomeone = ({commit},data) =>{
  axios.get('/ykb/mg/private/wechat/qrcode/',{params:data})
    .then(res=>{
      console.log(res)
      if (res.data.code === 2000) {
        commit(types.INQUIRYSOMEONE,res.data.result)
      } else {
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
}
//微信菜单增删改查,生成菜单
export const addWXMenu = ({commit},{datas}) =>{
  console.log(datas,'addWXMenu')
  axios.post('/ykb/mg/private/wechat/menu', datas)
    .then((res) => {
      if (res.data.code === 2000) {
        commit(types.ADDWXMENU,res.data.result)
      } else {
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch((error) => {
      commit(rootTypes.ERRORSTATUS,error)
    })
}

export const deleteWxMenu = ({commit},id) =>{
  console.log(id)
  axios.post('/ykb/mg/private/wechat/menu/delete', {id:id})
    .then((res) => {
      if (res.data.code === 2000) {
        commit(types.DELETEWXMENU,id)
      } else {
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch((error) => {
      commit(rootTypes.ERRORSTATUS,error)
    })


}

export const editWXMenu = ({commit},{datas}) =>{
  console.log(datas,'addWXMenu')
  axios.post('/ykb/mg/private/wechat/menu', datas)
    .then((res) => {
      if (res.data.code === 2000) {
        commit(types.EDITWXMENU,res.data.result)
      } else {
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch((error) => {
      commit(rootTypes.ERRORSTATUS,error)
    })
}

export const getWXMenu = ({commit},{nowPage,pageSize}) =>{
  console.log('--------------',nowPage,pageSize)
  axios.get('/ykb/mg/private/wechat/menu?page.nowPage=' + nowPage + '&page.pageSize=' + pageSize)
    .then((res) => {
      console.log(res)
      if (res.data.code === 2000) {
        commit(types.GETWXMENU,res.data.result)
      } else {
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch((error) => {
      commit(rootTypes.ERRORSTATUS,error)
    })
}

export const makeMenu = ({commit}) =>{
  commit(rootTypes.BTNCLICKING);
  axios.get('/ykb/mg/private/wechat/menu/generate')
    .then((res) => {
      console.log(res)
      if (res.data.code === 2000) {
        //commit(types.MAKEMENU)
        Toast.success({
          msg: '生成菜单成功啦'
        })
        commit(rootTypes.BTNCLICKOVER)
      } else {
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch((error) => {
      commit(rootTypes.ERRORSTATUS,error)
    })

}

/*关注公众号后消息操作*/
export const saveThisMessage = ({commit},{obj}) =>{
  console.log(obj,'saveThisMessage')
  axios.post('/ykb/mg/private/message/',obj)
    .then(res=>{
      if(res.data.code === 2000){
        commit(types.SAVETHISMESSAGE,res.data.result)
      }else{
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(rootTypes.ERRORSTATUS,error)
    })
}

export const getWxMessages = ({commit},type) =>{
  console.log('getWxMessages',type)
  axios.get('/ykb/mg/private/message/?type='+type)
    .then(res=>{
      if(res.data.code === 2000){
        commit(types.GETWXMESSAGES,res.data.result)
      }else{
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(rootTypes.ERRORSTATUS,error)
    })

}

export const deleteThisMessage = ({commit},{id,channel}) =>{
  console.log('deleteThisMessage')
  axios.post('/ykb/mg/private/message/delete',{id:id})
    .then(res=>{
      if(res.data.code === 2000){
        commit(types.DELETETHISMESSAGE,{id,channel})
      }else{
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(rootTypes.ERRORSTATUS,error)
    })


}

//渠道分组，获取渠道分组列表
export const getChannelGroup = ({commit},{nowPage,pageSize}) =>{
  axios.get('/ykb/mg/private/channelgroup/?page.nowPage='+nowPage+'&page.pageSize='+pageSize)
    .then(res=>{
      console.log(res)
      if(res.data.code === 2000){
        commit(types.GETCHANNELGROUP,res.data.result)
      }else{
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(rootTypes.ERRORSTATUS,error)
    })
}
//渠道分组，新增渠道分组
export const addChannelGroup = ({commit},data) =>{
  console.log(data)
  axios.post('/ykb/mg/private/channelgroup/',data)
    .then(res=>{
      console.log(res)
      if(res.data.code === 2000){
        commit(types.ADDCHANNELGROUP,res.data.result)
      }else{
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(rootTypes.ERRORSTATUS,error)
    })
}
//渠道分组，编辑渠道分组
export const editChannelGroup = ({commit},data) =>{
  axios.post('/ykb/mg/private/channelgroup/',data)
    .then(res=>{
      console.log(res)
      if(res.data.code === 2000){
        commit(types.EDITCHANNELGROUP,res.data.result)
      }else{
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(rootTypes.ERRORSTATUS,error)
    })
}
//渠道分组，获取该渠道分组下的渠道信息
export const getThisChannelGroupList = ({commit},{channel_group_id}) =>{
  let url = encodeURI('/ykb/mg/private/wechat/qrcode/query?channelGroupId='+channel_group_id)
  axios.get(url)
    .then(res=>{
      console.log(res)
      if(res.data.code === 2000){
        commit(types.GETTHISCHANNELGROUPLIST,res.data.result)
      }else{
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(rootTypes.ERRORSTATUS,error)
    })
}
//模糊查询渠道分组
export const inquiryChannelGroupInfo = ({commit},name) =>{
  axios.get('/ykb/mg/private/channelgroup/query?name='+name)
    .then(res=>{
      if(res.data.code === 2000){
        commit(types.GETCHANNELGROUP,res.data)
      }else{
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(rootTypes.ERRORSTATUS,error)
    })
}


/*查询测试关注公众号后发送消息的人的openid*/
export const checkoutUser = ({commit},open_id) =>{
  axios.get('/ykb/mg/private/user/query?openId='+open_id)
    .then(res=>{
      console.log(res)
      if(res.data.code === 2000){
        commit(types.CHECKOUTUSER,res.data.result)
      }else{
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(rootTypes.ERRORSTATUS,error)
    })


}

/*发送关注公众号后的消息给测试人员*/
export const toSendMessageToSomeone = ({commit},{open_id,type,qr_code_scene}) =>{
  let data = {
    open_id:open_id,
    type:type
  }
  if(qr_code_scene !== '' ){
    data.qr_code_scene = qr_code_scene
  }
  axios.post('/ykb/mg/private/message/send',data)
    .then(res=>{
      if(res.data.code === 2000){
        Toast.success({
          msg:'发送消息成功！'
        })
        //commit(types.TOSENDMESSAGETOSOMEONE,{open_id,type,qr_code_scene})
      }else{
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(rootTypes.ERRORSTATUS,error)
    })


}

export const getThisChannelWxMessage = ({commit},{type,scene}) =>{
  axios.get('/ykb/mg/private/message/?type=' + type + '&qrCodeScene=' + scene)
    .then(res => {
      if (res.data.code === 2000) {
        commit(types.GETTHISCHANNELWXMESSAGE,res.data.result)
      } else {
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error => {
      commit(rootTypes.ERRORSTATUS,error)
    })
}
export const uploadWxImage = ({commit},{data}) =>{
  axios.post('/ykb/mg/public/material/',data)
    .then(res=>{
      console.log(res,types)
      if(res.data.code === 2000){
        commit(types.UPLOADWXIMAGE,res.data.result)
      }else{
        commit(rootTypes.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(rootTypes.ERRORSTATUS,error)
    })
}

