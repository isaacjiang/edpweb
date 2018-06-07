/**
 * Created by isaacjiang on 2017-07-17.
 */
import {Component,Input} from '@angular/core';
import {Events} from 'ionic-angular';
import 'rxjs';
import {HttpClient} from "@angular/common/http";
import {Api} from "../../services/api.service";


@Component({
    selector: 'edp-statistics',
    templateUrl: 'statistics.html'

})
export class StatisticsComponent {

    public formData = [];
    public formTitle:any;


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
      let url = "/api/general/querykpidata"+"?username="+current_user.username
      this.api.get(url).subscribe((resp)=>{
        console.log(resp)
      })
    }

    fillingData(originalData) {
        this.formData = [];
        // let titleList = [];

    }
    selectLine(event){

    }

    selectCell(row,col){

    }






}
