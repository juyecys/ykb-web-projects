<template>
  <div id="latent-order">
    <operationBtn :btns="btns"></operationBtn>
    <itable
      :ths="['用户Id','openId','微信昵称','操作时间','出生日期','年龄','保障金额','保费','医院省份','医院名称','关联订单号']"
      :tds="['userId','openId','nickName','createdDate','birthday','age','insuranceAmount','orderAmount','provinceName','hospitalName','orderNumber']"
      :tableData="latentOrderList"
      :totalPage="latentOrderPageInfo.totalPage"
      :totalCount="latentOrderPageInfo.totalCount"
      :nowPage="latentOrderPageInfo.nowPage"
      :pageSize="latentOrderPageInfo.pageSize"
      @pageHadChange="toNextPage"
      @pageSizeHadChange="changePageSize"
    ></itable>
    <modal :show="inquiryOrderModal" title="查询订单" @makesure="inquiryOrderList" @cancel="hideModel" :footerBtn="inquiryOrderBtn" confirmTxt="查询"  id="inquiryOrderModal">
      <div class="inquiryOrder">
        <div class="modalItem">
          <div class="itemName">操作时间</div>
          <div class="itemValue">
            <div class="itemPicker">
              <div class="datePicker">
                <v-date-picker
                  mode='single'
                  drag-color='#9fcfdf'
                  :show-caps=true
                  :is-expanded=true
                  popover-visibility="focus"
                  input-placeholder="选择日期"
                  v-model='inquiryStartDate'>
                  <input type="text" class="picker" id="startDateYMD" v-model="inquiryStartDateYMD" placeholder="选择日期" >
                </v-date-picker>
                <img src="../../../static/images/close.png" alt="" @click="cleanDate(0)">
              </div>
              <div style="text-align: center;width:100px;" >至</div>
              <div class="datePicker">
                <v-date-picker
                  mode='single'
                  drag-color='#9fcfdf'
                  :show-caps=true
                  :is-expanded=true
                  popover-visibility="focus"
                  input-placeholder="选择日期"
                  v-model='inquiryEndDate'>
                  <input type="text" class="picker" id="endDateYMD" v-model="inquiryEndDateYMD" placeholder="选择日期" >
                </v-date-picker>
                <img src="../../../static/images/close.png" alt="" @click="cleanDate(1)">
              </div>
            </div>
          </div>
        </div>
        <div class="modalItem">
          <div class="itemName">保障金额</div>
          <div class="itemValue">
            <search-input
              :value.sync="inquiryOrderAmount"
              :searchData="[18000,28000,38000,48000]"
              :onlySelect="true"
            ></search-input>
          </div>
        </div>
        <div class="modalItem">
          <div class="itemName">医院省份</div>
          <div class="itemValue">
            <search-input
              :value.sync="inquiryOrderProvince"
              :searchkey.sync="inquiryOrderProvinceId"
              :searchData="provinceList.name"
              :searchKeyValue="provinceList.id"
              :onlySelect="true"
            ></search-input>
          </div>
        </div>
        <div class="modalItem">
          <div class="itemName">医院名称</div>
          <div class="itemValue">
            <input type="text" v-model="inquiryHospital">
          </div>
        </div>
        <div class="modalItem">
          <div class="itemName">是否转化订单</div>
          <div class="itemValue">
            <search-input
              :value.sync="inquiryOrderStatus"
              :searchData="['是','否']"
              :onlySelect="true"
            ></search-input>
          </div>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
  import searchInput from '../../components/searchInput'
  import operationBtn from '../../components/operationBtn'
  import itable from '../../components/itable'
  import modal from '../../components/modal'
  import choice from '../../components/choice'
  import maskLayer from '../../components/maskLayer'
  import toast from '../../components/toast'
  export default {
    name: "latentOrder",
    components:{
      operationBtn,
      itable,
      searchInput,
      modal,
      choice
    },
    computed:{
      latentOrderList(){
        return this.$store.state.babyInsurance.latentOrderList
      },
      latentOrderPageInfo(){
        return this.$store.state.babyInsurance.latentOrderPageInfo
      },
      provinceList(){
        console.log(this.$store.state.provinceList)
        let obj = this.$store.state.provinceList,province={id:[],name:[]}
        obj.map(item=>{
          province.name.push(item.name)
          province.id.push(item.id)
        })
        return province
      },
      inquiryEndDateYMD(){
        if(this.inquiryEndDate !== ''){
          let D = new Date(this.inquiryEndDate)
          return D.getFullYear()+'-'+(D.getMonth()>=9?(D.getMonth()+1):'0'+(D.getMonth()+1))+'-'+(D.getDate()>9?D.getDate():'0'+D.getDate())
        }else{
          return ''
        }
      },
      inquiryStartDateYMD(){
        if(this.inquiryStartDate !== ''){
          let D = new Date(this.inquiryStartDate)
          return D.getFullYear()+'-'+(D.getMonth()>=9?(D.getMonth()+1):'0'+(D.getMonth()+1))+'-'+(D.getDate()>9?D.getDate():'0'+D.getDate())
        }else{
          return ''
        }
      },
    },
    mounted(){
      this.$store.dispatch('getLatentOrder',{nowPage:1,pageSize:10})
      this.$store.dispatch('getProvinceList')
    },
    data(){
      return {
        //查询订单变量
        inquiryStartDate:'',
        inquiryEndDate:'',
        inquiryOrderAmount:'',
        inquiryOrderProvince:'',
        inquiryOrderProvinceId:'',
        inquiryHospital:'',
        inquiryOrderStatus:'',
        inquiryOrderBtn:[{
          name:'清除条件',
          event:this.cleanInquiryValue
        }],
        inquiryOrderObj:{},
        inquiryOrderModal:false,
        //结束
        btns:[{
          name:'查询',
          event:this.inquiryOrder
        },{
          name:'查询全部',
          event:this.inquiryAllOrder
        }]
      }
    },
    methods:{
      cleanInquiryValue(){
        let self = this
          self.inquiryStartDate='';
          self.inquiryEndDate='';
          self.inquiryOrderAmount='';
          self.inquiryOrderProvince='';
          self.inquiryOrderProvinceId='';
          self.inquiryHospital='';
          self.inquiryOrderStatus='';
      },
      hideModel(){
        this.inquiryOrderModal = false
        maskLayer.hide()
      },
      inquiryOrderList(){
        let self = this,
          obj = {},
          arr = [{
            key:'createdDateStart',
            value:this.inquiryStartDate
          },{
            key:'createdDateEnd',
            value:this.inquiryEndDate
          },{
            key:'provinceId',
            value:this.inquiryOrderProvinceId
          },{
            key:'hospitalName',
            value:this.inquiryHospital
          },{
            key:'insuranceAmount',
            value:this.inquiryOrderAmount
          },{
            key:'status',
            value:this.inquiryOrderStatus !== ''?(this.inquiryOrderStatus === '是'?true:false):''
          }];
        for(let i=arr.length-1;i>=0;i--){
          if(self.noEmpty(arr[i].value)){
            obj[arr[i].key] = arr[i].value
          }
        }
        if(Object.getOwnPropertyNames(obj).length !==0){
          console.log(obj)
          obj.page = {
            nowPage:1,
            pageSize:10
          }
          this.inquiryOrderObj = Object.assign({},this.inquiryOrderObj,obj)
          this.$store.dispatch('searchLatentOrder',obj)
          this.hideModel()
        }else{
          toast.error({
            msg:'请输入至少一个搜索条件！'
          })
        }
      },
      noEmpty(val){
        if(val !== '' && val !== null || (typeof val === 'number' && val !== 0)){
          return true
        }else{
          return false
        }
      },
      inquiryOrder(){
        this.cleanInquiryValue()
        this.inquiryOrderModal = true
        maskLayer.show()
      },
      inquiryAllOrder(){

      },
      changePageSize(size){
        if(Object.getOwnPropertyNames(this.inquiryOrderObj).length !==0){
          this.inquiryOrderObj.page = {
            nowPage:1,
            pageSize:size
          }
          this.$store.dispatch('searchOrder',this.inquiryOrderObj)
        }else{
          this.$store.dispatch('getBabyInsuranceOrderList',{nowPage:1,pageSize:size})
        }
      },
      toNextPage(nextPage){
        if(Object.getOwnPropertyNames(this.inquiryOrderObj).length !==0){
          this.inquiryOrderObj.page = {
            nowPage:nextPage,
            pageSize:this.orderPageInfo.pageSize
          }
          this.$store.dispatch('searchOrder',this.inquiryOrderObj)
        }else{
          this.$store.dispatch('getBabyInsuranceOrderList',{nowPage:nextPage,pageSize:this.orderPageInfo.pageSize})
        }
      }
    }
  }
