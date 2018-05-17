/**
 * Created by isaacjiang on 2017-07-17.
 */
import {Component} from '@angular/core';
import {Events} from 'ionic-angular';
import 'rxjs';
import {Api} from "../../services/api.service";
import {User} from "../../services/user.service";



@Component({
    selector: 'edp-status',
    templateUrl: '../status/status.html',
    providers:[Api]
})
export class StatusComponent{
    public workflow :any;
    public title:any;
    public user_info:any ={companyName:"",teamName:"",teamUsers:0,currentPeriod:0}


    constructor(public api:Api, public events: Events,public user:User) {

    }



    setUserInfo(user_info){
      if(user_info && user_info.userInfo){
        this.user_info.companyName = user_info.userInfo.companyName;
        this.user_info.teamName = user_info.userInfo.teamName;
        this.user_info.teamUsers = user_info.teamInfo.users.length;
        this.user_info.currentPeriod = user_info.companyInfo.currentPeriod;
      }

    }




}
