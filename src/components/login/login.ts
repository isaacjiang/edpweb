import {Component} from '@angular/core';

import {Events, ViewController} from 'ionic-angular';



@Component({
  selector: 'login',
  templateUrl: 'login.html'
})
export class Login {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { username: string, password: string } = {username: "", password: ""};

  constructor(public events: Events, public viewCtl: ViewController) {
    this.eventsHandles(this)
  }

  eventsHandles(root) {
    root.events.subscribe("root-login-modal-dismiss", (param) => {
      this.dismiss()
    })

  }

  dismiss() {
    this.viewCtl.dismiss();
  }

  // Attempt to login in through our User service
  loginMessage() {
    this.events.publish("login-do-login", this.account)
  }
}
