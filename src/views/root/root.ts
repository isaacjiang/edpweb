/**
 * Created by isaacjiang on 2017-07-17.
 */
import {Component, ComponentFactoryResolver, ViewChild} from '@angular/core';
import {
  MenuController,
  LoadingController,
  App,
  Events,
  IonicPage,
  NavController,
  ToastController,
  ModalController
} from 'ionic-angular';
import 'rxjs';
import {MainMenuDirective} from "../../directives/main.menu.directive";
import {MenuComponent} from "../../components/menu/menu";
import {ContentDirective} from "../../directives/content.directive";
import {User} from "../../services/user.service";
import {Welcome} from "../welcome/welcome";
import {Api} from "../../services/api.service";
import {Forecasting} from "../../components/forecasting/forecasting";
import {HelpMenuDirective} from "../../directives/help.menu.directive";
import {FixedMenuDirective} from "../../directives/fixed.menu.directive";
import {BudgetMenuDirective} from "../../directives/budget.menu.directive";
import {StatusComponent} from "../../components/status/status";
import {StatusDirective} from "../../directives/status.directive";
import {FixedMenuComponent} from "../../components/fixedmenu/fixedmenu";
import {Hiring} from "../../components/hiring/hiring";
import {Resource} from "../../components/resource/resource";
import {Action} from "../../components/action/action";
import {HelpMenuComponent} from "../../components/helpmenu/helpmenu";
import {BudgetMenuComponent} from "../../components/budgetmenu/budgetmenu";

@IonicPage()
@Component({
    templateUrl: '../root/root.html',
})
export class Root {
   @ViewChild(MainMenuDirective) mainMenuHost: MainMenuDirective;
   @ViewChild(HelpMenuDirective) helpMenuHost: HelpMenuDirective;
   @ViewChild(BudgetMenuDirective) budgetMenuHost: BudgetMenuDirective;
   @ViewChild(FixedMenuDirective) fixedMenuHost: FixedMenuDirective;
   @ViewChild(ContentDirective) contentHost: ContentDirective;
   @ViewChild(StatusDirective) statusMenuHost: StatusDirective;

  public current_user:any;
  public user_info:any;
  private loader:any;
    constructor(
                public events: Events,
                public menuCtrl: MenuController,
                public navCtrl: NavController,
                public api:Api,
                public user: User,
                public modalCtl: ModalController,
                public toastCtrl: ToastController,
                public loadingCtrl: LoadingController,
                private componentFactoryResolver: ComponentFactoryResolver,
                public app: App)
    {
      this.authentication()
      this.eventsHandles(this)
    }

    ionViewWillEnter() {
      this.loader = this.loadingCtrl.create({
        content: "Please wait...",
        duration: 3000
      });
      this.loader.present();
    }

    ionViewDidEnter() {
      this.app.setTitle('EDP')
    }

    ionViewWillLeave() {
    }

    eventsHandles(root) {
      root.events.unsubscribe('header-load-page')
      root.events.unsubscribe('login-do-login')
      root.events.unsubscribe('header-logout-current-user')
      root.events.unsubscribe('menu-click-item')

      root.events.subscribe('header-load-page', (param) => {
        this.upateUserInfo(this.current_user.username);
        this.loadFixedMenu(this.fixedMenuHost.viewContainerRef,FixedMenuComponent,param)
      })
      root.events.subscribe( "header-toggle-menu", (menuId) => {
        switch (menuId){
          case "help":
            this.loadMenu(this.helpMenuHost.viewContainerRef,HelpMenuComponent,menuId)
            this.toggleHelpMenu();
            break;
          case "budget":
            this.loadMenu(this.budgetMenuHost.viewContainerRef,BudgetMenuComponent,menuId)
            this.toggleBudgetMenu();
            break;
          default:
            this.loadMenu(this.mainMenuHost.viewContainerRef,MenuComponent,menuId)
            this.toggleMainMenu();
            break;
        }

      })
      root.events.subscribe("header-user-login", () => {
        this._doLogout()
      });
      root.events.subscribe("header-logout-current-user", () => {
        this._doLogout()
      });
      root.events.subscribe('login-do-login', (account) => {
       // console.log(account)
        this._doLogin(account)
      });
      root.events.subscribe('menu-click-item', (param) => {
            console.log(param)
        this.toggleMainMenu();
        switch (param.taskID){
          case "10001":
          case "10002":
          case "10003":
          case "10004":
          case "10005":
          case "10006":
          case "10007":
            this._showForecasting(param);
            break;
          case "01001":
          case "02001":
          case "03001":
          case "05001":
            this._showHiring(param)
            break;

          case "01002":
          case "02002":
          case "03002":
          case "04002":
          case "05002":
          case "06002":
          case "07002":
            this._showWorkforce(param)
            break;

          case "01003":
          case "02003":
          case "03003":
          case "04003":
          case "05003":
          case "06003":
          case "07003":
            this._showResource(param)
            break;
          case "01004":
          case "02004":
          case "03004":
          case "04004":
          case "05004":
          case "06004":
          case "07004":
            this._showBudget(param)
            break;
          case "02005":
          case "04005":
            this._showProject(param)
            break;
          case "01005":
            this._showNegotiation1(param)
            break;
          case "03005":
            this._showNegotiation2(param)
            break;
          case "01006":
          case "02006":
          case "03006":
          case "04006":
          case "05006":
          case "06006":
          case "07006":
            this._showActions(param)
            break;
          case "04008":
          case "05008":
            this._showNiches(param)
            break;
          case "04009":
          case "05009":
          case "06009":
          case "07009":
            this._showCorporateacquisitions(param)
            break;
        }
        })
    }

