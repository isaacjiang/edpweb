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

    public data_profitAndLoss = [];
    public data_balance= [];
    public data_cashflow= [];
    public data_total= [];


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
      console.log(menuID)
      let root = this
      let url = "/api/account/getaccountinfo"+"?username="+current_user.username
      this.api.get(url).subscribe((res)=>{
        let resp = JSON.parse(JSON.stringify(res))

        root.data_profitAndLoss = resp.filter(function (d) {
          return d.accountDescType == "PL"
        })
        root.data_balance = resp.filter(function (d) {
          return d.accountDescType == "BALANCE"
        })
        root.data_cashflow = resp.filter(function (d) {
          return d.accountDescType == "CF"
        })
        root.data_total = resp.filter(function (d) {
          return d.summaryFLag == true
        })
        console.log(root.data_balance)
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
