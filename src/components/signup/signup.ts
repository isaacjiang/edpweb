import { Component } from '@angular/core';

import { IonicPage, NavController, ToastController } from 'ionic-angular';

import { User } from '../../services/user.service';
import {Root} from "../../views/root/root";


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { name: string, email: string, password: string } = {
    name: 'Test Human',
    email: 'test@example.com',
    password: 'test'
  };

  // Our translated text strings
  private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController) {


  }

  doSignup() {
    // Attempt to login in through our User service
    this.user.signup(this.account).subscribe((resp) => {
      this.navCtrl.push(Root);
    }, (err) => {

      this.navCtrl.push(Root);

      // Unable to sign up
      let toast = this.toastCtrl.create({
        message: this.signupErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }
}
