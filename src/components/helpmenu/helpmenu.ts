/**
 * Created by isaacjiang on 2017-07-17.
 */
import {Component,Input} from '@angular/core';
import {Events} from 'ionic-angular';
import 'rxjs';
import {Api} from "../../services/api.service";
import {User} from "../../services/user.service";
import {HttpParams} from "@angular/common/http";


@Component({
    selector: 'edp-helpmenu',
    templateUrl: '../helpmenu/helpmenu.html',
    providers:[Api]
})
export class HelpMenuComponent{
    public workflow :any;
    public title:any;

    constructor(public api:Api, public events: Events,public user:User) {

    }


    private initialiazation(current_user,menuId) {
      this.title =menuId.toUpperCase()
    let root = this
    let url = "/api/dtools/taskslist"+"?username="+current_user.username
    this.api.get(url).subscribe((resp)=>{
      console.log(resp)
      root.workflow = resp
    })
  }

     menuClick(funcName){
        this.events.publish('menu-click-item',funcName)
     }


}
