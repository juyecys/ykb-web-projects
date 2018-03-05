/**
 * Created by FuxiaoKe on 2018/3/5.
 */
import * as types from './mutation-type'
import * as rootType from  '../mutation-type'
const mutations = {
  [types.ADMINUSERLISTDATA](state,data){
    console.log(data)
    state.userLists = data.result
    state.usersPageInfo = {
      nowPage:data.nowPage,
      pageSize:data.pageSize,
      totalPage:data.totalPage,
      totalCount:data.totalCount,
      start:data.start
    }
  }
}
export default mutations;
