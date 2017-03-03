import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Page1 } from '../pages/page1/page1';
import { GoogleMapView } from '../pages/map/map';
import { ReportPage } from '../pages/report/report';
import { LoginPage } from '../pages/login/login';
import { ParseModel } from '../models/parse-model';
export var MyApp = (function () {
    // translate: any;
    function MyApp(platform) {
        //translate
        // this.translate = translate;
        // this.initializeTranslateServiceConfig(translate);
        this.platform = platform;
        this.parseModel = new ParseModel();
        var Parse = this.parseModel.getParse();
        var currentUser = Parse.User.current();
        if (currentUser) {
            if (currentUser.getSessionToken()) {
                console.log('currentUser has SessionToken');
                this.rootPage = GoogleMapView;
            }
        }
        else {
            this.rootPage = LoginPage;
        }
        this.initializeApp();
        // used for an example of ngFor and navigation
        this.pages = [
            { title: 'Map', component: GoogleMapView },
            { title: 'Report', component: ReportPage },
            { title: 'Logout', component: Page1 }
        ];
    }
    MyApp.prototype.initializeTranslateServiceConfig = function (translate) {
        // var userLang = navigator.language.split('-')[0];
        // userLang = /(en|pt)/gi.test(userLang) ? userLang : 'en';
        //
        // this.translate.setDefaultLang('en');
        // this.translate.use(userLang);
        translate.addLangs(["en", "pt"]);
        translate.setDefaultLang('en');
        var browserLang = translate.getBrowserLang();
        translate.use(browserLang.match(/en|pt/) ? browserLang : 'en');
    };
    MyApp.prototype.initializeApp = function () {
        this.platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
            Splashscreen.hide();
        });
    };
    MyApp.prototype.openPage = function (page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    };
    MyApp.decorators = [
        { type: Component, args: [{
                    templateUrl: 'app.html'
                },] },
    ];
    /** @nocollapse */
    MyApp.ctorParameters = [
        { type: Platform, },
    ];
    MyApp.propDecorators = {
        'nav': [{ type: ViewChild, args: [Nav,] },],
    };
    return MyApp;
}());
//# sourceMappingURL=app.component.js.map