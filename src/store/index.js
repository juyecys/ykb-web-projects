import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import {
  mutations
}
from './mutations'

import wechatModule from './wechat/index';
import systemModule from './system/index';
import usersModule from './users/index';
import babyInsuranceModule from './babyInsurance/index';

Vue.use(Vuex)

console.log(mutations)

const state = {
  direction: 'forward',
  pathName:'',
  miniMenu:false,
  miniMenuWidth:'50px',
  largeMenuWidth:'200px',
  hadLogin:false,

  clickOver:true,
  userMenuList:[],//获取该用户拥有权限的菜单列表
  provinceList:[]
}

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  modules: {
    wechat:wechatModule,
    system:systemModule,
    users:usersModule,
    babyInsurance:babyInsuranceModule
  }
})
