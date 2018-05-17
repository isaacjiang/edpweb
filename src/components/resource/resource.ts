import {Component} from '@angular/core';

import {Events, ModalController, NavParams, ViewController} from 'ionic-angular';
import {Api} from "../../services/api.service";
import {PdfViewerComponent} from "../pdfviewer/pdfviewer";



@Component({
  selector: 'resource',
  templateUrl: 'resource.html'
})
export class Resource {

  private task_info:any
  private tabs:any ;
  private parameters:any ={tabs_value:[]};
  private resource: any;

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
    console.log(params)
    this.task_info = params.params;
    this.resource = params.data;
    this.parameters.tabs_value=Object.keys(this.resource);
    this.tabs = this.parameters.tabs_value[0]
  }

  private onChange(e){

  }

  private submit(){
    let resources = this.resource
    let selectedResources= {ls:[],ma:[],sa:[],su:[],li:[],pd:[]};
    Object.keys(resources).forEach(function (key) {
      resources[key].forEach(function (e) {

        if (e.checked) {
          if(key=="Lobbyist"){
            selectedResources['ls'].push(e)
          }
          if(key=="AD&DM"){
            selectedResources['ma'].push(e)
          }
          if(key=="Distribution Partners"){
            selectedResources['sa'].push(e)
          }
          if(key=="Call Centre (inbound)"){
            selectedResources['su'].push(e)
          }
          if(key=="Production Outsourcer"){
            selectedResources['li'].push(e)
          }
          if(key=="Development Partners"){
            selectedResources['pd'].push(e)
          }

        }
      })
    })

    this.api.post("/api/dtools/resource",{
      username: this.task_info.username,
      taskID:this.task_info.taskID,
      companyName :this.task_info.companyName,
      teamName : this.task_info.teamName,
      period:this.task_info.period,
      selectedResources:selectedResources
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
