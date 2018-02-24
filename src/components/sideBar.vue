<template>
  <div id="sideBar" :style="{'width':miniMenu?miniMenuWidth:largeMenuWidth}">
    <div class="largeMenu" v-show="!miniMenu">
      <div class="sideBarHeader">
        <p>易康保</p>
      </div>
      <div id="sideBarFunction" >
        <ul>
          <li v-if="functionItems.length>0"  v-for="item in functionItems" @click="showChild(item)" :path="item.menuResource" class="menu">
            <div :class="item.action?'funcItem actionPatient':'funcItem'" :pagename="'/'+item.menuName"  >
              <i><img :src="'./static/images/'+item.menuCode+'.png'" alt="" /></i>
              <span>{{item.menuName}}</span>
            </div>
            <div v-if="item.subMenu.length >0" class="funcItemChild" v-show="item.action">
              <ul>
                <li v-for="itemChild in item.subMenu" class="itemChild" @click="goToPage('/'+itemChild.parentMenuCode+'/'+itemChild.menuResource)">
                  <div :class="itemChild.action?'itemChildContainer actionChild':'itemChildContainer'" :pagename="'/'+item.menuName+'/'+itemChild.menuName">
                    <!--<i><img src="../../static/images/logo.png" alt="" /></i>-->
                    <span>{{itemChild.menuName}}</span>
                  </div>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="miniMenu" v-show="miniMenu">
      <div class="sideBarHeader">
        <p>易</p>
      </div>
      <div class="menuIcons">
        <ul>
          <li v-if="functionItems.length>0" v-for="item in functionItems" :path="item.menuResource"  @mouseenter="showChildMenu(item.menuCode)" @mouseleave="hideChildMenu(item.menuCode)">
            <i ><img :src="'./static/images/'+item.menuCode+'.png'" alt=""></i>
            <div class="childMenu"  :id="item.menuCode" >
              <div class="parentMenuTitle">{{item.menuName}}</div>
              <ul v-if="item.subMenu.length >0">
                <li v-for="itemChild in item.subMenu" @click="goToPage('/'+itemChild.parentMenuCode+'/'+itemChild.menuResource)">
                  <div class="itemChildContainer" :pagename="'/'+item.menuName+'/'+itemChild.menuName">
                    <span>{{itemChild.menuName}}</span>
                  </div>
                </li>
              </ul>
              <div class="itemChildContainer" :pagename="'/'+item.menuName" @click="goToPage('/'+itemChild.parentMenuCode+'/'+itemChild.menuResource)" v-else>
                <span>{{item.menuName}}</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import config from '../config/menu.config.json'
  export default {
    name:'sideBar',
    data(){
      return{
        functionItems:[],
        isShowChild:false,
        showIndex:-1,
        pid:''
      }
    },
    computed:{
      miniMenu(){
        return this.$store.state.miniMenu
      },
      miniMenuWidth(){
        return this.$store.state.miniMenuWidth
      },
      largeMenuWidth(){
        return this.$store.state.largeMenuWidth
      },
    },
    mounted(){
      let path = this.$router.history.current.path,
        parent = path.split('/')[1],
        sub = path.split('/')[2],
        pathname='';
      for(let i = 0,l = config.length;i<l;i++){
        if(config[i].isParentMenu){
          let parentMenu = config[i]
          parentMenu.action = false
          parentMenu.subMenu = []
          if(parent !== undefined){
            if(config[i].menuCode === parent){
              parentMenu.action = true
              pathname+=parentMenu.menuName;
            }
          }
          for(let j=0;j<l;j++){
            if(config[j].parentMenuCode === config[i].menuCode){
              config[j].action = false
              if(sub !== undefined){
                if(config[j].menuCode === sub){
                  config[j].action = true
                  console.log(config[j].menuCode , sub,config[j].menuCode === sub)
                  this.$store.dispatch('changePathName','/'+pathname+'/'+config[j].menuName)
                }
              }
              parentMenu.subMenu.push(config[j])
            }
          }
          this.functionItems.splice(0,0,parentMenu)
        }
      }
      this.functionItems.reverse()
    },
    methods:{
      showChildMenu(id){
        //console.log(id)
        document.querySelector('#'+id).style.display="block"
      },
      hideChildMenu(id){
        document.querySelector('#'+id).style.display="none"
      },
      showChild(item){
        let target = event.target.className?event.target:event.target.parentNode
        //console.log(target)
        if(target.className.indexOf('funcItem')>-1){
          let key = 0,_index=0
          for(let i of this.functionItems){
            if(i.menuCode !== item.menuCode){
              i.action = false
            }else{
              key = _index
              i.action = !i.action
            }
            _index++;
          }
          this.functionItems.splice(key,1,item)
          if(!item.hasOwnProperty('childrenFunc')){
            this.goToPage(item.menuResource)
          }
        }
      },
      goToPage(path){
        this.isShowChild&&(this.isShowChild=!this.isShowChild);
        let target = event.target.className?event.target:event.target.parentNode
        if(target.className.indexOf('itemChildContainer')>-1){
          let pervtarget = document.querySelector('.actionChild');
         (pervtarget !== null) && (pervtarget.className = 'itemChildContainer ');
          target.className = 'itemChildContainer actionChild'
        }
        this.$store.dispatch('changePathName',target.getAttribute('pagename'))
        this.$router.push(path)
      }
    }
  }
