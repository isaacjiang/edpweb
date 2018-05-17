import { Component } from '@angular/core';
import {AlertController, Events, IonicPage, ModalController} from 'ionic-angular';
import {Login} from "../../components/login/login";


/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@IonicPage()
@Component({
  selector: 'welcome',
  templateUrl: 'welcome.html'
})
export class Welcome {

  constructor(public events: Events,public alertCtrl:AlertController) {

  }

  ionViewWillEnter() {

  }

  ionViewDidEnter() {

  }

  ionViewWillLeave() {

  }

  login() {
    //this.modalCtl.create(Login,null,{enableBackdropDismiss:false}).present();


    let prompt = this.alertCtrl.create({
      title: 'Login',
    //  message: "Enter a name for this new album you're so keen on adding",
      inputs: [
        {
          name: 'username',
          placeholder: 'Username'
        },
        {
          name: 'password',
          type:"password",
          placeholder: 'Password'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Login',
          handler: data => {
           // console.log('Saved clicked',data);
            this.events.publish("login-do-login", data)
          }
        }
      ]
    });
    prompt.present();

  }

  signup() {

  }
}
