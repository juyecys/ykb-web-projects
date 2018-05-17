/*
 * 基础类
 * */
import Cookies from 'jscookie'
import Aes from './AesClass'
import md5 from 'blueimp-md5'

class BaseClass {

  /**
   * 输出debug log，只有在测试环境能输出
   * @param var1
   * @param var2
   */
  static dlog(var1, var2) {
    if (process.env.IS_DEBUG) {
      BaseClass.ilog(var1, var2)
    }
  }

  /**
   * 输出info log，所有环境都输出
   * @param var1
   * @param var2
   */
  static ilog(var1, var2) {
    if (typeof var2 === 'undefined') {
      console.log(var1)
    } else {
      console.log(var1)
      console.log(var2)
    }
  }

  /*
   * 判断字符串是否为空
   * @param  val
   */
  static isNullOrEmpty(val) {
    if (val === '' ||
      val === false ||
      val === 0 ||
      val === null ||
      typeof(val) === 'undefined') {
      return true;
    } else {
      if (typeof(val) === 'object' && (Object.keys(val).length === 0)) {
        return true;
      }
      return false;
    }
  }

  /*
  * 判断是否是个函数
  * */
  static isFuction(fuc) {
    if (typeof fuc === 'function') {
      return true
    }
  }

  /*
   * 路由跳转
   * */
  static routerGo(routerInfo) {
    console.log(Vue.router)
    if (!this.isNullOrEmpty(routerInfo.params)) {

      Vue.router.push({name: routerInfo.name, params})
    } else {
      Vue.router.push({name: routerInfo.name})
    }
  }

  /**
   * 日期函数，讲日期转换成格式化的字符串
   * @param date
   * @param fmt
   * @returns {*}
   */
  static formatDate(date, fmt) { // author: meizz
    if (BaseClass.isNullOrEmpty(fmt)) {
      fmt = 'yyyy-MM-dd'
    }
    var o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
    return fmt
  }

  /**
   *倒计时
   * @param  sring
   */
  static getLastTime(time,fmt) {
    let  newMyDate = new Date() - time,//时间差的毫秒数
      days  = parseInt(newMyDate / 1000 / 60 / 60 / 24, 10),//计算剩余的天数
      hours = parseInt(newMyDate / 1000 / 60 / 60 % 24, 10),//计算剩余的小时
      minutes  = parseInt(newMyDate / 1000 / 60 % 60, 10),//计算剩余的分钟
      seconds   = parseInt(newMyDate / 1000 % 60, 10);//计算剩余的秒数
  }

  /**
   * 日期函数，讲时间戳转换成格式化的字符串
   * @param timestamp
   * @param fmt
   * @returns {*}
   */
  static formatTimestamp(timestamp, fmt) {
    if (BaseClass.isNullOrEmpty(timestamp)) {
      return ''
    }
    let date = new Date(timestamp)
    return BaseClass.formatDate(date, fmt)
  }

  /**
   * 获取图片地址 ?x-oss-process=style/min
   * @param url
   * @returns {*}
   */
  static getImgUrl(url, type = 'min') {
    if (BaseClass.isNullOrEmpty(url)) {
      return ''
    }
    //本地图片
    if (url.indexOf('data:') != -1) {
      return url
    }

    let imgStyle = `?x-oss-process=style/${type}`;
    if (url.indexOf('http') != -1) {
      return url + imgStyle
    } else {
      if (url.indexOf('/upload') === 0) {
        return process.env.IMG_URL + url + imgStyle
      } else if (url.indexOf('static') === 0) {
        return url
      } else {
        return process.env.IMG_URL + '/' + url + imgStyle
      }
    }
  }

