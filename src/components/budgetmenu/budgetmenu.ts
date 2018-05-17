/**
 * Created by isaacjiang on 2017-07-17.
 */
import {Component} from '@angular/core';
import {Events} from 'ionic-angular';
import 'rxjs';
import {Api} from "../../services/api.service";
import {User} from "../../services/user.service";

@Component({
    selector: 'edp-budgetmenu',
    templateUrl: '../budgetmenu/budgetmenu.html',
    providers:[Api]
})
export class BudgetMenuComponent{
  private current_budget:any =[];
  private current_index = 0;
  private title:any;

    constructor(public api:Api, public events: Events,public user:User) {

    }

    private formatNum(num){
      var n = num.toString(), p = n.indexOf('.');
      return n.replace(/\d(?=(?:\d{3})+(?:\.|$))/g, function($0, i){
        return p<0 || i<p ? ($0+',') : $0;
      });
    }

    private initialiazation(current_user,menuId) {
      this.title =menuId.toUpperCase()
      let root = this
      let url = "/api/account/accountbudget"+"?username="+current_user.username
      this.api.get(url).subscribe((resp)=>{
       // console.log(resp)
        root.current_budget = resp
        root.current_budget.forEach(function (d) {
          d['currentValue_text'] = root.formatNum(d['currentValue'].toFixed())
        })
      })
  }

  private budget_input(index, budget) {
      this.current_index = index;
  }


}
