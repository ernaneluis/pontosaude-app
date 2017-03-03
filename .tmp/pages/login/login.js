import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { RegisterPage } from '../register/register';
import { GoogleMapView } from '../map/map';
import { ParseModel } from '../../models/parse-model';
/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
export var LoginPage = (function () {
    // registerCredentials = {email: '', password: ''};
    function LoginPage(navCtrl, auth, alertCtrl, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.auth = auth;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
        this.parseModel = new ParseModel();
    }
    LoginPage.prototype.ionViewDidLoad = function () {
        console.log('Hello LoginPage Page');
        var Parse = this.parseModel.getParse();
        // var Parse = require('parse');
        // Parse.initialize(this.parseConfig.appName, 'unused');  //,,'unused'
        // Parse.masterKey =  this.parseConfig.masterKey;
        // Parse.serverURL = this.parseConfig.serverURL;
        var currentUser = Parse.User.current();
        if (currentUser) {
            console.log('currentUser ok');
            var st = currentUser.getSessionToken();
            if (currentUser.getSessionToken()) {
                console.log('currentUser has SessionToken');
                this.navCtrl.setRoot(GoogleMapView);
            }
        }
    };
    LoginPage.prototype.createAccount = function () {
        this.navCtrl.push(RegisterPage);
    };
    LoginPage.prototype.login = function () {
        var _this = this;
        this.showLoading();
        this.auth.login().subscribe(function (allowed) {
            if (allowed) {
                setTimeout(function () {
                    _this.loading.dismiss();
                    _this.navCtrl.setRoot(GoogleMapView);
                });
            }
            else {
                _this.showError("Access Denied");
            }
        }, function (error) {
            _this.showError(error);
        });
    };
    LoginPage.prototype.showLoading = function () {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.loading.present();
    };
    LoginPage.prototype.showError = function (text) {
        var _this = this;
        setTimeout(function () {
            _this.loading.dismiss();
        });
        var alert = this.alertCtrl.create({
            title: 'Fail',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present(prompt);
    };
    LoginPage.decorators = [
        { type: Component, args: [{
                    selector: 'page-login',
                    templateUrl: 'login.html'
                },] },
    ];
    /** @nocollapse */
    LoginPage.ctorParameters = [
        { type: NavController, },
        { type: AuthService, },
        { type: AlertController, },
        { type: LoadingController, },
    ];
    return LoginPage;
}()); //end lodinpage
//# sourceMappingURL=login.js.map