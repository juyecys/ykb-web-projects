<template>
<div id="chart">
  <table>
    <thead>
      <tr>
        <th width="5%" v-if="chartsData.options.select" ></th>
        <th v-for="item in chartsData.chartHeader" :width="item.width">{{item.value}}</th>
        <th width="10%" v-if="chartsData.hasOwnProperty('actions')" >操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item,i) in chartsData.chartLists" >
        <label :for="'checkbox'+i" v-if="chartsData.options.select">
          <input type="checkbox" name="" value="" class="tableCheckbox" :id="'checkbox'+i" :disabled="(!item.hasOwnProperty('checkbox') || item.checkbox.disabled === true)&&'disabled'" :checked="(!item.hasOwnProperty('checkbox') || item.checkbox.checked === true)&&'checked'" @change="changeBox(item,i)">
          <span></span>
        </label>
        <td v-for="ch in chartsData.chartHeader">{{item[ch.key]}}</td>
        <td v-if="chartsData.hasOwnProperty('actions')" >
          <span class="options" v-for="op in chartsData.actions" @click="op.func(item)">
            {{op.text}}
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
</template>

<script >
  export default {
    name:'chart',
    props:{
      chartsData:{
        type:Object,
        default () {
          return {
            chartHeader:{
              type:Array,
              default () {
                return []
              }
            },
            chartLists:{
              type:Array,
              default () {
                return []
              }
            }
          }
        }
      },
    },
    methods:{
      changeBox(obj){
        console.log(obj)
      }
    }
  }
</script>

<style lang="less" scoped>
  #chart{
    background-color:#fff;
    table{
      width:100%;
      border-collapse:collapse;
      thead{
      }
      tr{
        text-align: center;
        height:50px;
        border-bottom:1px solid #ececec;
        transition:background .3s ease;
      }

      tbody{

        tr:nth-child(odd){
          background:#f8f8f8;
        }
        tr:hover{
          background:#e9e9e9;
        }
      }

    }
    .options{
      padding:2px 5px;
      margin:0 5px 0 0;
      border:1px solid #06e;
      cursor:pointer;
      font-size: 12px;
      box-sizing: border-box;
      border-radius:3px;
      transition:background .3s ease,color .3s ease;
    }
    .options:hover{
      background:#06e;
      color:#fff;
    }
    input[type="checkbox"]{
      appearance: none;
      -webkit-appearance: none;
      outline: none;display:none;
    }
    label{width:20px;
      height:20px;
      display:inline-block;
      border:1px solid #999;
      border-radius:2px;
      margin:10px;
    }
    label input[type="checkbox"] + span{width:18px;
      height:18px;
      display:inline-block;
      background:#fff;
      transition:background .5s ease;
      margin:1px;
      border-radius:2px;
      cursor:pointer;
    }
    label input[type="checkbox"]:checked + span{
      background:#06e;
    }
    label input[type="checkbox"]:disabled + span{
      background:#ececec;
      cursor:no-drop;
    }
  }
</style>
