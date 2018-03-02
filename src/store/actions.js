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

//渠道二维码增删改查
export const addChannel = ({commit},{id,channel_group_id,channel_group_name,name,code,sendSubscribeMessage,sendChannelMessage}) =>{
  console.log(id,channel_group_id,channel_group_name,name,code,sendSubscribeMessage,sendChannelMessage)
  commit(types.ADDCHANNEL,{id,channel_group_id,channel_group_name,name,code,sendSubscribeMessage,sendChannelMessage})
}

export const getChannels = ({commit},{nowPage,pageSize}) =>{
  commit(types.GETCHANNELs,{pageSize,nowPage})
}

//渠道二维码，获取所有的渠道分组
export const getAllChannelGroup = ({commit}) =>{
  axios.get('/ykb/mg/private/channelgroup/query')
    .then(res=>{
      console.log(res)
      if(res.data.code === 2000){
        commit(types.ALLCHANNELGROUPLIST,res.data.result)
      }else{
        commit(types.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(types.ERRORSTATUS,error)
    })
}

//渠道二维码，获取该渠道用户关注数
export const getQrcodeCount = ({commit},qrcodeScene) =>{
  axios.get('/ykb/mg/private/user/count?qrCodeScene='+qrcodeScene)
    .then(res=>{
      console.log(res)
      if(res.data.code === 2000){
        commit(types.SETQRCODECOUNT,res.data.result)
      }else{
        commit(types.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(types.ERRORSTATUS,error)
    })
}


//微信菜单增删改查,生成菜单
export const addWXMenu = ({commit},{datas}) =>{
  console.log(datas,'addWXMenu')
  commit(types.ADDWXMENU,{datas})
}

export const deleteWxMenu = ({commit},id) =>{
  console.log(id)
  commit(types.DELETEWXMENU,id)
}

export const editWXMenu = ({commit},{datas}) =>{
  console.log(datas,'addWXMenu')
  commit(types.EDITWXMENU,{datas})
}

export const getWXMenu = ({commit},{nowPage,pageSize}) =>{
  commit(types.GETWXMENU,{pageSize,nowPage})
}

export const makeMenu = ({commit}) =>{
  commit(types.MAKEMENU)
}

/*关注公众号后消息操作*/
export const saveThisMessage = ({commit},{obj}) =>{
  console.log(obj,'saveThisMessage')
  commit(types.SAVETHISMESSAGE,{obj})
}

export const getWxMessages = ({commit},type) =>{
  console.log('getWxMessages',type)
  commit(types.GETWXMESSAGES,type)
}

export const deleteThisMessage = ({commit},{id,channel}) =>{
  console.log('deleteThisMessage')
  commit(types.DELETETHISMESSAGE,{id,channel})
}

//渠道分组，获取渠道分组列表
export const getChannelGroup = ({commit},{nowPage,pageSize}) =>{
  axios.get('/ykb/mg/private/channelgroup/?page.nowPage='+nowPage+'&page.pageSize='+pageSize)
    .then(res=>{
      console.log(res)
      if(res.data.code === 2000){
        commit(types.GETCHANNELGROUP,res.data.result)
      }else{
        commit(types.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(types.ERRORSTATUS,error)
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
        commit(types.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(types.ERRORSTATUS,error)
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
        commit(types.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(types.ERRORSTATUS,error)
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
        commit(types.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(types.ERRORSTATUS,error)
    })
}
//模糊查询渠道分组
export const inquiryChannelGroupInfo = ({commit},name) =>{
  axios.get('/ykb/mg/private/channelgroup/query?name='+name)
    .then(res=>{
      if(res.data.code === 2000){
        commit(types.GETCHANNELGROUP,res.data)
      }else{
        commit(types.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(types.ERRORSTATUS,error)
    })
}


/*查询测试关注公众号后发送消息的人的openid*/
export const checkoutUser = ({commit},open_id) =>{
  commit(types.CHECKOUTUSER,open_id)
}

/*发送关注公众号后的消息给测试人员*/
export const toSendMessageToSomeone = ({commit},{open_id,type,qr_code_scene}) =>{
  commit(types.TOSENDMESSAGETOSOMEONE,{open_id,type,qr_code_scene})
}

export const getThisChannelWxMessage = ({commit},{type,scene}) =>{
  commit(types.GETTHISCHANNELWXMESSAGE,{type,scene})
}

//用户列表，获取用户信息
export const getUsers = ({commit},{nowPage,pageSize}) =>{
  commit(types.GETUSERS,{pageSize,nowPage})
}

//用户列表，获取所有的渠道
export const getAllChannel = ({commit}) =>{
  axios.get('/ykb/mg/private/wechat/qrcode/query')
    .then(res=>{
      console.log(res)
      if(res.data.code === 2000){
        commit(types.ALLCHANNELLIST,res.data.result)
      }else{
        commit(types.ERRORCODE,{error:res.data.desc,code:res.data.code})
      }
    })
    .catch(error=>{
      commit(types.ERRORSTATUS,error)
    })
}
//用户列表，搜索用户
export const searchUser = ({commit},data) =>{
  axios.get('/ykb/mg/private/user/',{
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






export const uploadImage = ({commit},{data}) =>{
  commit(types.UPLOADIMAGE,{data})
}












export const toTest = ({commit}) =>{
  commit(types.TEST)
}
