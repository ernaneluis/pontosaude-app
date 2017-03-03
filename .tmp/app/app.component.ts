import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
// import {TranslateService, TranslatePipe} from 'ng2-translate/ng2-translate';
// import {TranslateService} from 'ng2-translate';

import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { GoogleMapView } from '../pages/map/map';
import { ReportPage } from '../pages/report/report';
import { LoginPage } from '../pages/login/login';
import {ParseModel} from '../models/parse-model';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // rootPage: any = LoginPage;
  parseModel: ParseModel;
  rootPage: any;
  pages: Array<{title: string, component: any}>;
  // translate: any;

  constructor(public platform: Platform) //, private translate: TranslateService
  {


    //translate
    // this.translate = translate;
    // this.initializeTranslateServiceConfig(translate);


    this.parseModel = new ParseModel();
    var Parse = this.parseModel.getParse();
    var currentUser =  Parse.User.current();

     if(currentUser)
     {
       if(currentUser.getSessionToken())
       {
          console.log('currentUser has SessionToken');
          this.rootPage = GoogleMapView;
       }
     }
     else
     {
         this.rootPage = LoginPage;
     }




    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Map', component: GoogleMapView },
      { title: 'Report', component: ReportPage },
      { title: 'Logout', component:  Page1}
    ];

  }

  initializeTranslateServiceConfig(translate)
  {
    // var userLang = navigator.language.split('-')[0];
    // userLang = /(en|pt)/gi.test(userLang) ? userLang : 'en';
    //
    // this.translate.setDefaultLang('en');
    // this.translate.use(userLang);

     translate.addLangs(["en", "pt"]);
     translate.setDefaultLang('en');
     let browserLang = translate.getBrowserLang();
     translate.use(browserLang.match(/en|pt/) ? browserLang : 'en');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
