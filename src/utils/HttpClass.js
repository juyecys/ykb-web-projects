/**
 * Created by Administrator on 2017/7/26.
 */
import fetch from '@/utils/fetch'
import Vue from 'vue'
import BaseClass from "./BaseClass";
import { Message } from 'element-ui'

import axios from 'axios';

let COMMON_FALSE = -1
let AlERT_CODE = 201
let AlERT_RETURN_CODE = 202
let AlERT_REFRESH_CODE = 203
let CONFIRM_RETURN_CODE = 211
let OAUTH_CODE = 101
let NO_POWER_CODE = 401

class HttpClass {

  constructor() {
    this.api = null;
    this.errFunc = null;
    this.succFuc = null;
    this.finallyFunc = null;
    this.abnormalCodeFunc = null;
    this.data = null;
    this.isShowLoading = true;
    this.LodingOptions = {};
    this.isEncrypt = true
  }

  defaultAbnormalCodeHandler(res) {
    switch (res.data.code) {
      case COMMON_FALSE:
        Vue.prototype.showToast({
          text: res.data.errmsg,
          type: 'warn'
        });
        break;
      case AlERT_CODE:
        Vue.prototype.showAlert({
          title: '温馨提示',
          content: res.data.errmsg
        });
        break;
      case AlERT_RETURN_CODE:
        Vue.prototype.showAlert({
          title: '温馨提示',
          content: res.data.errmsg,
          buttonText: '返回'
        }, ()=> {
          history.go(-1)
        });
        break;
      case AlERT_REFRESH_CODE:
        Vue.prototype.showAlert({
          title: '温馨提示',
          content: res.data.errmsg,
          buttonText: '刷新'
        }, ()=> {
          window.location.reload()
        });
        break;
      case CONFIRM_RETURN_CODE:
        Vue.prototype.showConfirm({
          title: '温馨提示',
          content: res.data.errmsg
          },() => {
            history.go(-1)
          });
        break;
      case NO_POWER_CODE:
        Vue.prototype.showAlert({
          title: '权限提示',
          content: res.data.errmsg,
          buttonText: '知道了'
        });
        break;

      case OAUTH_CODE:
        Vue.prototype.goAuth(Vue.prototype.LAST_PATH, 'info')
        break;
      default:
        Message({
          message: res.data.desc,
          type: 'warn',
          duration: 1.5 * 1000
        })
        break
    }
  }

  onAbnormalCode(func) {
    this.abnormalCodeFunc = func
  }

  /**
   * 禁用加密
   */
  disableEncrypt() {
    this.isEncrypt = false
  }

  /**
   * 设置请求地址和参数
   * @param api
   * @param data
   * @returns {HttpClass}
   */
  setApi(api, data = {}) {
    if (BaseClass.isNullOrEmpty(api.method)) {
      console.log('ta')
      console.log(data)
      if (api.indexOf('http') != -1) {
        this.api = {
          method: 'POST',
          url: api
        };
      } else {
        this.api = {
          method: 'POST',
          url: api
        };
      }

    } else {
      if (api.url.indexOf('http') != -1) {
        this.api = api
      } else {
        this.api = api;
      }
      this.api = api
    }

    this.data = data
    return this
  }



  /**
   * 禁用加载中
   * @returns {HttpClass}
   */
  disableLoading() {
    this.ElementUI = false
    return this
  }

  /**
   * 设置成功方法
   * @param succ
   * @returns {HttpClass}
   */
  onSucc(succ) {
    this.succFuc = succ
    return this
  }

  /**
   * 设置失败方法
   * @param errorFunc
   * @returns {HttpClass}
   */
  onError(errorFunc) {
    this.errFunc = errorFunc
    return this
  }

  onFinally(finallyFunc) {
    this.finallyFunc = finallyFunc
    return this
  }

  showLoading() {
    this.loadingInstance = Vue.prototype.showLoading({
    })
  }

  hideLoading() {
    Vue.prototype.hideLoading(this.loadingInstance)
  }
  goAxios(data = null) {
    let newData = this.data

    if (this.isShowLoading) {
      this.showLoading()
    }
    let options = {
      method: this.api.method,
      url: `${this.api.url}`,
      data: newData,
      timeout: 30000,
      withCredentials: true
    };
    if (data) {
      options.data = data
    }
    axios(options.url, newData)
      .then(res => {
        if (this.isShowLoading) {
          this.hideLoading()
        }
        if (res.data.code === 2000) {
          if (typeof (this.succFuc) === 'function') {
            this.succFuc(res)
          }
        } else {
          if (typeof(this.abnormalCodeFunc) === 'function') {
            this.abnormalCodeFunc(res)
          } else {
            this.defaultAbnormalCodeHandler(res)
          }
        }

        if (typeof (this.finallyFunc) === 'function') {
          this.finallyFunc(res)
        }
      }).catch(err => {
      console.log('哇~请求出错了!');
      console.log(err);
      if (this.isShowLoading) {
        this.hideLoading()
      }

      if (typeof (this.errFunc) === 'function') {
        this.errFunc(err)
      } else {
        Message({
          message: '系统异常,请稍后重试',
          type: 'error',
          duration: 1.5 * 1000
        })
      }

      if (typeof (this.finallyFunc) === 'function') {
        this.finallyFunc(err)
      }
    })
  }
}

export default HttpClass
