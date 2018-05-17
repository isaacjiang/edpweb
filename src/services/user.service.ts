import 'rxjs/add/operator/toPromise';

import { Injectable } from '@angular/core';

import { Api } from './api.service';

/**
 * Most apps have the concept of a User. This is a simple provider
 * with stubs for login/signup/etc.
 *
 * This User provider makes calls to our API at the `login` and `signup` endpoints.
 *
 * By default, it expects `login` and `signup` to return a JSON object of the shape:
 *
 * ```json
 * {
 *   status: 'success',
 *   user: {
 *     // User fields your app needs, like "id", "name", "email", etc.
 *   }
 * }Ø
 * ```
 *
 * If the `status` field is not `success`, then an error is detected and returned.
 */
@Injectable()
export class User {

  constructor(public api: Api) {

  }

  status(){
   let user= this.api.get('/api/users/userstatus')

   return user
  }


  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
    let seq = this.api.post('/api/users/login', accountInfo);
    return seq;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo: any) {
    let seq = this.api.post('signup', accountInfo);
    return seq;
  }

  logout(){
    let seq =  this.api.get('/api/users/logout')
    return seq;
  }


}
