
<template>
  <div id="orderList">
    <operation-btn :btns="btns"></operation-btn>
    <itable
      :ths="['用户Id','订单号','微信昵称','被保人年龄','保障金额','保费','医院名称','下单时间','订单状态','操作']"
      :tds="['userId','orderNumber','nickName','insuredAge','insuranceAmount','orderAmount','hospitalName','orderDate','statusText','##[static/images/search.png,static/images/log.png,static/images/write.png]##']"
      :tableData="orderList"
      :totalPage="orderPageInfo.totalPage"
      :totalCount="orderPageInfo.totalCount"
      :nowPage="orderPageInfo.nowPage"
      :pageSize="orderPageInfo.pageSize"
      @pageHadChange="toNextPage"
      @pageSizeHadChange="changePageSize"
      @tdImgClick="operateThisRow"
    ></itable>
    <modal :show="orderInfoModal" title="订单详情" @makesure="hideModel(0)" confirmTxt="关闭" :cancelShow="false" id="orderInfoModal" :width="700">
      <div class="showOrderInfo">
        <div class="modalItemContainer">
          <div class="modalItem">
            <span class="itemName">openId：</span>
            <span class="itemValue">{{thisOrderInfo.openId}}</span>
          </div>
          <div class="modalItem">
            <span class="itemName">订单号：</span>
            <span class="itemValue">{{thisOrderInfo.orderNumber}}</span>
          </div>
        </div>
        <div class="modalItemContainer">
          <p>投保人信息</p>
          <div class="modalItem">
            <span class="itemName">姓名：</span>
            <span class="itemValue">{{thisOrderInfo.proposerName}}</span>
          </div>
          <div class="modalItem">
            <span class="itemName">性别：</span>
            <span class="itemValue">{{thisOrderInfo.proposerGender === 'F'?'女':'男'}}</span>
          </div>
          <div class="modalItem">
            <span class="itemName">证件类型：</span>
            <span class="itemValue">{{thisOrderInfo.proposerCredentialsType==='IdCard'?'身份证':'其他'}}</span>
          </div>
          <div class="modalItem">
            <span class="itemName">证件号码：</span>
            <span class="itemValue">{{thisOrderInfo.proposerCredentialsNum}}</span>
          </div>
          <div class="modalItem">
            <span class="itemName">年龄：</span>
            <span class="itemValue">{{thisOrderInfo.proposerAge}}</span>
          </div>
          <div class="modalItem">
            <span class="itemName">手机号：</span>
            <span class="itemValue">{{thisOrderInfo.proposerPhone}}</span>
          </div>
        </div>
        <div class="modalItemContainer">
          <p>被保人信息</p>
          <div class="modalItem">
            <span class="itemName">姓名：</span>
            <span class="itemValue">{{thisOrderInfo.insuredName}}</span>
          </div>
          <div class="modalItem">
            <span class="itemName">性别：</span>
            <span class="itemValue">{{thisOrderInfo.insuredGender === 'F'?'女':'男'}}</span>
          </div>
          <div class="modalItem">
            <span class="itemName">证件类型：</span>
            <span class="itemValue">{{thisOrderInfo.insuredCredentialsType==='IdCard'?'身份证':'其他'}}</span>
          </div>
          <div class="modalItem">
            <span class="itemName">证件号码：</span>
            <span class="itemValue">{{thisOrderInfo.insuredCredentialsNum}}</span>
          </div>
          <div class="modalItem">
            <span class="itemName">年龄：</span>
            <span class="itemValue">{{thisOrderInfo.insuredAge}}</span>
          </div>
          <div class="modalItem">
            <span class="itemName">手机号：</span>
            <span class="itemValue">{{thisOrderInfo.insuredPhone}}</span>
          </div>
          <div class="modalItem">
            <span class="itemName">投保人与被保人关系：</span>
            <span class="itemValue">{{thisOrderInfo.relationText}}</span>
          </div>
          <div class="modalItem">
            <span class="itemName">临床医院省份：</span>
            <span class="itemValue">{{thisOrderInfo.provinceName}}</span>
          </div>
          <div class="modalItem">
            <span class="itemName">临床医院名称：</span>
            <span class="itemValue">{{thisOrderInfo.hospitalName}}</span>
          </div>
        </div>
        <div class="modalItemContainer">
          <p>保单信息</p>
          <div class="modalItem">
            <span class="itemName">保费：</span>
            <span class="itemValue">{{thisOrderInfo.orderAmount}}</span>
          </div>
          <div class="modalItem">
            <span class="itemName">保额：</span>
            <span class="itemValue">{{thisOrderInfo.insuranceAmount}}</span>
          </div>
          <div class="modalItem">
            <span class="itemName">保单号：</span>
            <span class="itemValue">{{thisOrderInfo.policyNumber}}</span>
          </div>
          <div class="modalItem">
            <span class="itemName">订单状态：</span>
            <span class="itemValue">{{thisOrderInfo.statusText}}</span>
          </div>
          <div class="modalItem">
            <span class="itemName">保障时间：</span>
            <span class="itemValue">{{thisOrderInfo.insuranceStartDate}} 至 {{thisOrderInfo.insuranceEndDate}}</span>
          </div>
          <div class="modalItem">
            <span class="itemName">备注：</span>
            <span class="itemValue">{{thisOrderInfo.remark}}</span>
          </div>
        </div>
      </div>
    </modal>
    <modal :show="inquiryOrderModal" title="查询订单" @makesure="inquiryOrderList" @cancel="hideModel(1)" :footerBtn="inquiryOrderBtn" confirmTxt="查询"  id="inquiryOrderModal">
      <div class="inquiryOrder">
        <div class="modalItem">
          <div class="itemName">订单号</div>
          <div class="itemValue">
            <input type="text" v-model="inquiryOrderId">
          </div>
        </div>
        <div class="modalItem">
          <div class="itemName">下单时间</div>
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
          <div class="itemName">订单状态</div>
          <div class="itemValue">
            <search-input
              :value.sync="inquiryOrderStatusText"
              :searchkey.sync="inquiryOrderStatus"
              :searchData="['待确认','待支付','审核未通过','已支付','未支付','已承保','已结束']"
              :searchKeyValue="['WAIT_CONFIRM','WAIT_PAIED','AUDIT_NOT_THROUGH','PAIED','OVERTIME_PAIED','UNDERWRITE','END']"
              :onlySelect="true"
            ></search-input>
          </div>
        </div>
      </div>
    </modal>
    <modal :show="editOrderModal" title="编辑" @makesure="editOneOrder" @cancel="hideModel(2)"  confirmTxt="确定"  id="editOrderModal">
      <div class="inquiryOrder">
        <div class="modalItem">
          <div class="itemName">状态</div>
          <div class="itemValue">
            <search-input
              :value.sync="orderStatus"
              :searchData="['已结束']"
              :onlySelect="true"
              :canEdit="editOrderObj.status === 'UNDERWRITE'"
            ></search-input>
          </div>
        </div>
        <div class="modalItem">
          <div class="itemName">备注</div>
          <div class="itemValue">
            <textarea v-model="orderRemark"></textarea>
          </div>
        </div>
      </div>
    </modal>
    <modal :show="orderLogModal" title="查询订单状态" @makesure="hideModel(3)" :cancelShow="false"  confirmTxt="关闭"  id="orderLogModal" >
      <itable
        :ths="['订单号','状态','时间']"
        :tds="['order_number','statusText','createdDate']"
        :tableData="orderLogList"
        :toPagination="false"
        :showTotalCount="false"
        :minTableWidth="400"
      ></itable>
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
    name: "orderList",
    components:{
      operationBtn,
      itable,
      searchInput,
      modal,
      choice
    },
    computed:{
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
      orderList(){
        let self = this,
            orderList = self.$store.state.babyInsurance.orderList,
            relationText= ''
        orderList.map(item=>{
          item.statusText = self.getStatusText(item.status)
          switch (item.relation){
            case 'SELF':
              relationText = '本人'
              break;
            case 'SPOUSE':
              relationText = '配偶'
              break;
            case 'RELATIVE':
              relationText = '亲属'
              break;
            case 'OTHER':
              relationText = '其他'
              break;
            default:
              relationText = '其他'
          }
          item.relationText = relationText
        })
        return orderList
      },
      orderPageInfo(){
        return this.$store.state.babyInsurance.orderPageInfo
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
      orderLogList(){
        let self = this,
            data = this.$store.state.babyInsurance.orderLogList
        data.map(item=>{
          item.statusText =  self.getStatusText(item.status)
          console.log(data.statusText)
        })
        console.log(data)
        return data
      }
    },
    mounted(){
      if(this.orderList.length === 0){
        this.$store.dispatch('getBabyInsuranceOrderList',{nowPage:1,pageSize:10})
        this.$store.dispatch('getProvinceList')
      }

    },
    data(){
      return {
        orderLogModal:false,
        //编辑订单信息
        orderRemark:'',
        orderStatus:'',
        editOrderObj:{},
        editOrderModal:false,
        //查询订单变量
        inquiryOrderId:'',
        inquiryStartDate:'',
        inquiryEndDate:'',
        inquiryOrderAmount:'',
        inquiryOrderProvince:'',
        inquiryOrderProvinceId:'',
        inquiryHospital:'',
        inquiryOrderStatusText:'',
        inquiryOrderStatus:'',
        inquiryOrderBtn:[{
          name:'清除条件',
          event:this.cleanInquiryValue
        }],
        inquiryOrderObj:{},
        //结束
        inquiryOrderModal:false,
        orderInfoModal:false,
        thisOrderInfo:{},
        btns:[{
          name:'查询',
          event:this.inquiryOrder,
          style:'successBtn'
        },{
          name:'查询全部',
          event:this.inquiryAllOrder
        },]
      }
    },
    methods:{
      getStatusText(status){
        let statusText = ''
        switch (status){
          case 'WAIT_CONFIRM':
            statusText = '待确认'
            break;
          case 'WAIT_PAIED':
            statusText = '待支付'
            break;
          case 'AUDIT_NOT_THROUGH':
            statusText = '审核未通过'
            break;
          case 'PAIED':
            statusText = '已支付'
            break;
          case 'OVERTIME_PAIED':
            statusText = '未支付'
            break;
          case 'UNDERWRITE':
            statusText = '已承保'
            break;
          case 'END':
            statusText = '已结束'
            break;
          default:
            statusText = '已结束'
        }
        return statusText
      },
      editOneOrder(){
        let data = this.editOrderObj
        this.$store.dispatch('editOneOrder',{id:data.id,status:this.orderStatus!=='已结束'?data.status:'END',remark:this.orderRemark})
        this.hideModel(2)
      },
      cleanInquiryValue(){
          this.inquiryOrderId=''
          this.inquiryStartDate=''
          this.inquiryEndDate=''
          this.inquiryOrderAmount=''
          this.inquiryOrderProvince=''
          this.inquiryOrderProvinceId=''
          this.inquiryHospital=''
          this.inquiryOrderStatusText=''
          this.inquiryOrderStatus=''
          this.inquiryOrderObj = {}
      },
      inquiryOrderList(){
        let self = this,
          obj = {},
          arr = [{
            key:'orderNumber',
            value:this.inquiryOrderId
          },{
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
            value:this.inquiryOrderStatus
          }];
        for(let i=arr.length-1;i>=0;i--){
          if(self.noEmpty(arr[i].value)){
            obj[arr[i].key] = arr[i].value
          }
        }

        if(JSON.stringify(obj)!=='{}'){
          console.log(obj)
          obj.page = {
            nowPage:1,
            pageSize:10
          }
          this.inquiryOrderObj = Object.assign({},this.inquiryOrderObj,obj)
          this.$store.dispatch('searchOrder',obj)
          this.hideModel(1)
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
      operateThisRow(index,_index){
        console.log(index,_index,)
        let self= this
        switch (_index){
          case 0:
            self.thisOrderInfo = self.orderList[index]
            self.orderInfoModal = true
            maskLayer.show()
            break;
          case 1:
            console.log(self.orderList[index].orderNumber)
            this.$store.dispatch('getThisOrderLog',self.orderList[index].orderNumber)
            self.orderLogModal = true
            maskLayer.show()
            break;
          case 2:
            let data = self.orderList[index]
            self.editOrderObj = data
            if(data.hasOwnProperty('remark')){
              self.orderRemark = data.remark
            }else{
              self.orderRemark = ''
            }
            self.orderStatus = data.statusText
            self.editOrderModal = true
            maskLayer.show()
            break;
        }
      },
      changePageSize(size){
        if(JSON.stringify(this.inquiryOrderObj)!=='{}'){
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
        if(JSON.stringify(this.inquiryOrderObj)!=='{}'){
          this.inquiryOrderObj.page = {
            nowPage:nextPage,
            pageSize:this.orderPageInfo.pageSize
          }
          this.$store.dispatch('searchOrder',this.inquiryOrderObj)
        }else{
          this.$store.dispatch('getBabyInsuranceOrderList',{nowPage:nextPage,pageSize:this.orderPageInfo.pageSize})
        }
      },
      inquiryAllOrder(){
        this.$store.dispatch('getBabyInsuranceOrderList',{nowPage:1,pageSize:10})
      },
      inquiryOrder(){
        console.log('inquiryOrder')
        this.cleanInquiryValue()
        this.inquiryOrderModal = true;
        maskLayer.show()
      },
      hideModel(id){
        switch (id){
          case 0:
            this.orderInfoModal = false;
            break;
          case 1:
            this.inquiryOrderModal = false;
            break;
          case 2:
            this.editOrderModal =false
            break;
          case 3:
            this.orderLogModal = false
            break;
        }
        maskLayer.hide()
      }
    }
  }
</script>

<style scoped lang="less">
  #orderList{
    .inquiryOrder{
      .modalItem{
        display: flex;
        //align-items: center;
        justify-content:center;
        min-height:32px;
        margin-top:10px;
        .itemName{
          width:100px;
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
    .showOrderInfo{
      .modalItemContainer{
        display: flex;
        flex-wrap:wrap;
        background: #f5f5f5;
        margin:10px 0;
        padding:0 10px;
        border-radius:5px;
        p{
          width:100%;
          padding:10px 0;
          margin:0;
        }
        .modalItem{
          min-width:48%;
          height:30px;
          line-height:30px;
          margin-right:2%;
        }
      }
    }
  }
</style>
