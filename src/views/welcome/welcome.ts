import { Component } from '@angular/core';
import {AlertController, Events, IonicPage, ModalController} from 'ionic-angular';



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
            if(data.username!="" && data.password!= "" && data.username.length>=6 ){
              this.events.publish("login-do-login", data)
            }

          }
        }
      ]
    });
    prompt.present();

  }

  signup() {
    let prompt = this.alertCtrl.create({
      title: 'SignUp',
      //message: "Enter a name for this new album you're so keen on adding",
      inputs: [
        {
          name: 'username',
          placeholder: 'Username'
        },
        {
          name: 'email',
          type:"email",
          placeholder: 'Email'
        },
        {
          name: 'password',
          type:"password",
          placeholder: 'Password'
        },
        {
          name: 'password2',
          type:"password",
          placeholder: 'Confirm Password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Regular User',
          handler: data => {
            console.log('Cancel clicked');
            data.permission =1
            if(data.username!="" && data.password!= "" && data.username.length>=6 && data.password == data.password2){
              this.events.publish("signup-do-signup", data)
            }else{
//todo send message
            }
          }
        }
      ]
    });

    prompt.present();
  }
}
