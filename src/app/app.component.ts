import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { GoogleAnalytics} from 'ionic-native';


import { GoogleMapView } from '../pages/map/map';
import { ListPage } from '../pages/list/list';
import {ParseModel} from '../models/parse-model';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;


  data: any;

  tab1Root = GoogleMapView;
  tab2Root = ListPage;

  constructor(public platform: Platform)
  {

    // this.rootPage = GoogleMapView;


    this.initializeApp();

  }



  initializeApp() {
    this.platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        StatusBar.styleDefault();
        Splashscreen.hide();

        // google
        GoogleAnalytics.debugMode()
        GoogleAnalytics.startTrackerWithId("UA-89603972-1");

        GoogleAnalytics.enableUncaughtExceptionReporting(true).then((_success) => {
            console.log(_success)
          }).catch((_error) => {
            console.log(_error)
          });

    });
  }

  // openPage(page) {
  //   // Reset the content nav to have just this page
  //   // we wouldn't want the back button to show in this scenario
  //   if(page.component == "Logout")
  //   {
  //
  //   }
  //   else
  //   {
  //     this.nav.setRoot(page.component);
  //   }
  //
  // }



}