    public authentication(){
      this.user.status().subscribe((resp)=>{
       // console.log(resp)
        this.current_user = resp;
        this.loader.dismiss();
        this.events.publish("root-update-user-status",this.current_user)
        if(this.current_user!=null && this.current_user['status']["is_anonymous"]){
          this.navCtrl.push(Welcome)
        }
        else{
          this.upateUserInfo(this.current_user.username);
          this.loadFixedMenu(this.fixedMenuHost.viewContainerRef,FixedMenuComponent,"home")
          // this.loadMenu(this.helpMenuHost.viewContainerRef,MenuComponent,"dashboard")
        }
      })
    }

    public loadFixedMenu(viewContainerRef,component,menuID){
      let ref =  this._loadComponent(viewContainerRef,component)
      ref.instance.setMenu(menuID)
    }

    public loadMenu(viewContainerRef,component,menuID){

      let ref =  this._loadComponent(viewContainerRef,component)
      ref.instance.initialiazation(this.current_user,menuID)
    }

    private upateUserInfo(current_username){
      let url = "/api/entities/getuserinfo"+"?username="+current_username
      this.api.get(url).subscribe((resp)=>{
        this.user_info = resp
       // console.log(resp )
        let ref = this._loadComponent(this.statusMenuHost.viewContainerRef,StatusComponent)
        ref.instance.setUserInfo(this.user_info);
      })

    }

    private toggleMainMenu() {
      this.menuCtrl.toggle("main");
    }

    private toggleHelpMenu() {
      this.menuCtrl.enable(true, 'help');
      this.menuCtrl.toggle('help');
    }

    private toggleBudgetMenu() {
      this.menuCtrl.enable(true, 'budget');
      this.menuCtrl.toggle('budget');
    }

    private _loadComponent(viewContainerRef,component) {
      viewContainerRef.clear();
      let componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
      return viewContainerRef.createComponent(componentFactory);
  }

  // Attempt to login in through our User service
    private _doLogin(account){
      this.user.login(account).subscribe((resp)=>{
        //console.log(1,resp)

        if(resp["login_status"]){
          this.navCtrl.pop()
          this.authentication()
          this.events.publish("root-login-modal-dismiss",this.current_user)
        }
        else{
          console.log(resp["message"])
        }
      })

    }

    private _doLogout(){
      this.user.logout().subscribe((resp)=>{
       // console.log("logout",resp)
        if(resp["logout_status"]){
          this.authentication()
        }
        else{
          console.log(resp["message"])
        }
      })
    }

    private _showForecasting(params){
      params['username'] = this.current_user.username
      this.modalCtl.create(Forecasting,params,{enableBackdropDismiss:false}).present();
    }

    private _showHiring(params){

     let urlParams ="?username="+this.current_user.username
       +"&taskID="+ params.taskID
       +"&companyName="+params.companyName
       +"&teamName="+ params.teamName
       +"&period="+ params.period

     this.api.get("/api/dtools/hiring"+urlParams)
       .subscribe((employees)=>{
          console.log(employees)
         this.modalCtl.create(Hiring,{params:params,data:employees},{enableBackdropDismiss:false}).present();
         }
       )



  }

    private _showWorkforce(params){

    let urlParams ="?username="+this.current_user.username
      +"&taskID="+ params.taskID
      +"&companyName="+params.companyName
      +"&teamName="+ params.teamName
      +"&period="+ params.period

    this.api.get("/api/dtools/hiring"+urlParams)
      .subscribe((employees)=>{
          console.log(employees)
          this.modalCtl.create(Hiring,{params:params,data:employees},{enableBackdropDismiss:false}).present();
        }
      )



  }

