<template>
  <div class="itable">
    <div class="allRecords" v-if="showTotalCount">
      总记录数为：{{totalCount}}
    </div>
    <div class="tableContainer">
      <table :style="{'min-width':minTableWidth+'px'}">
        <thead>
        <tr>
          <th v-for="(th,index) in ths" :class="thClass[index]">{{th}}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item,index) in tableData" :class="trClass[index]" @click="trClick(index)">
          <td v-for="(td,_index) in tds" :class="tdClass[_index]" @click="tdClick(index,_index,td)" :style="{'color':td.indexOf('#')>-1?'#06e':''}">
            <span v-if="isPrueTdKey(td)==='key'">{{item[td]}}</span>
            <span v-else-if="isPrueTdKey(td)==='text'">{{replaceTdTxtValue(td)}}</span>
            <img class="head_img" v-else-if="isPrueTdKey(td) === 'imgs'" :src="item[getImgKey(td)]" alt="" >
            <img v-for="(item,__index) in replaceTdImgValue(td)" :src="item" alt="" v-else-if="isPrueTdKey(td) === 'img'" @click="tdImgClick(index,__index)">
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <!--分页-->
    <div class="pagination" v-if="toPagination">
      <div class="pageing">
        <ul :style="{'width':(totalPage*30)+'px'}" ref="pageUl">
          <li v-for="item in totalPage" @click="selectPage(item)" :class="item === nowpage?'action':''">{{item}}</li>
          <li v-if="totalPage>7">...</li>
          <li v-if="totalPage>7" @click="selectPage(totalPage)" :class="totalPage === nowpage?'action':''">{{totalPage}}</li>
        </ul>
      </div>

      <div class="pageSize">
        <ul>
          <li :class="pageSize===10?'action':''" @click="selectPageSize(10)">10</li>
          <li :class="pageSize===25?'action':''" @click="selectPageSize(25)">25</li>
          <li :class="pageSize===50?'action':''" @click="selectPageSize(50)">50</li>
          <li :class="pageSize===100?'action':''" @click="selectPageSize(100)">100</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name:'itable',
    props:{
      showTotalCount:{
        type:Boolean,
        default:true
      },
      toPagination:{
        type:Boolean,
        default:true
      },
      minTableWidth:{
        type:Number,
        default:800
      },
      totalCount:{
        type:Number,
        default:0
      },
      totalPage:{
        type:Number,
        default:0
      },
      nowPage:{
        type:Number,
        default:1
      },
      pageSize:{
        type:Number,
        default:10
      },
      ths:{
        type:Array,
        default:()=>{
          return []
        }
      },
      tds:{
        type:Array,
        default:()=>{
          return []
        }
      },
      thClass:{
        type:Array,
        default:()=>{
          return []
        }
      },
      tdClass:{
        type:Array,
        default:()=>{
          return []
        }
      },
      trClass:{
        type:Array,
        default:()=>{
          return []
        }
      },
      tableData:{
        type:Array,
        default:()=>{
          return []
        }
      }
    },
    computed:{
      nowpage(){
        return this.nowPage
      }
    },
    data(){
      return{}
    },
    methods:{
      getImgKey(td) {
        return td.replace(/#/g,'');
      },
      isPrueTdKey(value){
        if(value.indexOf('###')>-1){
          return 'imgs'
        }else if(value.indexOf('##')>-1){
          return 'img'
        }else if(value.indexOf('#')>-1){
          return 'text'
        }else{
          return 'key'
        }
      },
      replaceTdTxtValue(value){
        return value.substring(1,value.length-1)
      },
      replaceTdImgValue(value){
        //console.log(value)
        let imgs = value.substring(3,value.length-3).split(',')
        return imgs
      },
      tdImgClick(index,__index){
        this.$emit('tdImgClick',index,__index)
      },
      trClick(_index){
        this.$emit('trClick',_index)
      },
      tdClick(index,_index,key){
        this.$emit('tdClick',index,_index,key)
      },
      selectPage(item){
        if(this.nowPage === item ) {
          return
        }
        //this.nowPage = item
        let maxCount = this.totalPage-10,
          moveDistance = item-5
          moveDistance = moveDistance<=maxCount?moveDistance:maxCount
          moveDistance = moveDistance>=0?moveDistance:0
          this.$refs.pageUl.style.webkitTransform ='translate('+(-moveDistance*30)+'px,0)';
          console.log('pageHadChange',item)
          this.$emit('pageHadChange',item)
      },
      selectPageSize(size){
        console.log('pageSizeHadChange',size)
        this.$emit('pageSizeHadChange',size)
      }
    }
  }
</script>
<style lang="less" scoped>
  .itable{
    width:100%;
    padding: 12px;
    .tableContainer{
      min-height:460px;
    }
    .pagination{
      width:100%;
      min-width:800px;
      height:40px;
      display: flex;
      justify-content:space-between;
      margin-top:10px;
      .action{
        background: #007AFF;
        color:#fff;
      }
      .pageing{
        width: 300px;
        height:30px;
        line-height:30px;
        position:relative;
        margin-top:5px;
        overflow:hidden;
        white-space:nowrap;
        ul{
        transition:transform .5s ease;
        width:300px;
        float:left;
          li{
            float:left;
            width:30px;
            font-size:14px;
            text-align: center;
            border-radius:30px;
            cursor:pointer;
          }
        }
      }
      .pageSize{
        cursor:pointer;
        ul{
          li{
            float:left;
            padding:8px;
            margin:4px 0 0 8px;
            font-size:14px;
          }
        }
      }
    }
    p{
      padding:0;
      margin:0 0 12px 0;
    }
    table{
      border-collapse:collapse;
      width:100%;
      min-width:800px;
      overflow:hidden;
      word-wrap: break-word;
      word-break: break-all;
      thead{
        tr:first-child{
          border:none;
        }
        tr:hover{
          background-color: transparent;
        }
      }
      tr{
        border-top:1px solid #ccc;
        border-bottom:1px solid #ccc;
        font-size:12px;
        cursor: pointer;
        transition:background .5s ease;
      }
      tr:hover{
        background: #ccc;
      }
      tr:nth-child(even){
        background: #ddd;
      }
      th{
        height:40px;
        font-size:14px;
      }
      td{
        text-align:center;
        padding:10px 0;
      a{
        color:#06e;
      }
      img{
        width:15px;
        margin-right:5px;
      }
      .head_img{
        width:64px;
        margin-right:5px;
      }
      img:last-child{
        margin:0;
      }
     }
    }
  }
</style>
