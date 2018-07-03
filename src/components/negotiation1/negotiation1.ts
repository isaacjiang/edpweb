import {Component, ViewChild} from '@angular/core';

import {Events, ModalController, NavParams, ViewController} from 'ionic-angular';
import {Api} from "../../services/api.service";
import {PdfViewerComponent} from "../pdfviewer/pdfviewer";
import {FileItem, FileUploader} from "ng2-file-upload";


@Component({
  selector: 'negotiation1',
  templateUrl: 'negotiation1.html'
})
export class Negotiation1 {

  private task_info:any
  private tabs:any ;
  private parameters:any ={tabs_value:[]};
  private negotiationhr_sales: any=[];
  private negotiationhr_te: any=[];
  private negotiationhr_pd: any=[];
  private technicalExperts;
  private selectedEmployees = [];
  private calculatedValues:any={};
  private funding:any={};
  private sumInfluenceSales:any= {}
  private applyStatus
  private uploader: FileUploader;
  private action:any = false;

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
      url: "/files/upload",
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
        // $rootScope.tasklists.forEach(function (t) {
        //   if (t._id == task._id){
        //     t.infoFile = response.data[0]
        //   }
        // })
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
    console.log(params)
    params.data.data.forEach(function (d) {
              //d.src = '/photo/'+d.employeeName+'.GIF'
              if (d.photo) {
                d.url = "/files/download?filename=" + d.photo['filename'] +
                  "&id=" + d.photo['objectID'] + "&ctype=" + d.photo['content_type']
              }

              if (d.title == "Top Salespeople") {
                root.negotiationhr_sales.push(d)
              }
              else if (d.title == "Technical Experts") {
                root.negotiationhr_te.push(d)
              }
              else {
                root.negotiationhr_pd.push(d)
              }

            })

    this.task_info = params.params;
    this.parameters.tabs_value=["HR","Funding","Summary"];
    this.tabs = this.parameters.tabs_value[0]
    this.funding ={additinalProductDeveloperNumber: 0, additinalSalesNumber: 0}
    //task data
    if (params.data.taskdata != null && params.data.taskdata.negotiation != null) {
      root.status = params.data.taskdata.status
      root.selectedEmployees = []
      params.data.taskdata.negotiation.selectedEmployees.forEach(function (d) {
        //console.log(d)
        // if (d.title=="Top Salespeople") {
        //     $scope.negotiationhr_sales.forEach(function (e) {
        //         //console.log(e.employeeID, d.employeeID,e)
        //         if (e.employeeID == d.employeeID) {
        //             e.selected = true
        //         }
        //     })}
        // else if (d.title=="Technical Experts"){
        //     $scope.negotiationhr_te.forEach(function (e) {
        //         if (e.employeeID == d.employeeID) {
        //             e.selected = true}
        //     })}
        // else{$scope.negotiationhr_pd.forEach(function (e) {
        //     if (e.employeeID == d.employeeID) {e.selected = true}
        // })}

       // $scope.toggle(d,$scope.selectedEmployees)

      })

      root.funding =params.data.taskdata.negotiation.funding
      root.sumInfluenceSales =params.data.taskdata.negotiation.sumInfluenceSales
      root.calculatedValues =params.data.taskdata.negotiation.calculatedValues
      root.applyStatus = params.data.taskdata.status
    }


  }

  private onTabChange(e){

  }
  private onChange(item){
    var root = this;

     var list = this.selectedEmployees
    console.log(item)
    var result = false, idx = -1
    if (list.length > 0) {
      list.forEach(function (l, i) {
        if (l._id == item._id) {
          idx = i
          result = true
        }
      })
    }

    // var idx = list.indexOf(item);
    if (idx > -1) {
      list.splice(idx, 1);
    }
    else {
      list.push(item);
    }


    this.technicalExperts = item.technicalExperts
    //console.log(list)

    this.calculatedValues = {
      'marketingLoss': 1,
      'developmentLoss': 1,
      'marketingGain': 1,
      "developmentGain": 1
    }

    list.forEach(function (d) {
      root.calculatedValues.marketingLoss = root.calculatedValues.marketingLoss * d.marketingLoss
      root.calculatedValues.developmentLoss = root.calculatedValues.developmentLoss * d.developmentLoss
      root.calculatedValues.marketingGain = root.calculatedValues.marketingGain * d.marketingGain
      root.calculatedValues.developmentGain = root.calculatedValues.developmentGain * d.developmentGain
    })
    root.calculatedValues.marketingLoss = (root.calculatedValues.marketingLoss * 100).toFixed(2)
    root.calculatedValues.developmentLoss = (root.calculatedValues.developmentLoss * 100 ).toFixed(2)
    root.calculatedValues.marketingGain = (root.calculatedValues.marketingGain * 100).toFixed(2)
    root.calculatedValues.developmentGain = (root.calculatedValues.developmentGain * 100).toFixed(2)

    var sumInfluence = {
      'VRKidEd': 0,
      "GovVR": 0,
      "VRGames": 0,
      "MilitaryVR": 0,
      "AdEdVR": 0,
      "VRCinema": 0
    }
    list.forEach(function (d) {


      if (d.category == "ProductDeveloper") {
        // console.log(JSON.parse(d.technicalExperts.replace("u'","'")), JSON.parse(d.influenceBVs.replace("u'","'")))
        sumInfluence.VRKidEd += d.technicalExperts.sum * d.influenceBVs.VRKidEd
        sumInfluence.GovVR += d.technicalExperts.sum * d.influenceBVs.GovVR
        sumInfluence.VRGames += d.technicalExperts.sum * d.influenceBVs.VRGames
        sumInfluence.MilitaryVR += d.technicalExperts.sum * d.influenceBVs.MilitaryVR
        sumInfluence.AdEdVR += d.technicalExperts.sum * d.influenceBVs.AdEdVR
        sumInfluence.VRCinema += d.technicalExperts.sum * d.influenceBVs.VRCinema
      }

    })
    console.log('2', sumInfluence)
    root.sumInfluenceSales= {'VRKidEd': 0,
      "GovVR": 0,
      "VRGames": 0,
      "MilitaryVR": 0,
      "AdEdVR": 0,
      "VRCinema": 0
    }
    list.forEach(function (d) {
      if (d.category == "Salespeople") {
        root.sumInfluenceSales.VRKidEd += sumInfluence.VRKidEd * d.influenceBVs.VRKidEd
        root.sumInfluenceSales.GovVR += sumInfluence.GovVR * d.influenceBVs.GovVR
        root.sumInfluenceSales.VRGames += sumInfluence.VRGames * d.influenceBVs.VRGames
        root.sumInfluenceSales.MilitaryVR += sumInfluence.MilitaryVR * d.influenceBVs.MilitaryVR
        root.sumInfluenceSales.AdEdVR += sumInfluence.AdEdVR * d.influenceBVs.AdEdVR
        root.sumInfluenceSales.VRCinema += sumInfluence.VRCinema * d.influenceBVs.VRCinema
      }

    })
    console.log('3', root.sumInfluenceSales)


  }



  private submit(){


    this.api.post("/api/dtools/negotiate1",{
      username: this.task_info.username,
      taskID:this.task_info.taskID,
      companyName :this.task_info.companyName,
      teamName : this.task_info.teamName,
      period:this.task_info.period,
      selectedEmployees:this.selectedEmployees,
      funding:this.funding,
      sumInfluenceSales:this.sumInfluenceSales,
      calculatedValues:this.calculatedValues,
      action:this.action
    }).subscribe(resp=>{
      console.log(resp)
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

}