    private _showResource(params){

    let urlParams ="?username="+this.current_user.username
      +"&taskID="+ params.taskID
      +"&companyName="+params.companyName
      +"&teamName="+ params.teamName
      +"&period="+ params.period


    this.api.get("/api/dtools/resource"+urlParams)
      .subscribe((resource)=>{
         // console.log(resource)
        let resources={}
        resource['data'].forEach(res=>{
          console.log(res)
          if(Object.keys(resources).indexOf(res.resourceType)<0){resources[res.resourceType] = []}
          resources[res.resourceType].push(res)
        })
        console.log(resources)
          this.modalCtl.create(Resource,{params:params,data:resources},{enableBackdropDismiss:false}).present();
        }
      )




  }

    private _showBudget(params){

      let urlParams ="?username="+this.current_user.username
        +"&taskID="+ params.taskID
        +"&companyName="+params.companyName
        +"&teamName="+ params.teamName
        +"&period="+ params.period

      this.api.get("/api/dtools/hiring"+urlParams)
        .subscribe((employees)=>{
            console.log(employees)
            this.modalCtl.create(Hiring,{params:params,data:employees},{enableBackdropDismiss:false}).present();
          }
        )



    }

    private _showVisionarycompetition(params){

      let urlParams ="?username="+this.current_user.username
        +"&taskID="+ params.taskID
        +"&companyName="+params.companyName
        +"&teamName="+ params.teamName
        +"&period="+ params.period

      this.api.get("/api/dtools/hiring"+urlParams)
        .subscribe((employees)=>{
            console.log(employees)
            this.modalCtl.create(Hiring,{params:params,data:employees},{enableBackdropDismiss:false}).present();
          }
        )



    }

    private _showActions(params){

      let urlParams ="?username="+this.current_user.username
        +"&taskID="+ params.taskID
        +"&companyName="+params.companyName
        +"&teamName="+ params.teamName
        +"&period="+ params.period

      this.api.get("/api/dtools/actions"+urlParams)
        .subscribe((actions)=>{
           // console.log(actions)
            this.modalCtl.create(Action,{params:params,data:actions},{enableBackdropDismiss:false}).present();
          }
        )



    }

    private _showProject(params){

      let urlParams ="?username="+this.current_user.username
        +"&taskID="+ params.taskID
        +"&companyName="+params.companyName
        +"&teamName="+ params.teamName
        +"&period="+ params.period

      this.api.get("/api/dtools/hiring"+urlParams)
        .subscribe((employees)=>{
            console.log(employees)
            this.modalCtl.create(Hiring,{params:params,data:employees},{enableBackdropDismiss:false}).present();
          }
        )



    }

    private _showNiches(params){

      let urlParams ="?username="+this.current_user.username
        +"&taskID="+ params.taskID
        +"&companyName="+params.companyName
        +"&teamName="+ params.teamName
        +"&period="+ params.period

      this.api.get("/api/dtools/hiring"+urlParams)
        .subscribe((employees)=>{
            console.log(employees)
            this.modalCtl.create(Hiring,{params:params,data:employees},{enableBackdropDismiss:false}).present();
          }
        )



    }

    private _showCorporateacquisitions(params){

      let urlParams ="?username="+this.current_user.username
        +"&taskID="+ params.taskID
        +"&companyName="+params.companyName
        +"&teamName="+ params.teamName
        +"&period="+ params.period

      this.api.get("/api/dtools/hiring"+urlParams)
        .subscribe((employees)=>{
            console.log(employees)
            this.modalCtl.create(Hiring,{params:params,data:employees},{enableBackdropDismiss:false}).present();
          }
        )



    }

    private _showNegotiation1(params){

      let urlParams ="?username="+this.current_user.username
        +"&taskID="+ params.taskID
        +"&companyName="+params.companyName
        +"&teamName="+ params.teamName
        +"&period="+ params.period

      this.api.get("/api/dtools/hiring"+urlParams)
        .subscribe((employees)=>{
            console.log(employees)
            this.modalCtl.create(Hiring,{params:params,data:employees},{enableBackdropDismiss:false}).present();
          }
        )



    }

    private _showNegotiation2(params){

    let urlParams ="?username="+this.current_user.username
      +"&taskID="+ params.taskID
      +"&companyName="+params.companyName
      +"&teamName="+ params.teamName
      +"&period="+ params.period

    this.api.get("/api/dtools/hiring"+urlParams)
      .subscribe((employees)=>{
          console.log(employees)
          this.modalCtl.create(Hiring,{params:params,data:employees},{enableBackdropDismiss:false}).present();
        }
      )



  }

}