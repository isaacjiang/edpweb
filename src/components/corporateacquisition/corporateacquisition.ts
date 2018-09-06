import {Component, ViewChild} from '@angular/core';

import {Events, ModalController, NavParams, ViewController} from 'ionic-angular';
import {Api} from "../../services/api.service";
import {PdfViewerComponent} from "../pdfviewer/pdfviewer";
import {FileItem, FileUploader} from "ng2-file-upload";
import {root} from "rxjs/util/root";


@Component({
  selector: 'corporateacquisition',
  templateUrl: 'corporateacquisition.html'
})
export class Corporateacquisition {

  private task_info:any
  private tabs:any ;
  private parameters:any ={tabs_value:[]};
  private corporates: any={};
  private offer: any ={};
  private uploader: FileUploader;

  private progress=0;
  private stop_watch:any ="";

  private marketPerformance_value:any;
  private managementPerformance_value:any;
  private financialPerformance_value:any;

  constructor(public events: Events,
              public api:Api,
              public modalCtl:ModalController,
              public viewCtl: ViewController,
              public navParam:NavParams) {

    this.eventsHandles(this)
    this.initialization(this,navParam.data)
    this.fileUploadInit();
  }


  public fileUploadInit(){
    this.uploader = new FileUploader({
      url: "/api/files/upload",
      method: "POST",
      autoUpload: true
    });
    this.uploader.onCompleteItem=(item:any,resp:any,status,opt)=> {

      //console.log(JSON.parse(resp))
      this.task_info.infoFile=JSON.parse(resp)
      this.api.post("/api/dtools/updatetaskfile", {
        task_id: this.task_info._id,
        infoFile: JSON.parse(resp)
      }).subscribe(resp2 => {
        console.log(resp2)
      })

    }
  }
  private eventsHandles(root) {
    root.events.subscribe("root-login-modal-dismiss", (param) => {
      this.dismiss()
    })
  }

