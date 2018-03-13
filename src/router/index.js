import Vue from 'vue'
import Router from 'vue-router'
import Index from '../views/index'
import Login from '../views/login'
//wechat
import ChannelGroup from '../views/wechat/channelGroup'
import ChannelQrcode from '../views/wechat/channelQrcode'
import ChannelUsers from '../views/wechat/channelUsers'
import Wxmenu from '../views/wechat/wxmenu'
import MessageForWxFollow from '../views/wechat/messageForWxFollow'
//system
import Authority from '../views/system/authority';
import menuManage from '../views/system/menuManage';
import Role from '../views/system/role';
import Users from '../views/system/users';
//user
import UsersInfo from '../views/users/usersInfo';
//babyInsurance
import OrderList from '../views/babyInsurance/orderList';
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: { name: 'login' }
    },
    {
      path: '/index',
      name: 'index',
      component: Index
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/wechat/channelGroup',
      name: 'channelGroup',
      component: ChannelGroup
    },
    {
      path: '/wechat/wxmenu',
      name: 'wxmenu',
      component: Wxmenu
    },
    {
      path: '/wechat/channelQrcode',
      name: 'channelQrcode',
      component: ChannelQrcode
    },
    {
      path: '/wechat/channelUsers',
      name: 'channelUsers',
      component: ChannelUsers
    },
    {
      path: '/wechat/messageForWxFollow',
      name: 'messageForWxFollow',
      component: MessageForWxFollow
    },
    {
      path: '/system/authority',
      name: 'authority',
      component: Authority
    },
    {
      path: '/system/menuManage',
      name: 'menuManage',
      component: menuManage
    },
    {
      path: '/system/role',
      name: 'role',
      component: Role
    },
    {
      path: '/system/users',
      name: 'users',
      component: Users
    },
    {
      path: '/users/usersInfo',
      name: 'usersInfo',
      component: UsersInfo
    },
    {
      path: '/babyInsurance/orderList',
      name: 'orderList',
      component: OrderList
    }
  ]
})
