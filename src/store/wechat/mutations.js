/**
 * Created by FuxiaoKe on 2018/3/5.
 */
import * as types from './mutation-type';
import Toast from '../../components/toast';
const mutations = {
//渠道二维码增删改查
  [types.ADDCHANNEL](state, data){
    console.log(data, '-----------------')
    let isAdd = true
    let qrcodeResults = state.qrcodeResults
    for (let i = qrcodeResults.length - 1; i >= 0; i--) {
      if (data.id === qrcodeResults[i].id) {
        state.qrcodeResults.splice(i, 1, data)
        Toast.success({
          msg: '渠道二维码信息已经修改了'
        })
        isAdd = false
        break;
      }
    }
    if(isAdd){
      state.qrcodePageInfo.totalCount++
      state.qrcodeResults.unshift(data)
      Toast.success({
        msg: '渠道二维码信息已经添加了'
      })
    }
  },
  [types.GETCHANNELs](state, data){
    let result = data.result
    state.qrcodeResults = []
    state.qrcodePageInfo = {
      nowPage: data.nowPage,
      pageSize: data.pageSize,
      start: data.start,
      totalCount: data.totalCount,
      totalPage: data.totalPage
    }
    console.log(data)
    for (let i = 0, len = result.length; i < len; i++) {
      state.qrcodeResults.push(result[i])
    }
  },
  //渠道二维码，获取所有的渠道分组
  [types.ALLCHANNELGROUPLIST](state, data){
    console.log(data)
    state.allChannelGroupList = data
  },
//渠道二维码，获取该渠道用户关注数

  [types.SETQRCODECOUNT](state, count){
    state.thisQrcodePersonalCount = count
  },
  /*获取该渠道扫码后的微信发送的消息*/
  [types.GETTHISCHANNELWXMESSAGE](state, data){
    let obj = {
      type: data.type,
      typeName: '',
      msg_type: '',
      canEdit: true,
      imgUrl: '',
      article_list: [{
        title: "",
        description: "",
        url: "",
        pic_url: ""
      }],
      radioData: [{
        name: '开启',
        value: true,
        status: true
      }, {
        name: '关闭',
        value: false,
        status: false
      }]
    }
    for (let i = data.length - 1; i >= 0; i--) {
      data[i].canEdit = false
      data[i] = Object.assign({}, obj, data[i])
    }
    state.channelWxMessages = data
    console.log(state.channelWxMessages)
  },

//微信菜单增删改查,生成菜单
  [types.ADDWXMENU](state, data){
    state.wxMenuResults.push(data)
    state.wxMenuPageInfo.totalCount++
    Toast.success({
      msg: '新增菜单成功！'
    })
  },
  [types.DELETEWXMENU](state, id){
    Toast.success({
      msg: '删除微信菜单成功'
    })
    let wxMenuResults = state.wxMenuResults
    for (let i = wxMenuResults.length - 1; i >= 0; i--) {
      if (wxMenuResults[i].id === id) {
        wxMenuResults.splice(i, 1)
        state.wxMenuPageInfo.totalCount--
        break;
      }
    }
  },
  [types.EDITWXMENU](state, data){
    let wxMenuResults = state.wxMenuResults
    for (let i = wxMenuResults.length - 1; i >= 0; i--) {
      if (wxMenuResults[i].id === data.id) {
        wxMenuResults.splice(i, 1, data)
        Toast.success({
          msg: '修改菜单成功！'
        })
        break;
      }
    }
  },
  [types.GETWXMENU](state, data){
    let result = data.result
    state.wxMenuResults = []
    state.wxMenuPageInfo = {
      nowPage: data.nowPage,
      pageSize: data.pageSize,
      start: data.start,
      totalCount: data.totalCount,
      totalPage: data.totalPage
    }
    console.log(state.wxMenuPageInfo,data)
    for (let i = 0, len = result.length; i < len; i++) {
      state.wxMenuResults.push(result[i])
    }
    console.log(state.wxMenuResults)
  },
  [types.MAKEMENU](state){
    Toast.success({
      msg: '生成菜单成功啦'
    })
  },
  /*关注公众号后消息操作*/
  [types.SAVETHISMESSAGE](state,data){
    let wxMessages =data.type==='CHANNEL'?state.channelWxMessages: state.wxMessages,isNew = true
    for(let i=wxMessages.length-1;i>=0;i--){
      if(wxMessages[i].id === data.id){
        wxMessages.splice(i,1,data)
        isNew = false
        break;
      }
    }
    console.log(wxMessages,isNew,data)
    if(isNew){
      wxMessages.push(data)
    }
    console.log(wxMessages,isNew)
  },
  [types.GETWXMESSAGES](state,data){
    let obj = {
      type:data.type,
      typeName:'',
      msg_type:'',
      canEdit:true,
      imgUrl:'',
      article_list:[{
        title:"",
        description:"",
        url:"",
        pic_url:""
      }],
      radioData:[{
        name:'开启',
        value:true,
        status:true
      },{
        name:'关闭',
        value:false,
        status:false
      }]
    }
    for(let i=data.length-1;i>=0;i--){
      data[i].canEdit = false
      data[i] = Object.assign({},obj,data[i])
    }
    state.wxMessages = data

    console.log(state.wxMessages)
  },
  [types.DELETETHISMESSAGE](state,{id,channel}){
    let messages = channel==='CHANNEL'?state.channelWxMessages:state.wxMessages
    for(let i=messages.length-1;i>=0;i--){
      if(messages[i].id === id){
        messages.splice(i,1)
        Toast.success({
          msg:'删除消息成功！'
        })
        console.log(messages,'delete')
        break;
      }
    }
  },
  /*查询测试关注公众号后发送消息的人的openid*/
  [types.CHECKOUTUSER](state,data){
    if(res.data.result.length >0){
      state.testMessagesPeople = data[0].nick_name
    }else{
      Toast.error({
        msg:'没找到对应的openId的微信用户'
      })
    }
  },
  /*发送关注公众号后的消息给测试人员*/
  [types.TOSENDMESSAGETOSOMEONE](state){
    Toast.success({
      msg:'发送消息成功！'
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
}
export default mutations;
