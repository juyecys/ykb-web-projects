import Vue from 'vue'
import BaseClass from '@/utils/BaseClass'
import HttpClass from '@/utils/HttpClass'
import { Message, Loading, MessageBox, Notification } from 'element-ui'

/**
 * 获取当前模块module
 */
Vue.prototype.getModule = function() {
  let regExp = new RegExp('\/[\\S]+?\/([\\S]+?)(\/|$)')
  let result = regExp.exec(Vue.prototype.RouterPath)
  let module = module
  if (!BaseClass.isNullOrEmpty(result)) {
    module = result[1]
  }
  return module
}


// loading
Vue.prototype.loadingInstance = null
Vue.prototype.showLoading = function(options) {
  Vue.prototype.loadingInstance = Loading.service(options)
  return Vue.prototype.loadingInstance
}

Vue.prototype.hideLoading = function(instance) {
  if (BaseClass.isNullOrEmpty(instance)) {
    if (!BaseClass.isNullOrEmpty(Vue.prototype.loadingInstance)) {
      Vue.prototype.loadingInstance.close()
    }
  } else {
    instance.close()
  }
}

/**
 *
 * @param options
 */
Vue.prototype.message = function(options) {
  Message(options)
}

/**
 * name
 * 参数	说明	类型	可选值	默认值
 title	MessageBox 标题	string	—	—
 message	MessageBox 消息正文内容	string / VNode	—	—
 type	消息类型，用于显示图标	string	success/info/warning/error	—
 customClass	MessageBox 的自定义类名	string	—	—
 callback	若不使用 Promise，可以使用此参数指定 MessageBox 关闭后的回调	function(action, instance)，action 的值为'confirm'或'cancel', instance 为 MessageBox 实例，可以通过它访问实例上的属性和方法	—	—
 beforeClose	MessageBox 关闭前的回调，会暂停实例的关闭	function(action, instance, done)，action 的值为'confirm'或'cancel'；instance 为 MessageBox 实例，可以通过它访问实例上的属性和方法；done 用于关闭 MessageBox 实例	—	—
 lockScroll	是否在 MessageBox 出现时将 body 滚动锁定	boolean	—	true
 showCancelButton	是否显示取消按钮	boolean	—	false（以 confirm 和 prompt 方式调用时为 true）
 showConfirmButton	是否显示确定按钮	boolean	—	true
 cancelButtonText	取消按钮的文本内容	string	—	取消
 confirmButtonText	确定按钮的文本内容	string	—	确定
 cancelButtonClass	取消按钮的自定义类名	string	—	—
 confirmButtonClass	确定按钮的自定义类名	string	—	—
 closeOnClickModal	是否可通过点击遮罩关闭 MessageBox	boolean	—	true（以 alert 方式调用时为 false）
 closeOnPressEscape	是否可通过按下 ESC 键关闭 MessageBox	boolean	—	true（以 alert 方式调用时为 false）
 showInput	是否显示输入框	boolean	—	false（以 prompt 方式调用时为 true）
 inputPlaceholder	输入框的占位符	string	—	—
 inputValue	输入框的初始文本	string	—	—
 inputPattern	输入框的校验表达式	regexp	—	—
 inputValidator	输入框的校验函数。可以返回布尔值或字符串，若返回一个字符串, 则返回结果会被赋值给 inputErrorMessage	function	—	—
 inputErrorMessage	校验未通过时的提示文本	string	—	输入的数据不合法!
 * @param options
 */
Vue.prototype.messageBox = function(options) {
  MessageBox(options)
}

/**
 *
 * @param options
 */
Vue.prototype.notification = function(options) {
  Notification(options)
}


/**
 * 输出debug log，只有在测试环境能输出
 * @param var1
 * @param var2
 */
Vue.prototype.dlog = BaseClass.dlog;
/**
 * 输出info log，所有环境都输出
 * @param var1
 * @param var2
 */
Vue.prototype.ilog = BaseClass.ilog;

/**
 * 判断是否为空，支持一切变量
 * @param val
 * @returns {boolean}
 */
Vue.prototype.isNullOrEmpty = BaseClass.isNullOrEmpty;
Vue.prototype.getDate = BaseClass.getDate;
Vue.prototype.getWeekday = BaseClass.getWeekday;
/*
 * 判断是否是个函数
 * */
Vue.prototype.isFuction = function(fuc) {
  if (typeof fuc === 'function') {
    return true
  }
};

/**
 * 大图图片
 * @param url
 * @returns {*}
 */
Vue.prototype.getHttpObject = function() {
  return new HttpClass()
}

/*
 * 路由跳转
 * */
Vue.prototype.routerGo = BaseClass.routerGo

/**
 * 日期函数，讲日期转换成格式化的字符串
 * @param date 传入的日期，Date实例
 * @param fmt 日期的格式
 * @returns {*}
 */
Vue.prototype.formatDate = BaseClass.formatDate

/**
 * 日期函数，讲时间戳转换成格式化的字符串
 * @param timestamp
 * @param fmt
 * @returns {*}
 */
Vue.prototype.formatTimestamp = BaseClass.formatTimestamp

/**
 * 获取图片地址 ?x-oss-process=style/min
 * @param url
 * @returns {*}
 */
Vue.prototype.getImgUrl = BaseClass.getImgUrl
Vue.prototype.getHeadUrl = BaseClass.getHeadUrl
Vue.prototype.getR43Url = BaseClass.getR43Url
/**
 * 获取图片地址
 * @param url
 * @returns {*}
 */
Vue.prototype.getUrl = BaseClass.getUrl
Vue.prototype.getImgUrlStyle = BaseClass.getImgUrlStyle


/**
 * 大图图片
 * @param url
 * @returns {*}
 */
Vue.prototype.getImgUrlMax = BaseClass.getImgUrlMax/**

 * 动态创建iframe
 * @param html 需要写入的内容
 * @param dom  插入对应的dom中
 * @returns {*}
 */
Vue.prototype.createIframe = BaseClass.createIframe

/**
 * 获取文本的Array
 * @param txt 输入的文本
 * @param maxSize 输出的最大尺寸
 * @returns {*}
 */
Vue.prototype.getArray = BaseClass.getArray;
Vue.prototype.isMobile = BaseClass.isMobile;
Vue.prototype.isPhone = BaseClass.isPhone;

/**
 * 动态改变网站icon、title
 * @param icon 网站icon
 * @param title 网站title
 * @returns {*}
 */
Vue.prototype.setWebSite = BaseClass.setWebSite;

/**
 * 创建转接中心
 */

Vue.prototype.cenetrCntrol = new Vue();


/**
 * 锁定屏幕滚动
 */
Vue.prototype.stopScroll = BaseClass.stopScroll;

/*
* BaseClasss局
* */
Vue.prototype.BaseClass = BaseClass;

Vue.prototype.getOpenid = BaseClass.getOpenid;

Vue.prototype.goAuth = BaseClass.goAuth;
Vue.prototype.LAST_PATH = '';




