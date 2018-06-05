/**
 * Created by isaacjiang on 2017-07-17.
 */
import {Component,Input} from '@angular/core';
import {Events} from 'ionic-angular';
import 'rxjs';
import {HttpClient} from "@angular/common/http";


@Component({
    selector: 'edp-kpi',
    templateUrl: 'kpi.html'

})
export class KPIComponent {

    public formData = [];
    public formTitle:any;


    constructor(public http: HttpClient,
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

    initialiazation() {


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
