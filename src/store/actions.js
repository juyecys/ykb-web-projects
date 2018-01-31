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
export const addChannel = ({commit},{name,code}) =>{
  console.log(name,code)
  commit(types.ADDCHANNEL,{name,code})
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






export const toTest = ({commit}) =>{
  commit(types.TEST)
}
