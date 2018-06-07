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
    selector: 'edp-fixedmenu',
    templateUrl: '../fixedmenu/fixedmenu.html',
    providers:[Api]
})
export class FixedMenuComponent{
    public workflow :any;
    public title:any;
    public user_info:any ={companyName:"",teamName:"",teamUsers:0,currentPeriod:0}


    constructor(public api:Api, public events: Events,public user:User) {

    }



    setMenu(id){
    this.title = id.toUpperCase()

      switch (id) {

        case 'statistics': {
          this._getWorkflow("dashboard")
          break;
        }
        case 'account': {
          this._getWorkflow("account")
          break;
        }
        case 'settings': {
          this._getWorkflow("settings")
          break;
        }

        default : {
          this.title = 'Home'
          this._getWorkflow("mainpage")
          break;
        }
      }


    }



    _getWorkflow(menuId) {

        let root = this
        let url = "/api/workflow/queryworkflow"+"?processName="+menuId
        //let params={username:current_user.username}


      this.api.get(url).subscribe((resp)=>{
        //console.log(menuId,resp)
        root.workflow = resp
        //console.log(root.workflow )
      })
    }


     menuClick(funcName){
        this.events.publish('fixedmenu-click-item',funcName)
     }


}
