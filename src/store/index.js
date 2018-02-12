import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import {
  mutations
}
from './mutations'

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
  uploadImageUrl:''
}

export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations
})
