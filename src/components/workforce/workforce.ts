import {Component, ViewChild} from '@angular/core';

import {Events, ModalController, NavParams, ViewController} from 'ionic-angular';
import {Api} from "../../services/api.service";
import {PdfViewerComponent} from "../pdfviewer/pdfviewer";
import {FileItem, FileUploader} from "ng2-file-upload";


@Component({
  selector: 'workforce',
  templateUrl: 'workforce.html'
})
export class Workforce {

  private task_info:any
  private tabs:any ;
  private parameters:any ={tabs_value:[]};
  private workforce: any={};
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

    this.task_info = params.params;
    if (params.data){
      params.data.forecast.b2b = params.data.forecast.b2b ? params.data.forecast.b2b : 0
      params.data.forecast.b2c = params.data.forecast.b2c ? params.data.forecast.b2c : 0
      params.data.forecast.newoffering = params.data.forecast.newoffering ? params.data.forecast.newoffering : 0
      var forecast = params.data.forecast.b2b + params.data.forecast.b2c + params.data.forecast.newoffering
      //console.log(forecast)
      params.data.workforce_def.forEach(function (dv) {


        var v = params.data.valueatstart.filter(function (sv) {
          return sv.functions == dv.functions
        })

        if (v.length > 0) {
          dv.valueatstart_core = parseInt(v[0].adjustedworkforce_core)
          dv.valueatstart_contract = parseInt(v[0].adjustedworkforce_contract)
          dv.valueatstart_total = parseInt(v[0].adjustedworkforce_total)
        }
        else {
          dv.valueatstart_core = 0
          dv.valueatstart_contract = 0
          dv.valueatstart_total = 0


          if (root.task_info.period == 1 && root.task_info.companyName == 'LegacyCo') {
            if (dv.functions == 'Leadship') {
              dv.valueatstart_total = 10, dv.valueatstart_core = 10, dv.valueatstart_contract = 0
            }
            if (dv.functions == 'Logistics') {
              dv.valueatstart_total = 369, dv.valueatstart_core = 369, dv.valueatstart_contract = 0
            }
            if (dv.functions == 'Marketing') {
              dv.valueatstart_total = 492, dv.valueatstart_core = 487, dv.valueatstart_contract = 5
            }
            if (dv.functions == 'Sales') {
              dv.valueatstart_total = 164, dv.valueatstart_core = 82, dv.valueatstart_contract = 82
            }
            if (dv.functions == 'Product Development') {
              dv.valueatstart_total = 123, dv.valueatstart_core = 123, dv.valueatstart_contract = 0
            }
            if (dv.functions == 'Social Media') {
              dv.valueatstart_total = 35, dv.valueatstart_core = 24, dv.valueatstart_contract = 11
            }
          }
          if (root.task_info.period == 2 && root.task_info.companyName == 'NewCo') {
            var pd = params.data['negotiation']['negotiation']['funding']['additinalProductDeveloperNumber']
            pd = pd ? pd : 0
            var sl = params.data['negotiation']['negotiation']['funding']['additinalSalesNumber']
            sl = sl ? sl : 0

            if (dv.functions == 'Sales') {
              dv.valueatstart_total = sl, dv.valueatstart_core = parseInt((sl / 2).toString()), dv.valueatstart_contract = parseInt((sl / 2).toString())
            }
            if (dv.functions == 'Product Development') {
              dv.valueatstart_total = pd, dv.valueatstart_core = pd, dv.valueatstart_contract = 0
            }

          }
        }


      })


      for (let i=0;i<params.data.workforce_def.length;i++){
        //  d.workforce_def[i].valueatstart_core = 0
        // d.workforce_def[i].valueatstart_contract = 0
        //d.workforce_def[i].valueatstart_total =  d.workforce_def[i].valueatstart_core+ d.workforce_def[i].valueatstart_contract

        params.data.workforce_def[i].recommended_core =parseInt((forecast/(params.data.workforce_def[i].recommend_base)*(params.data.workforce_def[i].coreEmployeeRate)).toString())
        params.data.workforce_def[i].recommended_contract =parseInt( (forecast/(params.data.workforce_def[i].recommend_base)*(1-params.data.workforce_def[i].coreEmployeeRate)).toString())
      }
      //root.workforce = params.workforce_def
      //console.log($scope.workforce )
    }


    params.data.workforce_def.forEach(workforce=>{
      this.workforce[workforce['functions']] =workforce
      this.parameters.tabs_value.push(workforce['functions'])
    });
    this.tabs = this.parameters.tabs_value[0]
    console.log(this.workforce )
  }

  private onTabChange(e){

  }
  private onChange(e){
    e.salaryOffer_t = this.formatNum(parseInt(e.salaryOffer))
  }

  private submit(){
    let workforce = this.workforce
    let offeredEmployees=[]
    Object.keys(workforce).forEach(function (key) {
      workforce[key].forEach(function (e) {
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
