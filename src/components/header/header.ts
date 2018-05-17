

/**
 * Created by isaacjiang on 2017-09-01.
 */
import {Component} from '@angular/core';
import {Events} from "ionic-angular";
import {User} from "../../services/user.service";
import {Root} from "../../views/root/root";


@Component({
    selector: 'edp-header',
    templateUrl: 'header.html'
})


export class HeaderComponent {
    public current_user:any ={username:""};
    public viewCtl = {showLogin:true,showRegister:true,showLogOut:false}


    constructor(public events: Events) {
        this.eventsHandles(this)
    }

    eventsHandles(root) {
      root.events.subscribe("root-update-user-status", (user) => {
        this.current_user=user
        this.updateViewCtrl(user)
      })
      root.events.subscribe("root-login-success", (user) => {
        this.current_user=user
        this.updateViewCtrl(user)
      })

    }

    updateViewCtrl(current_user){
      if(current_user["status"]){
        //console.log(current_user)
        if(current_user["status"]["is_authenticated"]){
          this.viewCtl.showLogin=false
          this.viewCtl.showLogOut=true
          if(current_user["permission"]==0){ this.viewCtl.showRegister=true}
        }
        else if(current_user["status"]["is_anonymous"]){
          this.viewCtl.showLogin=true
          this.viewCtl.showLogOut=false
          this.viewCtl.showRegister=false
        }
      }
    }

    loadPage(pageName) {
      this.events.publish("header-load-page",pageName)
    }
    toggleMenu(menuId) {
      this.events.publish("header-toggle-menu",menuId)
    }

    login(){
      this.events.publish("header-user-login")
    }

    logout(){
      this.events.publish("header-logout-current-user")
    }

    register(){
    }


}
