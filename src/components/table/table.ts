/**
 * Created by isaacjiang on 2017-07-17.
 */
import {Component,Input} from '@angular/core';
import {Events} from 'ionic-angular';
import 'rxjs';
import {HttpClient} from "@angular/common/http";


@Component({
    selector: 'iins-table',
    templateUrl: '../table/table.html'

})
export class TableComponent {

    public formData = [];
    // public originalData =[];
    public formTitle:any;
    @Input() form_id:any;

    constructor(public http: HttpClient,
                public events: Events) {
       this.eventsHandles(this)
       // setTimeout(()=>{
       //     console.log('form_id',this.form_id)
       //      this.initialiaze()
       //      this.fillingData(this.originalData)
       //     console.log(this.formData)
       // },10)
    }

    eventsHandles(root) {
        root.events.unsubscribe('policyList')
        root.events.subscribe('policyList', (originalData) => {
            console.log(originalData)
           root.fillingData(originalData)

        })
    }

    // initialiaze()
    // {
    //     this.originalData =[
    //         {id:10000021,customerName:'Michael Lin',policyNo:"3502301201303",expireDate:'2017-06-09',notified:"Yes"},
    //         {id:10000022,customerName:'DDDDD Ln',policyNo:"3502301201303",expireDate:'2017-06-09',notified:"Yes"},
    //         {id:10000023,customerName:'QUR Lin',policyNo:"3502301201303",expireDate:'2017-06-09',notified:"No"},
    //         {id:10000041,customerName:'HA Lin',policyNo:"3502301201303",expireDate:'2017-06-09',notified:"Yes"},
    //         {id:10000066,customerName:'MIN Lin',policyNo:"3502301201303",expireDate:'2017-06-09',notified:"Yes"},
    //         {id:10000025,customerName:'Micha2l Lin',policyNo:"3502301201303",expireDate:'2017-06-10',notified:"Yes"},
    //         {id:10000028,customerName:'Michae4 Lin',policyNo:"3502301201304",expireDate:'2017-06-19',notified:"No"},
    //         {id:10000029,customerName:'Michae6 Lin',policyNo:"3502301201306",expireDate:'2017-06-29',notified:"Yes"}
    //         ]
    // }

    fillingData(originalData) {
        this.formData = [];
        // let titleList = [];


        if (originalData && Object.keys(originalData).length > 0) {
            console.log('table',originalData)
            if(this.form_id=='policyList'){
                this.formTitle = "Policy List"
                // titleList = ['insurer','policyHolder','policyNumber','effectiveDate','expireDate','numberOfDays']
                this.formData[0] = ['Insurer', 'Policy Holder', 'Policy No','Effective Date','Expire Date','Number of Days'];
                for(let line of originalData){
                    console.log(line)
                    let valueList = []
                    valueList[0]=line['insurer']
                    valueList[1]=line['policy']['policyHolder']
                    valueList[2]=line['policy']['policyNumber']
                    valueList[3]=line['policy']['effectiveDate']
                    valueList[4]=line['policy']['expireDate']
                    valueList[5]=line['policy']['numberOfDays']
                    this.formData.push(valueList)

                }
            }





        }
    }
    selectLine(event){

    }

    selectCell(row,col){

    }






}
