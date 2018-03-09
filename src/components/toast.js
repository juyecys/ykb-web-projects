/**
 * Created by FuxiaoKe on 2018/1/17.
 */
const Toast = {
  count:0,
  toastArr:[],
  init(options){

    let toast = document.createElement('div'),
      parent = document.querySelector('.container'),
      toasts = document.querySelectorAll('.toast'),
      len = toasts.length,
      toastid = `toast${this.count}`,
      topIndex = len;
    //console.log(len)
    toast.indexId = len;
    if(len>0){
      for(let i=0;i<len;i++){
        if(this.toastArr[i].delete){
          topIndex = i;
          break;
        }
      }
    }
    toast.className = `toast ${toastid}`
    toast.style.top = (topIndex+1) * 60 + 'px'
    parent.appendChild(toast)
    //console.log(toast)
    //this.toastArr.push(options)
    this.toastArr.splice(topIndex,0,options)
    if(len === 0){
      let deleteCount = 0
      let stop = setInterval(()=>{
        //console.log(this.toastArr)
        let toastArr = this.toastArr,time = new Date().getTime()
        for(let i=0,len = toastArr.length;i<len;i++){
           toastArr[i].hover && (toastArr[i].createTime = time)
          if(toastArr[i].duration + toastArr[i].createTime <= time && !toastArr[i].delete){
            //console.log(document.querySelector(`.${toastArr[i].id}`))
            let otoast =  document.querySelector(`.${toastArr[i].id}`)
              otoast.style.opacity = 0;
            otoast.setAttribute('indexId',99)
            toastArr[i].delete = true
            deleteCount++
          }
        }
        if(toastArr.length === deleteCount){
          setTimeout(()=>{
            for(let _index =  toastArr.length-1;_index>=0;_index--){
              if(toastArr[_index].delete){
                parent.removeChild(document.querySelector(`.${toastArr[_index].id}`))
                toastArr.splice(_index,1)
              }
            }
          },100)
          clearInterval(stop)
        }
      },1000)
    }
  },
  success(options){
    this.makeToast(options,'success')

  },
  error(options){
    this.makeToast(options,'error')

  },
  normal(options){
    this.makeToast(options,'normal')

  },
  makeToast(options,type){
    this.options = {
      msg:'',
      duration:3000,
      createTime:new Date().getTime(),
      type:type
    }
    this.options = Object.assign({},this.options,options)
    this.init({
      duration:this.options.duration,
      createTime:this.options.createTime,
      id:`toast${this.count}`,
      delete:false
    })
    let toastNode =  `<div class="toastContainer ${this.options.type} ">
                      <i><img src="static/images/${this.options.type}.png" alt=""></i>
                      <span>${this.options.msg}</span>
                      </div>`,
      toastid = `toast${this.count}`,
      toast =  document.querySelector(`.${toastid}`)
    toast.innerHTML = toastNode
    this.count++;
  }
}
export default Toast;