  /**
   * 图像处理书册：https://help.aliyun.com/document_detail/44688.html?spm=a2c4g.11186623.6.971.83gbrb
   * m  指定缩略的模式：
   - lfit：等比缩放，限制在设定在指定w与h的矩形内的最大图片。
   - mfit：等比缩放，延伸出指定w与h的矩形框外的最小图片。
   - fill：固定宽高，将延伸出指定w与h的矩形框外的最小图片进行居中裁剪。
   - pad：固定宽高，缩略填充。
   - fixed：固定宽高，强制缩略  [lfit,mfit,fill,pad,fixed]，默认为lfit。
   w  指定目标缩略图的宽度。  1-4096
   h  指定目标缩略图的高度。  1-4096
   l  指定目标缩略图的最长边。  1-4096
   s  指定目标缩略图的最短边。  1-4096
   limit  指定当目标缩略图大于原图时是否处理。值是 1 表示不处理；值是 0 表示处理。  0/1, 默认是 1
   color  当缩放模式选择为pad（缩略填充）时，可以选择填充的颜色(默认是白色)参数的填写方式：采用16进制颜色码表示，如00FF00（绿色）。  [000000-FFFFFF]
   * @param url
   * @param w
   * @param h
   * @param m
   * @param limit
   * @returns {*}
   */
  static getImgUrlStyle(url, w, h, m = 'm_fill', limit = 'limit_0') {
    if (BaseClass.isNullOrEmpty(url)) {
      return ''
    }
    //本地图片
    if (url.indexOf('data:') != -1) {
      return url
    }

    let imgStyle = `?x-oss-process=image/resize,${m},w_${w},h_${h},${limit}/auto-orient,1/quality,q_100`;
    if (url.indexOf('http') != -1) {
      return url + imgStyle
    } else {
      if (url.indexOf('/upload') === 0) {
        return process.env.IMG_URL + url + imgStyle
      } else if (url.indexOf('static') === 0) {
        return url
      } else {
        return process.env.IMG_URL + '/' + url + imgStyle
      }
    }
  }

  /**
   * 获取图片地址 ?x-oss-process=style/min
   * @param url
   * @returns {*}
   */
  static getR43Url(url) {
    return BaseClass.getImgUrl(url, 'r43')
  }

  /**
   * 获取图片地址 ?x-oss-process=style/min
   * @param url
   * @returns {*}
   */
  static getHeadUrl(url) {
    return BaseClass.getImgUrl(url, 'head')
  }

  /**
   * 获取图片地址
   * @param url
   * @returns {*}
   */
  static getUrl(url) {
    if (BaseClass.isNullOrEmpty(url)) {
      return ''
    }
    if (url.indexOf('http') != -1) {
      return url
    } else {
      if (url.indexOf('/') === 0) {
        return process.env.IMG_URL + url
      } else if (url.indexOf('static') === 0) {
        return url
      }
      else {
        return process.env.IMG_URL + '/' + url
      }
    }
  }

  /**
   * 大图图片
   * @param url
   * @returns {*}
   */
  static getImgUrlMax(url) {
    return BaseClass.getImgUrl(url, 'comp')
  }

  static getImgUrl(url, type = 'min') {
    if (BaseClass.isNullOrEmpty(url)) {
      return ''
    }
    //本地图片
    if (url.indexOf('data:') != -1) {
      return url
    }

    let imgStyle = `?x-oss-process=style/${type}`;
    if (url.indexOf('http') != -1) {
      return url + imgStyle
    } else {
      if (url.indexOf('/upload') === 0) {
        return process.env.IMG_URL + url + imgStyle
      } else if (url.indexOf('static') === 0) {
        return url
      } else {
        return process.env.IMG_URL + '/' + url + imgStyle
      }
    }
  }

  /**
   * 处理当前url
   * @param  val
   */
  static getLocaltionhrefUrl(){
    let hrefStr = location.href,
       hrefArr = hrefStr.split('/');
      return (hrefArr.splice(0,hrefArr.length-1)).join('/');
  }
  /**
   * 判断是否为合法手机号码
   * @param  val
   */
  static isPhone(val) {
    var mobileCheck = /^1[2|3|4|5|6|7|8|9]\d{9}$/;
    return mobileCheck.test(val)
  }

