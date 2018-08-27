import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { EDPWebApp } from './app.component';

import { Settings } from '../services/settings.service';
import { User } from '../services/user.service';
import { Api } from '../services/api.service';

import {Root} from "../views/root/root";
import {Welcome} from "../views/welcome/welcome";

import {MainMenuDirective} from "../directives/main.menu.directive";
import {ContentDirective} from "../directives/content.directive";
import {HeaderComponent} from "../components/header/header";
import {MenuComponent} from "../components/menu/menu";
import {Forecasting} from "../components/forecasting/forecasting";
import {HelpMenuDirective} from "../directives/help.menu.directive";
import {FixedMenuDirective} from "../directives/fixed.menu.directive";
import {BudgetMenuDirective} from "../directives/budget.menu.directive";
import {StatusDirective} from "../directives/status.directive";
import {MessagesDirective} from "../directives/message.directive";
import {StatusComponent} from "../components/status/status";
import {FixedMenuComponent} from "../components/fixedmenu/fixedmenu";
import {PdfViewerComponent} from "../components/pdfviewer/pdfviewer";
import {PdfViewerModule} from "ng2-pdf-viewer";
import {Hiring} from "../components/hiring/hiring";
import {DocumentViewer} from "@ionic-native/document-viewer";
import {Resource} from "../components/resource/resource";
import {Action} from "../components/action/action";
import {HelpMenuComponent} from "../components/helpmenu/helpmenu";
import {BudgetMenuComponent} from "../components/budgetmenu/budgetmenu";
import {FileUploadModule} from "ng2-file-upload";
import {Workforce} from "../components/workforce/workforce";
import {Expenditure} from "../components/expenditure/expenditure";
import {KPIComponent} from "../components/kpi/kpi";
import {StatisticsComponent} from "../components/statistics/statistics";
import {AccountComponent} from "../components/account/account";
import {SettingsComponent} from "../components/settings/settings";
import {KPI2Component} from "../components/kpi2/kpi2";
import {Negotiation1} from "../components/negotiation1/negotiation1";
import {Niches} from "../components/niches/niches";


@NgModule({
  declarations: [
    Root,Welcome,
    MainMenuDirective,ContentDirective,HelpMenuDirective,FixedMenuDirective,BudgetMenuDirective,StatusDirective,MessagesDirective,
    HeaderComponent,MenuComponent,FixedMenuComponent,HelpMenuComponent,BudgetMenuComponent,
    StatusComponent,PdfViewerComponent,KPIComponent,SettingsComponent,StatisticsComponent,AccountComponent,KPI2Component,
    EDPWebApp,
    Forecasting,Hiring,Resource,Action,Workforce,Expenditure,Negotiation1,Niches
  ],

  imports: [
    BrowserModule,PdfViewerModule,FileUploadModule,
    HttpClientModule,
    IonicModule.forRoot(EDPWebApp, { mode: 'ios' }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    EDPWebApp,
    Root,Welcome,
    Forecasting,Hiring,Resource,Action,Workforce,Expenditure,Negotiation1,Niches,
    MenuComponent,FixedMenuComponent,HelpMenuComponent,BudgetMenuComponent,
    StatusComponent,PdfViewerComponent,KPIComponent,SettingsComponent,StatisticsComponent,AccountComponent,KPI2Component
  ],
  providers: [
    Api,
    DocumentViewer,
    User,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
