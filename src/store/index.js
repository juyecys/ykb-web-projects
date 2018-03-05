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

Vue.use(Vuex)

console.log(mutations)

const state = {
  direction: 'forward',
  pathName:'',
  miniMenu:false,
  miniMenuWidth:'50px',
  largeMenuWidth:'200px',
  hadLogin:false,
  usersInfos:{
    usersResults:[],
    usersPageInfo:{}
  },
  qrcodeInfos:{
    qrcodeResults:[],
    qrcodePageInfo:{}
  },
  wxMenuInfos:{
    wxMenuResults:[],
    wxMenuPageInfo:{}
  },
  wxMessages:[],
  channelWxMessages:[],
  testMessagesPeople:'',
  uploadImageUrl:'',
  channelGroupList:{
    result:[],
    pageInfo:[]
  },
  thisChannelGroupList:[],
  allChannelGroupList:[],
  allChannelList:[],
  thisQrcodePersonalCount:0,

  clickOver:true

}

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations,
  modules: {
    wechat:wechatModule,
    system:systemModule,
    users:usersModule
  }
})
