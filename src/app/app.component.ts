import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';


import {Root} from "../views/root/root";

@Component({
  templateUrl: "../app/app.html"
})
export class EDPWebApp {

  root:any = Root;

  constructor(platform: Platform) {

    platform.ready().then(() => {

        console.log("Application EDP is ready.")
    });

  }





}
