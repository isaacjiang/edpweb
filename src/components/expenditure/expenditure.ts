import {Component, ViewChild} from '@angular/core';

import {Events, ModalController, NavParams, ViewController} from 'ionic-angular';
import {Api} from "../../services/api.service";
import {PdfViewerComponent} from "../pdfviewer/pdfviewer";
import {FileItem, FileUploader} from "ng2-file-upload";


@Component({
  selector: 'expenditure',
  templateUrl: 'expenditure.html'
})
export class Expenditure {

  private task_info:any
  private tabs:any ;
  private parameters:any ={tabs_value:["DISCRETIONARY EXPENDITURE"]};
  private acc_budgets: any={};
  private uploader: FileUploader;

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

    this.task_info = params.params;

    console.log(params)
  }

  private onTabChange(e){

  }
  private onChange(){
    if(this.task_info.companyName=='NewCo'){
      if(this.acc_budgets.Niche1_AA==undefined){this.acc_budgets.Niche1_AA=0}
      if(this.acc_budgets.Niche2_AA==undefined){this.acc_budgets.Niche2_AA=0}
      if(this.acc_budgets.Niche3_AA==undefined){this.acc_budgets.Niche3_AA=0}

      if(this.acc_budgets.Niche1_DM==undefined){this.acc_budgets.Niche1_DM=0}
      if(this.acc_budgets.Niche2_DM==undefined){this.acc_budgets.Niche2_DM=0}
      if(this.acc_budgets.Niche3_DM==undefined){this.acc_budgets.Niche3_DM=0}

      if(this.acc_budgets.Niche1_PD==undefined){this.acc_budgets.Niche1_PD=0}
      if(this.acc_budgets.Niche2_PD==undefined){this.acc_budgets.Niche2_PD=0}
      if(this.acc_budgets.Niche3_PD==undefined){this.acc_budgets.Niche3_PD=0}

      this.acc_budgets.total_AA = this.formatNum(parseInt(this.acc_budgets.Niche1_AA) + parseInt(this.acc_budgets.Niche2_AA)+ parseInt(this.acc_budgets.Niche3_AA))
      this.acc_budgets.total_PD= this.formatNum(parseInt(this.acc_budgets.Niche1_PD) + parseInt(this.acc_budgets.Niche2_PD)+ parseInt(this.acc_budgets.Niche3_PD))
      this.acc_budgets.total_DM = this.formatNum(parseInt(this.acc_budgets.Niche1_DM) + parseInt(this.acc_budgets.Niche2_DM)+ parseInt(this.acc_budgets.Niche3_DM))

      this.acc_budgets.Niche1_total = this.formatNum(parseInt(this.acc_budgets.Niche1_AA) + parseInt(this.acc_budgets.Niche1_PD)+ parseInt(this.acc_budgets.Niche1_DM))
      this.acc_budgets.Niche2_total = this.formatNum(parseInt(this.acc_budgets.Niche2_AA) + parseInt(this.acc_budgets.Niche2_PD)+ parseInt(this.acc_budgets.Niche2_DM))
      this.acc_budgets.Niche3_total = this.formatNum(parseInt(this.acc_budgets.Niche3_AA) + parseInt(this.acc_budgets.Niche3_PD)+ parseInt(this.acc_budgets.Niche3_DM))
      this.acc_budgets.total_total =this.formatNum(parseInt(this.acc_budgets.Niche1_AA) + parseInt(this.acc_budgets.Niche1_PD)+ parseInt(this.acc_budgets.Niche1_DM)+
        parseInt(this.acc_budgets.Niche2_AA) + parseInt(this.acc_budgets.Niche2_PD)+ parseInt(this.acc_budgets.Niche2_DM)+
        parseInt(this.acc_budgets.Niche3_AA) + parseInt(this.acc_budgets.Niche3_PD)+ parseInt(this.acc_budgets.Niche3_DM))
    }
    else{
      if(this.acc_budgets.B2B_AA==undefined){this.acc_budgets.B2B_AA=0}
      if(this.acc_budgets.B2C_AA==undefined){this.acc_budgets.B2C_AA=0}
      if(this.acc_budgets.B2B_PD==undefined){this.acc_budgets.B2B_PD=0}
      if(this.acc_budgets.B2C_PD==undefined){this.acc_budgets.B2C_PD=0}
      if(this.acc_budgets.B2B_DM==undefined){this.acc_budgets.B2B_DM=0}
      if(this.acc_budgets.B2C_DM==undefined){this.acc_budgets.B2C_DM=0}

      this.acc_budgets.total_AA = this.formatNum(parseInt(this.acc_budgets.B2B_AA) + parseInt(this.acc_budgets.B2C_AA))
      this.acc_budgets.total_PD= this.formatNum(parseInt(this.acc_budgets.B2B_PD) + parseInt(this.acc_budgets.B2C_PD))
      this.acc_budgets.total_DM = this.formatNum(parseInt(this.acc_budgets.B2B_DM) + parseInt(this.acc_budgets.B2C_DM))

      this.acc_budgets.B2B_total = this.formatNum(parseInt(this.acc_budgets.B2B_AA) + parseInt(this.acc_budgets.B2B_PD)+ parseInt(this.acc_budgets.B2B_DM))
      this.acc_budgets.B2C_total = this.formatNum(parseInt(this.acc_budgets.B2C_AA) + parseInt(this.acc_budgets.B2C_PD)+ parseInt(this.acc_budgets.B2C_DM))
      this.acc_budgets.total_total =this.formatNum(parseInt(this.acc_budgets.B2B_AA) + parseInt(this.acc_budgets.B2B_PD)+ parseInt(this.acc_budgets.B2B_DM)+parseInt(this.acc_budgets.B2C_AA) + parseInt(this.acc_budgets.B2C_PD)+ parseInt(this.acc_budgets.B2C_DM))

    }

  }

  private submit(){

    this.api.post("/api/dtools/budget",{
      username: this.task_info.username,
      taskID:this.task_info.taskID,
      companyName :this.task_info.companyName,
      teamName : this.task_info.teamName,
      period:this.task_info.period,
      acc_budgets:this.acc_budgets
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

}
