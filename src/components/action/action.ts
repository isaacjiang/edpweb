import {Component} from '@angular/core';

import {Events, ModalController, NavParams, ViewController} from 'ionic-angular';
import {Api} from "../../services/api.service";
import {PdfViewerComponent} from "../pdfviewer/pdfviewer";



@Component({
  selector: 'action',
  templateUrl: 'action.html'
})
export class Action {

  private task_info:any
  private tabs:any ;
  private parameters:any ={tabs_value:[]};
  private actions: any={};

  constructor(public events: Events,
              public api:Api,
              public modalCtl:ModalController,
              public viewCtl: ViewController,
              public navParam:NavParams) {

    this.eventsHandles(this)
    this.initialization(this,navParam.data)
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


    params.data.data.forEach(function (action) {
    if( Object.keys(root.actions).indexOf(action.category) <0){
      root.actions[action.category] =[];
    }
      root.actions[action.category].push(action)

    })
    this.task_info = params.params;
    console.log(root.actions)
    this.parameters.tabs_value=Object.keys(this.actions);
    this.tabs = this.parameters.tabs_value[0]
  }

  private onTabChange(e){

  }
  private onChange(e){
    e.salaryOffer_t = this.formatNum(parseInt(e.salaryOffer))
  }

  private submit(){
    let actions = this.actions
    let selectedActions=[]
    Object.keys(actions).forEach(function (key) {
      actions[key].forEach(function (e) {
        if (e.checked) {
          selectedActions.push(e)
        }
      })
    })
//console.log(selectedActions)
    this.api.post("/api/dtools/actions",{
      username: this.task_info.username,
      taskID:this.task_info.taskID,
      companyName :this.task_info.companyName,
      teamName : this.task_info.teamName,
      period:this.task_info.period,
      actions:selectedActions
    }).subscribe(resp=>{
      console.log(resp)
      this.dismiss()
    })

  }

  private openPdf(fileInfo){
    this.modalCtl.create(PdfViewerComponent,fileInfo).present();
  }

  private fileChange(event) {
    let fileList: FileList = event.target.files;
    if(fileList.length > 0) {
      let file: File = fileList[0];
      let headers = new Headers();

      headers.append('Accept', 'application/json');

      this.api.post("/files/upload", {files:file},{observe: 'response'})
        .subscribe(
          (response) => console.log(response)
        )
    }
  }

}
