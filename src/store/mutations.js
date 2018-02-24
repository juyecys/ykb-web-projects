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
  [types.ERRORCODE](state,{error,code}){
    Toast.error({msg:error})
    if(code === "4001"){
      router.push({
        name:'login'
      })
    }
  },
  [types.ERRORSTATUS](state,error){
    Toast.error({msg:error})
  },

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
  [types.ADDCHANNEL](state,{id,channel_group_id,channel_group_name,name,code,sendSubscribeMessage,sendChannelMessage}){
    console.log(id,channel_group_id,channel_group_name,name,code,sendSubscribeMessage,sendChannelMessage)
    let data = {
      channels:name,
      send_subscribe_message:sendSubscribeMessage,
      send_channel_message:sendChannelMessage
    },isadd = true
    if(channel_group_id !== ''){
      data.channel_group_id = channel_group_id
      data.channel_group_name = channel_group_name
    }
    if(code !== ''){
      data.scene = code
    }
    if(id !== ''){
      data.id = id
      isadd = false
    }
    console.log(state,'-----------------')
    axios.post('/ykb/mg/private/wechat/qrcode',data)
      .then((res)=>{
        if(res.data.code === 2000){
          console.log(res.data)
          let results = res.data.result
          if(isadd){
            state.qrcodeInfos.qrcodePageInfo.totalCount++
            state.qrcodeInfos.qrcodeResults.push(results)
            Toast.success({
              msg:'渠道二维码信息已经添加了'
            })
          }else{
            let qrcodeResults = state.qrcodeInfos.qrcodeResults
            for(let i=qrcodeResults.length-1;i>=0;i--){
              if(results.id === qrcodeResults[i].id ){
                state.qrcodeInfos.qrcodeResults.splice(i,1,results)
                Toast.success({
                  msg:'渠道二维码信息已经修改了'
                })
                break;
              }
            }
          }
        }else{
          withNoAuthority(res.data.code+" "+res.data.desc,res.data.code)
        }
      }).catch((error)=>{
        console.log(error)
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
  //渠道二维码，获取所有的渠道分组
  [types.ALLCHANNELGROUPLIST](state,data){
    console.log(data)
    state.allChannelGroupList = data
  },

  /*获取该渠道扫码后的微信发送的消息*/
  [types.GETTHISCHANNELWXMESSAGE](state,{type,scene}){
    axios.get('/ykb/mg/private/message/?type='+type+'&qrCodeScene='+scene)
      .then(res=>{
        if(res.data.code === 2000){
          console.log(res)
          state.channelWxMessages = res.data.result
          console.log(state.channelWxMessages)
        }else{
          withNoAuthority(res.data.code+" "+res.data.desc,res.data.code)
        }
      })
      .catch(error=>{
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
          Toast.success({
            msg:'新增菜单成功！'
          })
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
              Toast.success({
                msg:'修改菜单成功！'
              })
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

  /*关注公众号后消息操作*/
  [types.SAVETHISMESSAGE](state,{obj}){
    console.log(obj,'-----------------')
    axios.post('/ykb/mg/private/message/',obj)
         .then(res=>{
           if(res.data.code === 2000){
             console.log(res)
           }else{
             withNoAuthority(res.data.code+" "+res.data.desc,res.data.code)
           }
         })
      .catch(error=>{
        withNoAuthority(error,state.hadLogin)
      })
  },
  [types.GETWXMESSAGES](state,type){
    axios.get('/ykb/mg/private/message/?type='+type)
      .then(res=>{
        if(res.data.code === 2000){
          console.log(res)
          state.wxMessages = res.data.result
          console.log(state.wxMessages)
        }else{
          withNoAuthority(res.data.code+" "+res.data.desc,res.data.code)
        }
      })
      .catch(error=>{
        withNoAuthority(error,state.hadLogin)
      })
  },
  [types.DELETETHISMESSAGE](state,{id,messages}){
    axios.post('/ykb/mg/private/message/delete',{id:id})
      .then(res=>{
        if(res.data.code === 2000){
          for(let i=messages.length-1;i>=0;i--){
            if(messages[i].id === id){
              messages.splice(i,1)
              Toast.success({
                msg:'删除消息成功！'
              })
              break;
            }
          }
        }else{
          withNoAuthority(res.data.code+" "+res.data.desc,res.data.code)
        }
      })
      .catch(error=>{
        withNoAuthority(error,state.hadLogin)
      })
  },

  /*查询测试关注公众号后发送消息的人的openid*/
  [types.CHECKOUTUSER](state,open_id){
    axios.get('/ykb/mg/private/user/?openId='+open_id)
         .then(res=>{
           console.log(res)
           if(res.data.code === 2000){
             if(res.data.result.length >0){
               state.testMessagesPeople = res.data.result[0].nick_name
             }else{
               Toast.error({
                 msg:'没找到对应的openId的微信用户'
               })
             }
           }
         })
  },
/*发送关注公众号后的消息给测试人员*/
  [types.TOSENDMESSAGETOSOMEONE](state,{open_id,type,qr_code_scene}){
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
          console.log(res)
          Toast.success({
            msg:'发送消息成功！'
          })
        }else{
          withNoAuthority(res.data.code+" "+res.data.desc,res.data.code)
        }
      })
      .catch(error=>{
        withNoAuthority(error,state.hadLogin)
      })
  },
//渠道分组，获取渠道分组列表
  [types.GETCHANNELGROUP](state,data){
    console.log(data)
    state.channelGroupList.result = data.result
    state.channelGroupList.pageInfo = {
      nowPage:data.nowPage,
      pageSize:data.pageSize,
      start:data.start,
      totalCount:data.totalCount,
      totalPage:data.totalPage
    }
  },
//渠道分组，新增渠道分组
  [types.ADDCHANNELGROUP](state,data){
    console.log(data)
    state.channelGroupList.result.unshift(data)
    state.channelGroupList.pageInfo = {
      nowPage:data.nowPage,
      pageSize:data.pageSize,
      start:data.start,
      totalCount:data.totalCount,
      totalPage:data.totalPage
    }
  },
  //渠道分组，编辑渠道分组
  [types.EDITCHANNELGROUP](state,data){
    console.log(data)
    let result  = state.channelGroupList.result
    for(let i=result.length-1;i>=0;i--){
      if(result[i].id === data.id){
        result.splice(i,1,data)
        Toast.success({
          msg:'修改渠道分组信息成功'
        })
        break;
      }
    }
  },
  //渠道分组，编辑渠道分组
  [types.GETTHISCHANNELGROUPLIST](state,data){
    console.log(data,'GETTHISCHANNELGROUPLIST')
    state.thisChannelGroupList = data
  },

  /*上传图片*/
  [types.UPLOADIMAGE](state,{data}){
    axios.post('/ykb/mg/private/file/upload',data)
         .then(res=>{
            console.log(res)
           if(res.data.code === 2000){
              state.uploadImageUrl = res.data.result
           }else{
             withNoAuthority(res.data.code+" "+res.data.desc,res.data.code)
           }

         })
         .catch(error=>{
            console.log(error)
           withNoAuthority(error,state.hadLogin)
         })
  },
}