  private formatNum(num){
    var n = num.toString(), p = n.indexOf('.');
    return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, function($0, i){
      return p<0 || i<p ? ($0+',') : $0;
    });
  }

  private dismiss() {
    this.viewCtl.dismiss();
  }

  private initialization(root,params){

    this.task_info = params.params;


    params.data.forEach(function (d) {
      root.parameters.tabs_value.push(d.name)
      root.corporates[d.name] = d

      d.developmentCost_text = root.formatNum(d.developmentCost)
      d.minimumBid_text = root.formatNum(d.minimumBid)
    })
    root.tabs = root.corporates[Object.keys(root.corporates)[0]].name

    console.log(root.corporates)
    this.getSharePrice(this)

    this.stop_watch ="234"
    var total_time = 660
    var interval =    setInterval(function (){
      console.log(this)
      total_time -= 1
      this.progress= (1-total_time/660)*100

      this.stop_watch = (total_time/60).toFixed(0)  + ' M  ' + total_time%60 +' S '

      console.log("========",this.stop_watch)
      if (total_time == 0){
        this.interval.cancel(interval)
        this.dismiss();
      }
    },1000)
  }

  private onTabChange(e){

  }
  private onChange(){

    this.offer.total = +this.offer.cash+ this.offer.current_share_price*this.offer.shares
console.log(this.offer)
  }

  private submit(){

    this.api.post("/api/dtools/corporateacquisitions",{
      username: this.task_info.username,
      taskID:this.task_info.taskID,
      companyName :this.task_info.companyName,
      teamName : this.task_info.teamName,
      period:this.task_info.period,
      offer:this.offer
    }).subscribe(resp=>{
     // console.log(resp)
      this.dismiss()
    })

  }

  private openPdf(fileInfo){
    this.modalCtl.create(PdfViewerComponent,fileInfo).present();
  }



  private clickFileInput(){
    document.getElementById('selectedFile').click()
  }

  private fileChange(event) {
    console.log(this.uploader)
    // this.uploader.response.subscribe( res => console.log(res) );


    // let fileList: FileList = event.target.files;
    // if(fileList.length > 0) {
    //   let file: File = fileList[0];
    //   let headers = new Headers();
    //
    //   headers.append('Accept', 'application/json');
    //
    //   this.api.post("/files/upload", {files:file},{observe: 'response'})
    //     .subscribe((response) => console.log(response))
    // }
  }

  private  getSharePrice(root){

    let urlParams ="?username="+root.task_info.username

  this.api.get('/api/general/querydashboarddata'+urlParams )
   .subscribe((res) => {
   console.log(res)
  var marketPerformance = res["marketPerformance"]
  var managementPerformance = res["managementPerformance"]
  var financialPerformance = res["financialPerformance"]

  var niches = ['B2B', 'B2C', 'Education', 'Government', 'Entertainment']
  var periods = ['Previous', 'Current']
  var accountDescID = ['AB010', 'AB011', 'AB012', 'AB013', 'AB014', 'AB015']
  var accountDesc = ['Leadership', 'Marketing & Sales', 'Digital Marketing', 'Offering Suppport', 'Product development', 'Logistics & IT']
  var financialItem = ['Return on Sales', 'Return on Assets', 'Net Operating Cash Generated']

     root.marketPerformance_value = {}
  niches.forEach(function (n, i) {
    var value = {}
    periods.forEach(function (p) {
      if (marketPerformance != undefined && marketPerformance.length > 0) {
        var mp = marketPerformance.filter(function (m) {
          return m.niche == n && m.period == p
        })
        value[p] = mp.length > 0 ? (mp[0].shareRate * 100).toFixed(0) + '%' : 0
        value['rank' + p] = mp.length > 0 ? '#' + mp[0].ranking : '#'

      }


    })

    root.marketPerformance_value[n] = {"niche": n, "values": value}
  })


//console.log($scope.marketPerformance_value)


  //console.log(managementValue)
     root.managementPerformance_value = {}
  accountDescID.forEach(function (acc, i) {

    var value = {}
    periods.forEach(function (p) {
      if (managementPerformance != undefined && managementPerformance.length > 0) {
        var mp = managementPerformance.filter(function (m) {
          return m.accountDescID == acc && m.period == p
        })

        value['competenceIndex' + p] = mp.length > 0 ? (mp[0].competenceIndex * 100).toFixed(0) : 100
        value['competenceIndexRank' + p] = mp.length > 0 ? "#" + mp[0].competenceIndexRank : '#'
        value['stressIndex' + p] = mp.length > 0 ? (mp[0].stressIndex * 100).toFixed(0) : 100
        value['stressIndexRank' + p] = mp.length > 0 ? "#" + mp[0].stressIndexRank : '#'
        value['adaptabilityIndex' + p] = mp.length > 0 ? (mp[0].adaptabilityIndex * 100).toFixed(0) : 100
        value['adaptabilityIndexRank' + p] = mp.length > 0 ? "#" + mp[0].adaptabilityIndexRank : '#'
      }
    })

    root.managementPerformance_value[acc] = {"function": accountDesc[i], "values": value}
  })


  //console.log(financialValue)
     root.financialPerformance_value = {}
  financialItem.forEach(function (fi, i) {

    var value = {}
    var value_return_on_sales = {}
    var value_return_on_assest = {}
    periods.forEach(function (p, j) {


      if (financialPerformance != undefined && financialPerformance.length > 0) {
        financialPerformance.forEach(function (m) {
          if (m.values) {
            if (i == 0 && m.period == p) {
              value_return_on_sales[p] = (m.values.ROS * 100).toFixed(0) + '%'
              value_return_on_sales['rank' + p] = "#" + m.values.ROSrank
            }
            if (i == 1 && m.period == p) {
              value_return_on_assest[p] = (m.values.ROA * 100).toFixed(0) + '%'
              value_return_on_assest['rank' + p] = "#" + m.values.ROArank
            }
            if (i == 2 && m.period == p) {

              value[p] = root.formatNum(m.values.NOCG.toFixed(0))
              value['rank' + p] = "#" + m.values.NOCGrank
            }
          }

        })
      }
    })
    if (i == 0) {
      root.financialPerformance_value[fi] = {
        "financialItem": fi,
        "values": value_return_on_sales
      }
    }
    else if (i == 1) {
      root.financialPerformance_value[fi] = {
        "financialItem": fi,
        "values": value_return_on_assest
      }
    }
    else {
      root.financialPerformance_value[fi] = {"financialItem": fi, "values": value}
    }


    //$scope.financialPerformance_value[acc] = {"function":accountDesc[i],"values":value}
  })
  //console.log($scope.financialPerformance_value)
  // $scope.query_mp = {order: 'Item', page: 1};
  // $scope.limit_financialPerformance_value = {limit: $scope.financialPerformance_value.length};


  //console.log('market', res)
  var marketValue = res["marketValue"]
  var managementValue = res["managementValue"]
  var financialValue = res["financialValue"]


  //calculate great value

  //console.log("value", marketValue, managementValue, financialValue)
  var total_great_value = {}
  Object.keys(marketValue).forEach(function (teamName) {
    total_great_value[teamName] = {}
    Object.keys(marketValue[teamName]).forEach(function (period) {
      console.log(period)
      if (period != 'teamName' && +period > 1) {
        //console.log(financialValue[teamName][period - 1])
        if (financialValue[teamName][+period - 1]) {
          if (financialValue[teamName][+period - 1].NOCG <= 0) {
            financialValue[teamName][+period - 1].NOCG = 1
          }
        }
        else {
          financialValue[teamName][+period - 1] = {}
          financialValue[teamName][+period - 1].NOCG = 1
          financialValue[teamName][+period - 1].EBITDA = 1
        }

        total_great_value[teamName][period] = marketValue[teamName][period] * 0.3 * managementValue[teamName][period] * 0.3 * financialValue[teamName][+period - 1].NOCG * 0.4
      }
    })


  })
  //console.log(total_great_value)
  var max_total_great_value = {}
  //var currentPeriod = $rootScope.userAtCompany.currentPeriod
  Object.keys(total_great_value).forEach(function (teamName) {
    Object.keys(total_great_value[teamName]).forEach(function (currentPeriod) {
      //console.log(total_great_value[teamName][currentPeriod])
      if (Object.keys(max_total_great_value).indexOf(currentPeriod) < 0) {
        max_total_great_value[currentPeriod] = 0
      }
      if (total_great_value[teamName][currentPeriod] > max_total_great_value[currentPeriod]) {
        max_total_great_value[currentPeriod] = total_great_value[teamName][currentPeriod]
      }
    })
  })
  // console.log(max_total_great_value)
  Object.keys(total_great_value).forEach(function (teamName) {
    Object.keys(total_great_value[teamName]).forEach(function (currentPeriod) {
      var value = total_great_value[teamName][currentPeriod]
      total_great_value[teamName][currentPeriod] = {}
      total_great_value[teamName][currentPeriod].value = value
      total_great_value[teamName][currentPeriod].percentage = value / max_total_great_value[currentPeriod]
      var pe = 0
      if (root.task_info.companyName == 'LegacyCo' && +currentPeriod <= 4) {
        pe = 20
      }
      else if (root.task_info.companyName == 'LegacyCo' && +currentPeriod == 5) {
        pe = 5
      }
      else if (root.task_info.companyName== 'LegacyCo' && +currentPeriod == 6) {
        pe = 50
      }
      else if (root.task_info.companyName == 'LegacyCo' && +currentPeriod == 7) {
        pe = 70
      }
      else if (root.task_info.companyName == 'LegacyCo' && +currentPeriod == 8) {
        pe = 80
      }
      else if (root.task_info.companyName == 'NewCo' && +currentPeriod == 5) {
        pe = 50
      }
      else if (root.task_info.companyName == 'NewCo' && +currentPeriod == 6) {
        pe = 70
      }
      else if (root.task_info.companyName == 'NewCo' && +currentPeriod == 7) {
        pe = 80
      }
      else if (root.task_info.companyName == 'NewCo' && +currentPeriod == 8) {
        pe = 40
      }
      else {
        pe = 0
      }
      total_great_value[teamName][currentPeriod].PE = pe
      total_great_value[teamName][currentPeriod].realPE = pe * total_great_value[teamName][currentPeriod].percentage
      total_great_value[teamName][currentPeriod].EBITDA = financialValue[teamName][+currentPeriod - 1].EBITDA
      total_great_value[teamName][currentPeriod].companyValue = financialValue[teamName][+currentPeriod - 1].EBITDA * total_great_value[teamName][currentPeriod].realPE / 100
      total_great_value[teamName][currentPeriod].sharePrice = total_great_value[teamName][+currentPeriod].companyValue / 100000
    })
  })

  var great_value = total_great_value[root.task_info.teamName]

   // console.log(great_value[root.task_info.period-1])
  // $scope.great_value = {}

  // var previusCompanyValue = ($rootScope.user_info.companyInfo.currentPeriod - 1) > 1 ?
  //     great_value[$rootScope.user_info.companyInfo.currentPeriod - 1].companyValue.toFixed(0) : 0
  // var previusSharePrice = ($rootScope.user_info.companyInfo.currentPeriod - 1) > 1 ?
  //     great_value[$rootScope.user_info.companyInfo.currentPeriod - 1].sharePrice.toFixed(0) : 0
  // $scope.great_value.companyValue = {
  //     "key": "Company Value",
  //     "Previus": format(previusCompanyValue),
  //     "Current": format(great_value[$rootScope.user_info.companyInfo.currentPeriod].companyValue.toFixed(0))
  // }
  // $scope.great_value.sharePrice = {
  //     "key": "Share Price",
  //     "Previus": format(previusSharePrice),
  //     "Current": format(great_value[$rootScope.user_info.companyInfo.currentPeriod].sharePrice.toFixed(0))
  // }

  // console.log($scope.great_value)
     let current_share_price =0;
     if(great_value[root.task_info.period-1] != undefined){
       current_share_price = parseInt(root.formatNum(great_value[root.task_info.period-1].sharePrice.toFixed(0)))
     }
  root.offer = {
    cash: 0,
    shares:0,
    current_share_price: current_share_price,
    treasury_shares: 100000,
    total: 0
  }


  // $scope.query = {order: 'niche', page: 1};
  // $scope.limit_great_value = {limit: $scope.great_value.length};
})

  }
}
