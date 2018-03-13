/**
 * Created by FuxiaoKe on 2018/3/5.
 */
import * as types from './mutation-type'
import Toast from '../../components/toast'
import * as rootType from  '../mutation-type'
const mutations = {
  /*获取系统用户列表*/
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
  },
  /*获取所有的系统角色*/
  [types.ALLROLELIST](state,data){
    console.log(data)
    state.roleList = data
    console.log(state.roleList)
  },
  /*操作系统用户（新增或编辑）*/
  [types.OPERATESYSTEMUSER](state,data){
    let datas = state.userLists,isAdd=true
    for(let i=datas.length-1;i>=0;i--){
      if(datas[i].id === data.id){
        datas.splice(i,1,data)
        isAdd = false
        break;
      }
    }
    console.log(data)
    if(isAdd){
      datas.unshift(data)
    }
    console.log(datas)
  },
  /*删除选中的系统用户*/
  [types.DELETETHISSYSTEMUSER](state,id){
    let datas = state.userLists
    for(let i=datas.length-1;i>=0;i--){
      if(datas[i].id === id){
        datas.splice(i,1)
        Toast.success({
          msg:'删除系统用户成功！'
        })
        break;
      }
    }
  },
  /*获取系统角色列表*/
  [types.ADMINROLELISTDATA](state,data){
    console.log(data)
    state.roleLists = data.result
    state.rolesPageInfo = {
      nowPage:data.nowPage,
      pageSize:data.pageSize,
      totalPage:data.totalPage,
      totalCount:data.totalCount,
      start:data.start
    }
  },
  /*操作系统角色（新增或编辑）*/
  [types.OPERATESYSTEMROLE](state,data){
    let datas = state.roleLists,isAdd=true
    for(let i=datas.length-1;i>=0;i--){
      if(datas[i].id === data.id){
        datas.splice(i,1,data)
        isAdd = false
        break;
      }
    }
    console.log(data)
    if(isAdd){
      datas.unshift(data)
    }
    console.log(datas)
  },
  /*删除选中的系统角色*/
  [types.DELETETHISSYSTEMROLE](state,id){
    let datas = state.roleLists
    for(let i=datas.length-1;i>=0;i--){
      if(datas[i].id === id){
        datas.splice(i,1)
        Toast.success({
          msg:'删除系统角色成功！'
        })
        break;
      }
    }
  },
  /*获取系统菜单列表*/
  [types.SYSTEMMENULIST](state,data){
    console.log(data)
    state.menuList = data.result
    state.menuPageInfo = {
      nowPage:data.nowPage,
      pageSize:data.pageSize,
      totalPage:data.totalPage,
      totalCount:data.totalCount,
      start:data.start
    }
  },
  [types.CHANGESYSTEMMENU](state,data){
      let menuList = state.menuList
      for(let i=menuList.length-1;i>=0;i--){
        if(menuList[i].id === data.id){
          menuList.splice(i,1,data)
          break;
        }
      }
    },
}


export default mutations;
