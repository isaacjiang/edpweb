import {  HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicStorageModule, Storage } from '@ionic/storage';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { EDPWebApp } from './app.component';

import { Items } from '../config/items';
import { Settings } from '../services/settings.service';
import { User } from '../services/user.service';
import { Api } from '../services/api.service';

import {Root} from "../views/root/root";
import {Welcome} from "../views/welcome/welcome";

import {Login} from "../components/login/login";

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


export function provideSettings(storage: Storage) {
  /**
   * The Settings provider takes a set of default settings for your app.
   *
   * You can add new settings options at any time. Once the settings are saved,
   * these values will not overwrite the saved values (this can be done manually if desired).
   */
  return new Settings(storage, {
    option1: true,
    option2: 'Ionitron J. Framework',
    option3: '3',
    option4: 'Hello'
  });
}

@NgModule({
  declarations: [
    Root,Welcome,
    MainMenuDirective,ContentDirective,HelpMenuDirective,FixedMenuDirective,BudgetMenuDirective,StatusDirective,MessagesDirective,
    HeaderComponent,MenuComponent,FixedMenuComponent,HelpMenuComponent,BudgetMenuComponent,
    StatusComponent,PdfViewerComponent,
    EDPWebApp,
    Login,Forecasting,Hiring,Resource,Action,Workforce
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
    Login,Forecasting,Hiring,Resource,Action,Workforce,
    MenuComponent,FixedMenuComponent,HelpMenuComponent,BudgetMenuComponent,
    StatusComponent,PdfViewerComponent
  ],
  providers: [
    Api,
    Items,DocumentViewer,
    User,
    { provide: Settings, useFactory: provideSettings, deps: [Storage] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
