/*
*
*Author: Fuxiaoke
*Create Time: 2018-03-13 11:24
*
*/
import * as types from './mutation-type'
const mutations = {
  //订单列表
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
  //搜索条件
  [types.SEARCHRESULTFORORDER](state,data){
    state.orderList = data.result
    state.orderPageInfo = {
      nowPage:data.nowPage,
      pageSize:data.pageSize,
      totalPage:data.totalPage,
      totalCount:data.totalCount,
      start:data.start
    }
  },
  //投保意向
  [types.LATENTORDERLIST](state,data){
    state.latentOrderList = data.result
    state.latentOrderPageInfo = {
      nowPage:data.nowPage,
      pageSize:data.pageSize,
      totalPage:data.totalPage,
      totalCount:data.totalCount,
      start:data.start
    }
  },
  //修改订单状态以及备注
  [types.CHANGEONEORDERDATA](state,data){
    let orderList = state.orderList
    for(let i=0,len=orderList.length;i<len;i++){
      if(orderList[i].id === data.id){
        orderList.splice(i,1,data)
        break;
      }
    }
  },

}

export default mutations;
