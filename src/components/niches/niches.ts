import {Component, ViewChild} from '@angular/core';

import {Events, ModalController, NavParams, ViewController} from 'ionic-angular';
import {Api} from "../../services/api.service";
import {PdfViewerComponent} from "../pdfviewer/pdfviewer";
import {FileItem, FileUploader} from "ng2-file-upload";


@Component({
  selector: 'niches',
  templateUrl: 'niches.html'
})
export class Niches {

  private task_info:any
  private tabs:any ;
  private parameters:any ={tabs_value:["Niches"]};
  private niches: any={};
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

    root.niches =[{'niche':'',p4:'',p5:'',p6:'',p7:'',p8:''},{'niche':'',p4:'',p5:'',p6:'',p7:'',p8:''},{'niche':'',p4:'',p5:'',p6:'',p7:'',p8:''}]
    params.data.forEach(function (n) {
      console.log(n)
      if (n.niche == "Education" || n.niche == "Creatives") {

        if (n.period == 4) {
          root.niches[0].niche = n.niche, root.niches[0].p4 = n;
        }
        if (n.period == 5) {
          root.niches[0].niche = n.niche, root.niches[0].p5 = n;
        }
        if (n.period == 6) {
          root.niches[0].niche = n.niche, root.niches[0].p6 = n;
          root.niches[0].p6.selected = true;
        }
        if (n.period == 7) {
          root.niches[0].niche = n.niche, root.niches[0].p7 = n;
          root.niches[0].p7.selected = true;
        }
        if (n.period == 8) {
          root.niches[0].niche = n.niche, root.niches[0].p8 = n;
          root.niches[0].p8.selected = true;
        }
      }
      if (n.niche == "Government" || n.niche == "Viewers") {
        if (n.period == 4) {
          root.niches[1].niche = n.niche, root.niches[1].p4 = n;
        }
        if (n.period == 5) {
          root.niches[1].niche = n.niche, root.niches[1].p5 = n;
        }
        if (n.period == 6) {
          root.niches[1].niche = n.niche, root.niches[1].p6 = n;
          root.niches[1].p6.selected = true;
        }
        if (n.period == 7) {
          root.niches[1].niche = n.niche, root.niches[1].p7 = n;
          root.niches[1].p7.selected = true;
        }
        if (n.period == 8) {
          root.niches[1].niche = n.niche, root.niches[1].p8 = n;
          root.niches[1].p8.selected = true;
        }
      }
      if (n.niche == "Entertainment" || n.niche == "Subscribers") {
        if (n.period == 4) {
          root.niches[2].niche = n.niche, root.niches[2].p4 = n;
        }
        if (n.period == 5) {
          root.niches[2].niche = n.niche, root.niches[2].p5 = n;
        }
        if (n.period == 6) {
          root.niches[2].niche = n.niche, root.niches[2].p6 = n;
          root.niches[2].p6.selected = true;
        }
        if (n.period == 7) {
          root.niches[2].niche = n.niche, root.niches[2].p7 = n;
          root.niches[2].p7.selected = true;
        }
        if (n.period == 8) {
          root.niches[2].niche = n.niche, root.niches[2].p8 = n;
          root.niches[2].p8.selected = true;
        }
      }
    })

  }

  private onTabChange(e){

  }
  private onChange(){

  }

  private submit(){


    this.api.post("/api/dtools/niches",{
      username: this.task_info.username,
      taskID:this.task_info.taskID,
      companyName :this.task_info.companyName,
      teamName : this.task_info.teamName,
      period:this.task_info.period,
      niches:this.niches
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
