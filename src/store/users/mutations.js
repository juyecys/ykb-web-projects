/**
 * Created by FuxiaoKe on 2018/3/5.
 */
import * as types from './mutation-type'
const mutations = {
  //获取用户信息
  [types.GETUSERS](state,data){
    state.usersList = data.hasOwnProperty('result')?data.result:[]
    state.usersPageInfo = {
      nowPage:data.nowPage,
      pageSize:data.pageSize,
      start:data.start,
      totalCount:data.totalCount,
      totalPage:data.totalPage
    }
  },
  [types.SEARCHUSERLIST](state,data){
    state.usersList = data.hasOwnProperty('result')?data.result:[]
    state.usersPageInfo = {
      nowPage:data.nowPage,
      pageSize:data.pageSize,
      start:data.start,
      totalCount:data.totalCount,
      totalPage:data.totalPage
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
