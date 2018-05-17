/* eslint-disable new-cap */
/*
 * 加密类
 * */
import aesjs from 'aes-js'
import md5 from 'blueimp-md5'

const key = [0x23, 0x24, 0x12, 0x56, 0x5f, 0x3b, 0x6c, 0x7d, 0x2e, 0x3f, 0x1a, 0x0b, 0x37, 0x5c, 0x45, 0x78]
const iv = [0x34, 0x25, 0x14, 0x58, 0x50, 0x3c, 0x6d, 0x7e, 0x2f, 0x3a, 0x1e, 0x03, 0x36, 0x5f, 0x44, 0x18]

class AesClass {

  static encode = (text) => {
    let textBytes = aesjs.utils.utf8.toBytes(text)
    let aesOfb = new aesjs.ModeOfOperation.ofb(key, iv)
    let encryptedBytes = aesOfb.encrypt(textBytes)
    let encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes)
    return encryptedHex
  }

  static decode = (encryptedHex) => {
    let encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex)
    let aesOfb = new aesjs.ModeOfOperation.ofb(key, iv)
    let decryptedBytes = aesOfb.decrypt(encryptedBytes)
    let decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes)
    return decryptedText
  }

  static S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  }
  static guid() {
    return (AesClass.S4()+AesClass.S4()+"-"+AesClass.S4()+"-"+AesClass.S4()+"-"+AesClass.S4()+"-"+AesClass.S4()+AesClass.S4()+AesClass.S4());
  }

  static sign = (params) => {
    let keys = []
    for (let key in params) {
      if (key !== 'sign') {
        if (params[key] instanceof Date) {
          params[key] = params[key].getTime()
        }
        keys.push(key)
      }
    }
    keys.sort()
    let vals = []
    for (let key of keys) {
      vals.push(params[key])
    }
    let src = vals.join('')
    let enc = src
    return md5(enc).toLowerCase()
  }

  static combining(data) {
    let t = new Date().getTime();
    let newData = {
      token: AesClass.encode(t),
      noise: AesClass.guid()
    }
    newData.sign = md5(t + newData.noise).toLowerCase();
    return Object.assign(data, newData);
  }
}

export default AesClass
