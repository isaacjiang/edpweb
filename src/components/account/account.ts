/**
 * Created by isaacjiang on 2017-07-17.
 */
import {Component,Input} from '@angular/core';
import {Events} from 'ionic-angular';
import 'rxjs';
import {HttpClient} from "@angular/common/http";
import {Api} from "../../services/api.service";


@Component({
    selector: 'edp-account',
    templateUrl: 'account.html'

})
export class AccountComponent {

    public formData = [];



    constructor(public api:Api,
                public events: Events) {
       this.eventsHandles(this)
    }

    eventsHandles(root) {
        root.events.unsubscribe('policyList')
        root.events.subscribe('policyList', (originalData) => {
            console.log(originalData)
           root.fillingData(originalData)

        })
    }

    initialiazation(current_user,menuID) {
      let root = this
      let url = "/api/account/getaccountinfo"+"?username="+current_user.username
      this.api.get(url).subscribe((res)=>{
        let resp = JSON.parse(JSON.stringify(res))
        switch (menuID){
          case "account2":{
            root.formData = resp.filter(function (d) {
              return d.accountDescType == "PL"
            })
            break;
          }
          case "account3":{
            root.formData = resp.filter(function (d) {
              return d.accountDescType == "BALANCE"
            })
            break;
          }
          case "account4":{
            root.formData = resp.filter(function (d) {
              return d.accountDescType == "CF"
            })
            break;
          }
          default:{
            root.formData = resp.filter(function (d) {
              return d.summaryFLag == true
            })
            break;
          }
        }


        console.log(root.formData)
      })
    }

    fillingData(originalData) {

        // let titleList = [];

    }
    selectLine(event){

    }

    selectCell(row,col){

    }






}