  /*
   根据〖中华人民共和国国家标准 GB 11643-1999〗中有关公民身份号码的规定，公民身份号码是特征组合码，由十七位数字本体码和一位数字校验码组成。排列顺序从左至右依次为：六位数字地址码，八位数字出生日期码，三位数字顺序码和一位数字校验码。
   地址码表示编码对象常住户口所在县(市、旗、区)的行政区划代码。
   出生日期码表示编码对象出生的年、月、日，其中年份用四位数字表示，年、月、日之间不用分隔符。
   顺序码表示同一地址码所标识的区域范围内，对同年、月、日出生的人员编定的顺序号。顺序码的奇数分给男性，偶数分给女性。
   校验码是根据前面十七位数字码，按照ISO 7064:1983.MOD 11-2校验码计算出来的检验码。

   出生日期计算方法。
   15位的身份证编码首先把出生年扩展为4位，简单的就是增加一个19或18,这样就包含了所有1800-1999年出生的人;
   2000年后出生的肯定都是18位的了没有这个烦恼，至于1800年前出生的,那啥那时应该还没身份证号这个东东，⊙﹏⊙b汗...
   下面是正则表达式:
   出生日期1800-2099  (18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])
   身份证正则表达式 /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i
   15位校验规则 6位地址编码+6位出生日期+3位顺序号
   18位校验规则 6位地址编码+8位出生日期+3位顺序号+1位校验位

   校验位规则     公式:∑(ai×Wi)(mod 11)……………………………………(1)
   公式(1)中：
   i----表示号码字符从由至左包括校验码在内的位置序号；
   ai----表示第i位置上的号码字符值；
   Wi----示第i位置上的加权因子，其数值依据公式Wi=2^(n-1）(mod 11)计算得出。
   i 18 17 16 15 14 13 12 11 10 9 8 7 6 5 4 3 2 1
   Wi 7 9 10 5 8 4 2 1 6 3 7 9 10 5 8 4 2 1
   */
  static identityCodeValid(code) {
    let city = {
      11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古",
      21: "辽宁", 22: "吉林", 23: "黑龙江 ",
      31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东",
      41: "河南", 42: "湖北 ", 43: "湖南", 44: "广东", 45: "广西", 46: "海南",
      50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏 ",
      61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆",
      71: "台湾", 81: "香港", 82: "澳门", 91: "国外"
    };
    let tip = "";
    let pass = true;

    if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
      tip = "身份证号格式错误";
      console.log('rrrrr')
      pass = false;
    }
    else if (!city[code.substr(0, 2)]) {
      tip = "地址编码错误";
      pass = false;
    }
    else {
      //18位身份证需要验证最后一位校验位
      if (code.length == 18) {
        code = code.split('');
        //∑(ai×Wi)(mod 11)
        //加权因子
        let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        //校验位
        let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
        let sum = 0;
        let ai = 0;
        let wi = 0;
        for (let i = 0; i < 17; i++) {
          ai = code[i];
          wi = factor[i];
          sum += ai * wi;
        }
        if (parity[sum % 11] != code[17]) {
          pass = false;
        }
      }
    }
    return pass;
  }

  /**
   * 判断是否为微信openid
   * @param  val
   */
  static isOpenid(val) {
    if (BaseClass.isNullOrEmpty(val)) {
      return false;
    }
    if (typeof(val) == 'string' && val.length == 28) {
      return true;
    }
    return false;
  }

  /**
   * 判断是否为微信浏览器
   */
  static isWeixinBrowser() {
    return /micromessenger/.test(navigator.userAgent.toLowerCase())
  }


  /**
   * 去掉前后空格
   * @param str
   */
  static trimBoth(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "")
  }

  /**
   * 去除所有空格:
   * @param str
   */
  static trimAll(str) {
    return str.replace(/\s+/g, "")
  }

  /**
   * 去除左空格：
   * @param str
   */
  static trimLeft(str) {
    return str.replace(/^\s/, '');
  }

  /**
   * 去除右空格：
   * @param str
   */
  static trimRight(str) {
    return str.replace(/(\s$)/g, '');
  }


  /*
   * 判断浏览器是否为安卓
   */
  static isAndroid() {
    let u = navigator.userAgent;
    let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    return isAndroid;
  }

  /**
   * 将敏感信息转换为※
   * @param name
   * @returns {string}
   */
  static parseName(name) {
    if(!BaseClass.isNullOrEmpty(name)){
      if (BaseClass.isPhone(name)) {
        return name.substr(0, 3) + '****' + name.substr(7, 11);
      } else {
        return name.substr(0, 1) + '**' + name.substr(3);
      }
    }
  }

  /**
   * 将身份证敏感信息转换为※
   * @param name
   * @returns {string}
   */
  static parseCardId(name) {
    if (!BaseClass.isNullOrEmpty(name)) {
      return name.substr(0, 3) + '********' + name.substr(14);
    }
  }

  /**
   * 判断是否为数字
   * @param name
   * @returns {string}
   */
  static checkedNumber(data) {
    let reg = /^[1-9]\d*$|^0$/;
    return reg.test(data)
  }

  /**
   * 判断是否为字母
   * @param name
   * @returns {string}
   */
  static checkedLetter(data) {
    let reg = /^[A-Za-z]*$/;
    return reg.test(data)
  }

  /**
   * 判断是否为中文
   * @param name
   * @returns {string}
   */
  static checkedChinese(data) {
    let reg = /^[\u4E00-\u9FA5]+$/;
    return reg.test(data)
  }

  /**
   * 判断是否为email
   * @param name
   * @returns {string}
   */
  static checkedEail(data) {
    let reg = /^[-_A-Za-z0-9]+@([_A-Za-z0-9]+\.)+[A-Za-z0-9]{2,3}$/;
    return reg.test(data)
  }

  /**
   * 检验字符串的长度
   * @param name
   * @returns {string}
   */
  static checkedLong(data) {
    ///<summary>获得字符串实际长度，中文2，英文1</summary>
    ///<param name="str">要获得长度的字符串</param>
    let realLength = 0, len = data.length, charCode = -1;
    /*for (var i = 0; i < len; i++) {
      charCode = data.charCodeAt(i);
      if (charCode >= 0 && charCode <= 128) realLength += 1;
      else realLength += 2;
    }*/
    return len;
  }

  /*
  * 动态写入全局样式
  * */
  static loadStyle(code) {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.rel = 'stylesheet';
    style.appendChild(document.createTextNode(code));
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(style);
  }

  /*
* 动态创建iframe
* */
  static updateIframeHeight(IFRAME, lastMaxHight) {
    if (this.isNullOrEmpty(IFRAME)) {
      this.dlog("IFRAME is null")
      return
    }
    var iframeWin = IFRAME.contentWindow || IFRAME.contentDocument ? IFRAME.contentDocument.parentWindow : undefined;
    if (iframeWin.document.body) {
      console.log('iframeWin.document.documentElement.scrollHeight:' + iframeWin.document.documentElement.scrollHeight)
      console.log('iframeWin.document.body.scrollHeight:' + iframeWin.document.body.scrollHeight)
      let newHeight = iframeWin.document.documentElement.scrollHeight || iframeWin.document.body.scrollHeight;
      if (newHeight > lastMaxHight) {
        lastMaxHight = newHeight
        IFRAME.height = lastMaxHight
        console.log("IFRAME高度更新为：" + IFRAME.height)
      } else {
        console.log("高度：newHeight " + newHeight + " lastH:" + lastMaxHight)
      }
    }
    return lastMaxHight;
  }

  static updateIframe(params) {
    if (BaseClass.isNullOrEmpty(params.iframeWin)) {
      params.iframeWin = params.IFRAME.contentWindow || params.IFRAME.contentDocument.parentWindow;
    }
    if (params.iframeWin.document.body) {
      let newHeight = params.iframeWin.document.body.scrollHeight;
      let clientHeight = params.iframeWin.document.body.clientHeight;

      /*
        console.log('newHeight:[' + newHeight + '] ')
        console.log('clientHeight:[' + clientHeight + '] ')
      */
      /*      if (newHeight > 0 && newHeight !== params.lastMaxHight) {
              if(BaseClass.isMobile() && params.resized < 2){
                params.resized++;
                let imgs = params.iframeWin.document.body.querySelectorAll('img');
                let fonts = params.iframeWin.document.body.querySelectorAll('font');
                newHeight = newHeight / 2;
                //img
                let w = params.phoneWidth - 30 - 16;
                console.log('适应手机的图片尺寸为:' + w)
                let half = w  / 2;

                for(let item of imgs){
                  if(item.width >= w) {
                    let ratio = w / item.width;
                    if (item.height > 0) {
                      item.height = item.height * ratio;
                    }
                    item.width = w;
                  } else if (item.width > half) {
                    let ratio = half / item.width;
                    if (item.height > 0) {
                      item.height = item.height * ratio;
                    }
                    item.width = half;
                  }
                }
                //font
                for(let item of fonts){
                  if(item.size > 3){
                    item.size = `${item.size - 2}`
                  } else if (item.size === 3) {
                    item.size = `${item.size - 1}`
                  }
                }
              }
              params.lastMaxHight = newHeight
              params.IFRAME.height = params.lastMaxHight
              console.log('IFRAME高度更新为：' + params.IFRAME.height)
            }*/
      if (newHeight > 0 && newHeight !== params.lastMaxHight) {
        params.lastMaxHight = newHeight
        params.IFRAME.height = params.lastMaxHight
        console.log('IFRAME高度更新为：' + params.IFRAME.height)
      }
    }
  }

  static createIframe(dom, html) {
    let {isNullOrEmpty} = this, ImgReg, IFRAME, imgs;
    IFRAME = document.createElement('IFRAME');
    console.log('IFRAME进来了：' + dom);
    let browser = BaseClass.browser();
    let isIos = browser.versions.ios

    if (isIos) {
      console.log('IOS 设备特殊处理')
      //IFRAME.srcdoc = '';
    } else {
      IFRAME.srcdoc = html;
    }

    IFRAME.style.width = "100%";
    IFRAME.style.border = "0";
    IFRAME.style.frameSpacing = "0";
    IFRAME.style.marginHeight = "0";
    IFRAME.style.frameBorder = "no";
    IFRAME.scrolling = "no";
    IFRAME.style.vspale = "0";
    IFRAME.style.webkitOverflowScrolling = 'touch';

    let params = {
      IFRAME: IFRAME,
      phoneWidth: document.body.clientWidth,
      lastMaxHight: 0,
      resized: 0,
      isIos: isIos
    };
    IFRAME.onload = () => {
      BaseClass.updateIframe(params);
    };
    document.getElementById(dom).appendChild(IFRAME)
    if (isIos) {
      let iframeWin = IFRAME.contentWindow || IFRAME.contentDocument.parentWindow;
      iframeWin.document.body.innerHTML = html
      console.log('IOS 设备特殊处理iframeWin.document.body.innerHTML')
      //console.log(iframeWin.document.body.innerHTML)
    }

    return setInterval(() => {
      BaseClass.updateIframe(params);
    }, 500)
  }

  /**
   * 获取文本的Array
   * @param txt 输入的文本
   * @param maxSize 输出的最大尺寸
   * @returns {*}
   */
  static getArray(txt, maxSize = 2) {
    if (this.isNullOrEmpty(txt)) {
      return ['']
    }
    let arr = txt.split(/[,，、；;]/g);
    let array = [];
    let i = 0
    for (let a of arr) {
      if (!this.isNullOrEmpty(a)) {
        array.push(a)
        i++

        if (i >= maxSize) {
          break;
        }
      }
    }
    return array;
  }

  /**
   * 动态改变网站icon、title
   * @param icon 网站icon
   * @param title 网站title
   * @returns {*}
   */

  static setWebSite(icon, title) {
    let link = document.createElement('link')
    link.rel = "icon"
    link.type = "image/x-icon"
    link.href = `${this.getUrl(icon)}`
    document.getElementsByTagName('head')[0].appendChild(link)
    document.title = title
  }


  /*
* 智能机浏览器版本信息:
*/

  static browser() {
    return {
      versions: function () {
        let u = navigator.userAgent, app = navigator.appVersion;
        return {//移动终端浏览器版本信息
          trident: u.indexOf('Trident') > -1, //IE内核
          presto: u.indexOf('Presto') > -1, //opera内核
          webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
          gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
          mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
          ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
          android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
          iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQ HD浏览器
          iPad: u.indexOf('iPad') > -1, //是否iPad
          webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
      }(),
      language: (navigator.browserLanguage || navigator.language).toLowerCase()
    };
  }

  /*
  * 智能机浏览器版本信息:
  */

  static isMobile() {
    let browser = {
      versions: function () {
        let u = navigator.userAgent, app = navigator.appVersion;
        return {//移动终端浏览器版本信息
          trident: u.indexOf('Trident') > -1, //IE内核
          presto: u.indexOf('Presto') > -1, //opera内核
          webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
          gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
          mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/), //是否为移动终端
          ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
          android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或者uc浏览器
          iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, //是否为iPhone或者QQ HD浏览器
          iPad: u.indexOf('iPad') > -1, //是否iPad
          webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
        };
      }(),
      language: (navigator.browserLanguage || navigator.language).toLowerCase()
    };

    if (browser.versions.ios || browser.versions.android || browser.versions.android || browser.versions.iPad) {
      this.dlog(" ios终端: " + browser.versions.ios);
      this.dlog(" android终端: " + browser.versions.android);
      this.dlog(" 是否为iPhone: " + browser.versions.iPhone);
      this.dlog(" 是否iPad: " + browser.versions.iPad);
      this.dlog(navigator.userAgent);
      return true
    } else {
      return false
    }
  }

  /**
   * 锁定页面不滚动:
   */
  static stopScroll(show) {
    if (show) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
  }

  /**
   * 获取cookie
   * @param {string} [key] [键]
   * @param {string} [val] [值]
   */

  static setCookie(key, val) {
    Cookies.set({
      name: key,
      value: val
    });
  }

  /**
   *获取cookie
   */
  static getCookie(key) {
    return Cookies.get(key);
  }

  /**
   *获取openid
   */
  static getOpenid() {
    let env = process.env.ENV_CONFIG;
    let key = md5(env + 'weixin').toUpperCase();
    let val = Cookies.get(key);
    console.log('获取到的Cookie为：' + key + "=" + val)
    if (!BaseClass.isNullOrEmpty(val)) {
      let openid = Aes.decode(val);
      console.log('获取到的openid为：' + openid)
      if (BaseClass.isOpenid(openid)) {
        console.log('获取到的openid为：' + openid)
        return openid;
      }
    }
    return null;
  }

  /**
   *转换性别
   * @param  0女 1男 2不限 Numer
   */
  static changeSex (sex) {
    switch (sex){
      case 0:
        return '女'
        break;
      case 1:
        return '男'
        break;
      case 2:
        return '不限'
        break;
    }
  }

  /**
   *设置性别图标
   * @param  sring
   */
  static setSexIcon (sex) {
    switch (sex){
      case 0:
        return 'icon iconfont icon-nv  nv-color';
        break;
      case 1:
        return 'icon iconfont icon-nan nan-color';
        break;
      case 2:
        return '不限';
        break;
    }
  }


  /**
   * 将换行替换为br
   * @param name
   * @returns {string}
   */
  static changeToBr(data) {
    if(BaseClass.isNullOrEmpty(data)){
      return ''
    }
    return data.toString().replace(/(\r)*\n/g,"<br />").replace(/\s/g," ");
  }


  /**
   * 监听浏览器的后退、前进
   * @param fuc 参数为函数
   * @returns {string}
   */
  static listenHistory(fuc) {
    window.addEventListener("popstate", (e) =>{
      if(Object.prototype.toString.call(fuc) === '[object Function]'){
        fuc();
      }
    }, false);
  }


  /**
   * 添加历史记录
   * @param
   * @returns {string}
   */
  static addHistory() {
      let  state = {
        title: document.title,
        url: location.href
      };
      window.history.pushState(state, document.title, location.href);
  }


  static encodePath(path) {
    return path.replace(/\//g, "_");
  }

  static decodePath(path) {
    return path.replace(/_/g, "/");
  }

  static goAuth(router, type = 'info') {
    router = BaseClass.encodePath(router)
    if (type !== 'info') {
      type = 'base';
    }
    location.href = process.env.API_URL + process.env.VERSION + 'auth?r=' + router
      + "&s=" + type
      + "&d=" + document.domain;
  }

  static getDate(date,type){
    date = date.toString();

    if(BaseClass.isNullOrEmpty(type)){
      let newDate = []
      newDate.push(date.slice(0,4))
      newDate.push(date.slice(4,6))
      newDate.push(date.slice(6))
      return newDate.join('-')
    }else{
      return `${date.slice(0,4)}年${date.slice(4,6)}月${date.slice(6)}日`
    }

  }
  static getWeekday(date){
    date = BaseClass.getDate(date).split('-')
    let weekDay = ["星期天",'星期一','星期二','星期三','星期四','星期五','星期六']
    console.log(new Date(date[0],date[1]-1,date[2]).getDate())
    return weekDay[new Date(date[0],date[1]-1,date[2]).getDay()]
  }
}
export default BaseClass
