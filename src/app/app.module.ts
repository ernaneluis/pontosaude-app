import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { Http } from '@angular/http';

import { MyApp } from './app.component';

import { GoogleMapView } from '../pages/map/map';
import { ListPage } from '../pages/list/list';
import { ReportPage } from '../pages/report/report';
import { ReportTwoPage } from '../pages/report-two/report-two';
import { ViewPage } from '../pages/view/view';
import { LocationTracker } from '../providers/location-tracker';
import { DataService } from '../providers/data-service';
import { AdMobPro } from '../providers/admobpro';

@NgModule({
  declarations: [
    MyApp,
    GoogleMapView,
    ReportPage,
    ReportTwoPage,
    ListPage,
    ViewPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    GoogleMapView,
    ReportPage,
    ReportTwoPage,
    ListPage,
    ViewPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, LocationTracker, DataService, AdMobPro]
})
export class AppModule {}
