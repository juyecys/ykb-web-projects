/**
 * Created by FuxiaoKe on 2018/3/5.
 */
import * as types from './mutation-type'
const mutations = {
  //获取用户信息
  [types.GETUSERS](state,data){
    let result = data.result
    state.usersList = []
    state.usersPageInfo = {
      nowPage:data.nowPage,
      pageSize:data.pageSize,
      start:data.start,
      totalCount:data.totalCount,
      totalPage:data.totalPage
    }
    for(let i=0,len=result.length;i<len;i++){
      state.usersList.push(result[i])
    }
  },
  [types.SEARCHUSERLIST](state,data){
    let result = data.result
    state.usersList = []
    state.usersPageInfo = {
      nowPage:data.nowPage,
      pageSize:data.pageSize,
      start:data.start,
      totalCount:data.totalCount,
      totalPage:data.totalPage
    }
    for(let i=0,len=result.length;i<len;i++){
      state.usersList.push(result[i])
    }
  },
  [types.ALLCHANNELLIST](state,data){
    console.log(data)
    state.allChannelList = data
  },
  //渠道二维码，获取所有的渠道分组
  [types.ALLCHANNELGROUPLIST](state, data){
    console.log(data)
    state.allChannelGroupList = data
  },
}

export default  mutations;
