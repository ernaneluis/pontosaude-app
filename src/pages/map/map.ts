import { Component, ViewChild, ElementRef } from '@angular/core';
import { Geolocation,Geoposition } from 'ionic-native';

import { LoadingController,AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { ReportPage } from '../report/report';
import {MapModel} from '../../models/map-model';
import { LocationTracker } from '../../providers/location-tracker';
import { DataService } from '../../providers/data-service';
// import {TranslateService, TranslatePipe} from 'ng2-translate/ng2-translate';

// import {AngularFire, FirebaseListObservable} from 'angularfire2';
import * as moment from 'moment';

declare var google;

//
// export class UserPosition {
//   lat: any;
//   lng: any;
//   googleLatLng: any;
//
//
//   constructor(lat, lng) {
//     this.lat = lat;
//     this.lng = lng;
//   }
// }


@Component({
  selector: 'map',
  templateUrl: 'map.html'
})



export class GoogleMapView {

  @ViewChild('map') mapElement: ElementRef;
  public map: any;
  public fire: any;
  // public crimes: FirebaseListObservable<any>;
  // query: FirebaseListObservable<any[]>;
  public loader: any;
  public userPosition: any;
  public dataPoints: any;
  mapModel: MapModel;
  public safe: any;
  pointsData: any;
  crimeTypeTranslation:any;
  mapStyleColor:any = true;
  interpolatedPoints:any = {heatmap:[], circle:[]};
  crimesQuant: any;

 constructor(private navCtrl: NavController,
  //  public af: AngularFire,
   public loadingCtrl: LoadingController,
   public toastCtrl: ToastController,
   public locationTracker: LocationTracker,
   public dataService: DataService,
  //  public translate: TranslateService,
   public alertCtrl: AlertController) {



   this.mapModel = new MapModel();



       this.loader = this.loadingCtrl.create({
         content:   "wait"
       });
       this.loader.present();

      setTimeout(() => {
         this.loader.dismiss();
       }, 5000);








    this.locationTracker.startBackgroundTracking();
 }

// Load map only after view is initialize
ionViewDidLoad()
{
  this.loadMap();
}


loadMap()
{

    this.locationTracker.getForegroundPosition().then( (position) => {

      console.log("user loc " +position.lat + " " + position.lng)
      //debugger
      // let latLng = new google.maps.LatLng(-23.4744096, -46.6700553);
      let latLng = new google.maps.LatLng(position.lat, position.lng);

      this.userPosition = new google.maps.LatLng(position.lat, position.lng);
      let mapOptions = this.mapModel.getMapConfig();
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.map.setCenter(latLng);
      this.loadPointsFromLocation(latLng);
      this.mapModel.addUserPosition(this.map, latLng);

    });


  }

  loadPointsFromLocation(userlatLng)
  {
      let data:any = {}
      data = {geolocation:{lat:userlatLng.lat(), lng:userlatLng.lng() }};

      this.dataService.getPointsFromLocation(data).then(data => {
         this.dataPoints = data;
         console.log(data)
      });

      // this.dataService.getPointsFromLocation(data).then((result) =>
      // {
      //     console.log(result);
      //     this.pointsData = result;
      //
      //     if(result.length == 0)
      //     {
      //         this.showPopup("fail", "failMsg")
      //         this.crimesQuant = "failMsg"
      //     }
      //     else
      //     {
      //
      //
      //     }
      //
      // });
  }


  // this.safe = {
  //   high:    {percentage:: "00%", name:"..." },
  //   medium:  {percentage:: "00%", name:"..." },
  //   low:     {percentage:: "00%", name:"..." },
  //   other:   {percentage:: "00%", name:"..." }
  // };



  showMyLocation()
  {
    this.mapModel.addUserPosition(this.map, this.userPosition);
    this.map.setCenter(this.userPosition);
  }

  createIssue()
  {
    this.navCtrl.push(ReportPage);
  }

  changeMapStyle()
  {
      if(this.mapStyleColor)
      {
        this.mapModel.clearHeatmap();

        if(this.interpolatedPoints.circle.length == 0)
          this.interpolatedPoints.circle = this.mapModel.interpolatePoints(this.pointsData, this.mapModel.interpolationFactor.circle);

        this.mapModel.addPointsAsCircle(this.map, this.interpolatedPoints.circle)
        this.mapStyleColor = false
      }
      else {
        this.mapModel.clearCircles();

        if(this.interpolatedPoints.heatmap.length == 0)
          this.interpolatedPoints.heatmap = this.mapModel.interpolatePoints(this.pointsData, this.mapModel.interpolationFactor.heatmap);

        this.mapModel.addPointsToHeatmap(this.map,   this.interpolatedPoints.heatmap);
        this.mapStyleColor = true
      }
  }


  showPopup(title, text)
  {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: [
       {
         text: 'OK',
         handler: data => {

         }
       }
     ]
    });
    alert.present();
  }




}
