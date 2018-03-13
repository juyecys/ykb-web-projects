/*
*
*Author: Fuxiaoke
*Create Time: 2018-03-13 11:24
*
*/
import * as types from './mutation-type'
const mutations = {
  [types.BABYINSURANCEORDERLIST](state,data){
    state.orderList = data.result
    state.orderPageInfo = {
      nowPage:data.nowPage,
      pageSize:data.pageSize,
      totalPage:data.totalPage,
      totalCount:data.totalCount,
      start:data.start
    }
  },
}

export default mutations;
