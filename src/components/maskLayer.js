/**
 * Created by FuxiaoKe on 2018/1/24.
 */
const maskLayer = {
  init(){
    //console.log(document.querySelector('#maskLayer'))
    if(document.querySelector('#maskLayer') === null){
      let maskLayer = document.createElement('div');
      maskLayer.id = 'maskLayer';
      document.body.appendChild(maskLayer)
    }
  },
  show(){
    this.init()
    let maskLayer = document.querySelector('#maskLayer')
    maskLayer.style.display = 'block'
    setTimeout(()=>{
      maskLayer.style.opacity = 1
    },0)

  },
  hide(){
    let maskLayer = document.querySelector('#maskLayer')
    maskLayer.style.opacity = 0
    setTimeout(()=>{
      maskLayer.style.display = 'none'
    },550)
  }
}

export default maskLayer;
