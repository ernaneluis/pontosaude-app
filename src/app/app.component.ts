import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { GoogleAnalytics} from 'ionic-native';


import { GoogleMapView } from '../pages/map/map';
import { ListPage } from '../pages/list/list';
import {ParseModel} from '../models/parse-model';
import {AdMob} from 'ionic-native';

import {  AdMobPro } from '../providers/admobpro';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;


  data: any;

  tab1Root = GoogleMapView;
  tab2Root = ListPage;

  constructor(public platform: Platform, private adMobPro: AdMobPro)
  {


    this.initializeApp();

  }



  initializeApp() {
    this.platform.ready().then(() => {
        // Okay, so the platform is ready and our plugins are available.
        // Here you can do any higher level native things you might need.
        StatusBar.styleDefault();
        Splashscreen.hide();

        // google
        console.log("GoogleAnalytics UA-93159289-2")

        GoogleAnalytics.startTrackerWithId('UA-93159289-2', 30)
         .then(() => {
           console.log('Google analytics is ready now');
              GoogleAnalytics.trackView("App Init");
              // GoogleAnalytics.debugMode()
              GoogleAnalytics.setAllowIDFACollection(true);
           // Tracker is ready
           // You can now track pages or set additional information such as AppVersion or UserId
         })
         .catch((e) =>
         {
           console.log('Error starting GoogleAnalytics: ' + e)
           console.log('Error starting GoogleAnalytics: ', e)
         });


        this.adMobPro.showBanner();

    });
  }


}