</script>

<style scoped lang="less">
  #latent-order{
    .inquiryOrder{
      .modalItem{
        display: flex;
        //align-items: center;
        justify-content:center;
        min-height:32px;
        margin-top:10px;
        .itemName{
          width:120px;
          padding-top:5px;
          padding-right:20px;
          text-align: right;
        }
        .itemValue{
          width:300px;
          textarea{
            width:300px;
            height:100px;
            resize:none;
            padding:10px;
            border-radius:3px;
            outline:none;
            border-color:#ccc;
          }
          input{
            width:300px;
            height:32px;
            border:1px solid #ccc;
            border-radius:2px;
            padding-left:10px;
            outline:none;
          }
        }
        .itemPicker{
          display: flex;
          align-items:center;
        }
        .datePicker{
          position:relative;
          width:130px;
          display:flex;
          input{
            width:165px;
          }
          img{
            width:16px;
            height:16px;
            position: absolute;
            right:8px;
            top:8px;
          }
          .picker{
            //border:1px solid #007AFF;
            outline:none;
            width:130px;
            height:32px;
            padding:0 10px;
            border-radius:2px;
          }
          .closePicker{
            width:80px;
            height:32px;
            line-height:32px;
            text-align: center;
            cursor: pointer;
            border:1px solid #007AFF;
            border-left:none;
            color:#fff;
            background-color: #007AFF;
            border-radius:2px;
            margin-left:-2px;
          }
        }
      }
    }
  }
</style>
