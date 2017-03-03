import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {

  constructor(private nav: NavController, private auth: AuthService) {
    let info = this.auth.getUserInfo();
    // this.username = info.name;
    // this.email = info.email;
  }

  ionViewDidLoad() {
    console.log('Hello logout Page');
    this.logout();
  }

  public logout() {
    console.log("logout");
    this.auth.logout().subscribe(succ => {
        this.nav.setRoot(LoginPage)
    });
  }

}
