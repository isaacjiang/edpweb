import {Component, ViewChild} from '@angular/core';

import {Events, ModalController, NavParams, ViewController} from 'ionic-angular';
import {Api} from "../../services/api.service";
import {PdfViewerComponent} from "../pdfviewer/pdfviewer";
import {FileItem, FileUploader} from "ng2-file-upload";


@Component({
  selector: 'hiring',
  templateUrl: 'hiring.html'
})
export class Hiring {

  private task_info:any
  private tabs:any ;
  private parameters:any ={tabs_value:[]};
  private employees: any;
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

    Object.keys(params.data).forEach(function (key) {
      params.data[key].forEach(function (e) {
        if (e.photo) {
          e.url = "/files/download?filename=" + e.photo['filename'] +
            "&id=" + e.photo['objectID'] + "&ctype=" + e.photo['content_type']
        }

        e.salaryOffer_t = e.minimumSalary == undefined? 0:root.formatNum(parseInt(e.minimumSalary))
        e.salaryOffer = e.minimumSalary
      })
    })
    this.task_info = params.params;
    this.employees = params.data;
    this.parameters.tabs_value=Object.keys(this.employees);
    this.tabs = this.parameters.tabs_value[0]

  }

  private onTabChange(e){

  }
  private onChange(e){
    e.salaryOffer_t = this.formatNum(parseInt(e.salaryOffer))
  }

  private submit(){
    let employees = this.employees
    let offeredEmployees=[]
    Object.keys(employees).forEach(function (key) {
      employees[key].forEach(function (e) {
        if (e.salaryOffer) {
          offeredEmployees.push(e)
        }
      })
    })

    this.api.post("/api/dtools/hiring",{
      username: this.task_info.username,
      taskID:this.task_info.taskID,
      companyName :this.task_info.companyName,
      teamName : this.task_info.teamName,
      period:this.task_info.period,
      offer:offeredEmployees
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
