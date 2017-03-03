import { Component } from '@angular/core';
import { NavController,  AlertController, LoadingController, Loading } from 'ionic-angular';

import { AuthService } from '../../providers/auth-service';
import { RegisterPage } from '../register/register';
import { GoogleMapView } from '../map/map';
import {ParseModel} from '../../models/parse-model';
/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage
{

  parseConfig: any;
  loading: Loading;
  parseModel: any;
  // registerCredentials = {email: '', password: ''};

  constructor(public navCtrl: NavController, private auth: AuthService, private alertCtrl: AlertController, private loadingCtrl: LoadingController) {

    this.parseModel = new ParseModel();

  }

  ionViewDidLoad() {
    console.log('Hello LoginPage Page');

    var Parse = this.parseModel.getParse();
      // var Parse = require('parse');
      // Parse.initialize(this.parseConfig.appName, 'unused');  //,,'unused'
      // Parse.masterKey =  this.parseConfig.masterKey;
      // Parse.serverURL = this.parseConfig.serverURL;

     var currentUser =  Parse.User.current();

     if(currentUser)
     {
       console.log('currentUser ok');
       var st = currentUser.getSessionToken();
       if(currentUser.getSessionToken())
       {
         console.log('currentUser has SessionToken');
         this.navCtrl.setRoot(GoogleMapView);
       }
     }

  }


  public createAccount() {
    this.navCtrl.push(RegisterPage);
  }

  public login()
  {

     this.showLoading()
     this.auth.login().subscribe(allowed =>
     {
        if (allowed) {
          setTimeout(() => {
          this.loading.dismiss();
          this.navCtrl.setRoot(GoogleMapView);
          });
        } else {
          this.showError("Access Denied");
        }
      },
      error => {
        this.showError(error);
      });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  showError(text) {
    setTimeout(() => {
      this.loading.dismiss();
    });

    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }



}//end lodinpage