</script>

<style lang="less" scoped>
  #sideBar{
    background: #34495e;
    width:200px;
    height:100%;
    position: fixed;
    left:0;
    top:0;
    color:#eee;
    .sideBarHeader{
      height:50px;
      line-height:50px;
      background-color:#2d3e50;
      text-align:center;
      p{
        margin:0;
        font-size:20px;
        color:#fff;
      }
    }
    .largeMenu{
      #sideBarFunction{
        li{
          min-height:40px;
          line-height:40px;
          cursor:pointer;
        }
        img{
          width:20px;
          height:20px;
          float:left;
          margin:10px 5px 0 0;
        }
        .actionPatient{
          position: relative;
          //background-color:#1d2025;
        }
        .actionPatient::before{
          content:'';
          position: absolute;
          left:0;
          width:5px;
          height:100%;
          background-color: #de0669;
        }
        .actionChild{
          background-color:rgba(0,0,0,.3);
          position: relative;
        }
        .actionChild::before{
          content:'';
          position: absolute;
          right:0;
          width:3px;
          height:100%;
          background-color: #de0669;
        }
        .funcItem{
          padding:0 24px;
          transition:background-color .5s ease,color .5s ease;
        }
        .funcItemChild{
          background-color:#2d3e50;
          color:#eee;
          font-size:14px;
          ul{
            li{
              width:100%;
              min-height:30px;
              line-height:30px;
              img{
                margin-left: 40px;
              }
              span{
                margin-left: 50px;
              }
            }
          }
        }
      }
    }
    .miniMenu{
      .menuIcons{
        text-align:center;
        li{
          height:40px;
          line-height:40px;
          cursor:pointer;
        }
        i{
          img{
            width:20px;
            height:20px;
            margin-top:10px;
          }
        }
        .parentMenuTitle{
          background: #7E8282;
          width:100%;
          padding:0;
          position: relative;
        }
        .childMenu li{
          padding:0 12px;
        }
        .childMenu li:hover{
          background: #ddd;
        }
        .childMenu{
          position: absolute;
          left:50px;
          background-color:#eee;
          margin-top:-45px;
          min-width:180px;
          display:none;
          border-radius:3px;
          white-space:nowrap;
          z-index:99;
          box-shadow:5px 5px 10px #666;
          //border:1px solid #eee;
          span{
            color:#000;
            transition:color .5s ease;
            font-size: 14px;
          }
        }
      }
    }
  }
</style>
