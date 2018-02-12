import * as types from '../store/mutation-type';

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
export const addChannel = ({commit},{id,name,code,sendSubscribeMessage,sendChannelMessage}) =>{
  console.log(id,name,code,sendSubscribeMessage,sendChannelMessage)
  commit(types.ADDCHANNEL,{id,name,code,sendSubscribeMessage,sendChannelMessage})
}

export const getChannels = ({commit},{nowPage,pageSize}) =>{
  commit(types.GETCHANNELs,{pageSize,nowPage})
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

//获取用户信息
export const getUsers = ({commit},{nowPage,pageSize}) =>{
  commit(types.GETUSERS,{pageSize,nowPage})
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

export const deleteThisMessage = ({commit},{id,messages}) =>{
  console.log('getWxMessages')
  commit(types.DELETETHISMESSAGE,{id,messages})
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





export const uploadImage = ({commit},{data}) =>{
  commit(types.UPLOADIMAGE,{data})
}












export const toTest = ({commit}) =>{
  commit(types.TEST)
}
