import {Component} from '@angular/core';

import {Events, ModalController, NavParams, ViewController} from 'ionic-angular';
import {Api} from "../../services/api.service";
import {PdfViewerComponent} from "../pdfviewer/pdfviewer";


@Component({
  selector: 'forecasting',
  templateUrl: 'forecasting.html'
})
export class Forecasting {


  private task_info:any
  private tabs:any ;
  private parameters:any ={tabs_value:["projected_sale"],tabs_disp:["Projected Sale"],labels:["B2B","B2C","New Offering"]};
  private forcast: any;

  constructor(public events: Events,
              public api:Api,
              public modalCtl:ModalController,
              public viewCtl: ViewController,
              public navParam:NavParams) {
    this.task_info = navParam.data;

    this.eventsHandles(this)
    this.initialization()
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

  private initialization(){
    this.tabs=this.parameters.tabs_value[0]
    this.forcast={b2b:0,b2c:0,newoffering:0,total:0,total_disp:"0"}
    if(this.task_info.companyName=="NewCo"){this.parameters.labels = ["Niche #1","Niche #3","Niche #3","Total"]}

    let urlParams = "?username="+this.task_info.username+"&taskID="+ this.task_info.taskID
      +"&companyName="+this.task_info.companyName+"&teamName="+ this.task_info.teamName
      +"&period="+ this.task_info.period
    this.api.get("/api/dtools/forecast"+urlParams)
      .subscribe((forecast)=>{
        if(Object.keys(forecast).length>0){this.forcast =forecast;}
        }
      )
  }

  private onChange(){
    this.forcast.total = this.forcast.b2b+this.forcast.b2c+this.forcast.newoffering
    this.forcast.total_disp= this.formatNum(this.forcast.total)
  }

  private submit(){
    //console.log(this.forcast)
    this.api.post("/api/dtools/forecast",{
      username: this.task_info.username,
      taskID:this.task_info.taskID,
      companyName :this.task_info.companyName,
      teamName : this.task_info.teamName,
      period:this.task_info.period,
      forecast:this.forcast
    }).subscribe(resp=>{
      console.log(resp)
      this.dismiss()
    })

  }

  private openPdf(fileInfo){
      this.modalCtl.create(PdfViewerComponent,fileInfo).present();
  }


}
