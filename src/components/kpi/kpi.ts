/**
 * Created by isaacjiang on 2017-07-17.
 */
import {Component,Input} from '@angular/core';
import {Events} from 'ionic-angular';
import 'rxjs';
import {HttpClient} from "@angular/common/http";
import {Api} from "../../services/api.service";


@Component({
    selector: 'edp-kpi',
    templateUrl: 'kpi.html'

})
export class KPIComponent {

    public hiredEmployees = [];
    public workforce=[];
  public actions=[];
  public resources=[];
  public visionarycompetition=[];

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
      let url = "/api/general/querykpidata"+"?username="+current_user.username
      this.api.get(url).subscribe((resp)=>{
        root.hiredEmployees = resp["hiredEmployees"]
        root.workforce = resp["workforce"]
        root.actions = resp["actions"]
        root.resources = resp["resources"]
        root.visionarycompetition = resp["visionarycompetition"]
        console.log(root.resources)
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
