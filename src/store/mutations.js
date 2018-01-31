import * as types from './mutation-type'
import axios from 'axios';
import router from '../router';
import Toast from '../components/toast';

let withNoAuthority = (error,errorCode)=>{
  Toast.error({msg:error})
  if(errorCode === "4001"){
    router.push({
      name:'login'
    })
  }
  console.log(router.history.current.name)
}
export const mutations = {
  //[type.xxx](state,{params}){}
  [types.PATHNAME](state,{name}){
    state.pathName = name
    let titles = name.split('/');

    if(titles.length>=3){
      document.title= '易康保 - '+titles[2]
    }else if(titles.length>1){
      document.title= '易康保 - '+titles[1]
    }

  },
  [types.MINIMENU](state){
    console.log(state.miniMenu)
    state.miniMenu = !state.miniMenu
  },
  [types.TOLOGIN](state,{user,passwd,cb}){
    axios.post('/ykb/mg/public/user/login',{name:user,password:''+passwd})
       .then((res)=>{
          if(res.data.code === 2000){
            state.hadLogin = true
            typeof cb === 'function' && cb(true)
          }else{
            typeof cb === 'function' && cb(false)
          }
       }).catch((error)=>{
          withNoAuthority(error,state.hadLogin)
        })
  },
  //渠道二维码增删改查
  [types.ADDCHANNEL](state,{name,code}){
    axios.post('/ykb/mg/private/wechat/qrcode',{channels:name,scene:code})
      .then((res)=>{
        if(res.data.code === 2000){
          console.log(res.data)
          let results = res.data.result
          state.qrcodeInfos.qrcodeResults.push(res.data.result)
          state.qrcodeInfos.qrcodePageInfo.totalCount++
        }else{
          withNoAuthority(res.data.code+" "+res.data.desc,res.data.code)
        }
      }).catch((error)=>{
      withNoAuthority(error,state.hadLogin)
    })
  },
  [types.GETCHANNELs](state,{nowPage,pageSize}){
    axios.get('/ykb/mg/private/wechat/qrcode/?page.nowPage='+nowPage+'&page.pageSize='+pageSize)
      .then((res)=>{
        if(res.data.code === 2000){
          console.log(res.data)
          let results = res.data.result,
              result = results.result
          state.qrcodeInfos.qrcodeResults = []
          state.qrcodeInfos.qrcodePageInfo = {
            nowPage:results.nowPage,
            pageSize:results.pageSize,
            start:results.start,
            totalCount:results.totalCount,
            totalPage:results.totalPage
          }
          for(let i=0,len=result.length;i<len;i++){
            state.qrcodeInfos.qrcodeResults.push(result[i])
          }
        }else{
          withNoAuthority(res.data.code+" "+res.data.desc,res.data.code)
        }
      }).catch((error)=>{
      withNoAuthority(error,state.hadLogin)
    })
  },

  //微信菜单增删改查,生成菜单
  [types.ADDWXMENU](state,{datas}){
    axios.post('/ykb/mg/private/wechat/menu',datas)
      .then((res)=>{
        if(res.data.code === 2000){
          state.wxMenuInfos.wxMenuResults.push(res.data.result)
          state.wxMenuInfos.wxMenuPageInfo.totalCount++
          //window.refl
        }else{
          withNoAuthority(res.data.code+" "+res.data.desc,res.data.code)
        }
      }).catch((error)=>{
      withNoAuthority(error,state.hadLogin)
    })
  },
  [types.DELETEWXMENU](state,id){
    axios.post('/ykb/mg/private/wechat/menu/delete',id)
      .then((res)=>{
        if(res.data.code === 2000){
          Toast.success({
            msg:'删除微信菜单成功'
          })
          let wxMenuResults  = state.wxMenuInfos.wxMenuResults
          for(let i=wxMenuResults.length-1;i>=0;i--){
            if(wxMenuResults[i].id === id){
              wxMenuResults.splice(i,1)
              state.wxMenuInfos.wxMenuPageInfo.totalCount--
              break;
            }
          }
        }else{
          withNoAuthority(res.data.code+" "+res.data.desc,res.data.code)
        }
      }).catch((error)=>{
      withNoAuthority(error,state.hadLogin)
    })
  },
  [types.EDITWXMENU](state,{datas}){
    axios.post('/ykb/mg/private/wechat/menu',datas)
      .then((res)=>{
        if(res.data.code === 2000){
          let wxMenuResults  = state.wxMenuInfos.wxMenuResults
          for(let i=wxMenuResults.length-1;i>=0;i--){
            if(wxMenuResults[i].id === res.data.result.id){
              wxMenuResults.splice(i,1,res.data.result)
              break;
            }
          }
        }else{
          withNoAuthority(res.data.code+" "+res.data.desc,res.data.code)
        }
      }).catch((error)=>{
      withNoAuthority(error,state.hadLogin)
    })
  },
  [types.GETWXMENU](state,{nowPage,pageSize}){
    axios.get('/ykb/mg/private/wechat/menu?page.nowPage='+nowPage+'&page.pageSize='+pageSize)
      .then((res)=>{
        if(res.data.code === 2000){
          console.log(res)
          let results = res.data.result,
            result = results.result
          state.wxMenuInfos.wxMenuResults = []
          state.wxMenuInfos.wxMenuPageInfo={
            nowPage:results.nowPage,
            pageSize:results.pageSize,
            start:results.start,
            totalCount:results.totalCount,
            totalPage:results.totalPage
          }
          console.log(state.wxMenuInfos.wxMenuPageInfo)
          for(let i=0,len=result.length;i<len;i++){
            state.wxMenuInfos.wxMenuResults.push(result[i])
          }
          console.log(state.wxMenuInfos.wxMenuResults)
        }else{
          withNoAuthority(res.data.code+" "+res.data.desc,res.data.code)
        }
      }).catch((error)=>{
      withNoAuthority(error,state.hadLogin)
    })
  },
  [types.MAKEMENU](state){
    axios.get('/ykb/mg/private/wechat/menu/generate')
      .then((res)=>{
        console.log(res)
        if(res.data.code === 2000){
          console.log(res)
          Toast.success({
            msg:'生成菜单成功啦'
          })
          window.sessionStorage.setItem('hadMakeMenu',true)
        }else{
          withNoAuthority(res.data.code+" "+res.data.desc,res.data.code)
        }
      }).catch((error)=>{
      withNoAuthority(error,state.hadLogin)
    })
  },

  //获取用户信息
  [types.GETUSERS](state,{nowPage,pageSize}){
    axios.get('/ykb/mg/private/wechat/qrcode/user?page.nowPage='+nowPage+'&page.pageSize='+pageSize)
      .then((res)=>{
        if(res.data.code === 2000){
          console.log(res.data)
          let results = res.data.result,
              result = results.result
          state.usersInfos.usersResults = []
          state.usersInfos.usersPageInfo = {
            nowPage:results.nowPage,
            pageSize:results.pageSize,
            start:results.start,
            totalCount:results.totalCount,
            totalPage:results.totalPage
          }
          for(let i=0,len=result.length;i<len;i++){
            state.usersInfos.usersResults.push(result[i])
          }
        }else{
          withNoAuthority(res.data.code+" "+res.data.desc,res.data.code)
        }
      }).catch((error)=>{
      withNoAuthority(error,state.hadLogin)
    })
  },
  //测试
  [types.TEST](state){
    axios.get('/ykb/mg/private/user/test')
         .then((res)=>{
            console.log(res)
         }).catch((error)=>{
            withNoAuthority(error,state.hadLogin)
         })
  }
}
