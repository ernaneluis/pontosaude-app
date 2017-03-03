import { Component, ViewChild, ElementRef } from '@angular/core';
import { Geolocation,Geoposition } from 'ionic-native';

import { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { ReportPage } from '../report/report';
import {MapModel} from '../../models/map-model';
import { LocationTracker } from '../../providers/location-tracker';
import { DataService } from '../../providers/data-service';
// import {TranslateService, TranslatePipe} from 'ng2-translate/ng2-translate';
import {AngularFire, FirebaseListObservable} from 'angularfire2';
import * as moment from 'moment';

declare var google;


export class UserPosition {
  lat: any;
  lng: any;
  googleLatLng: any;


  constructor(lat, lng) {
    this.lat = lat;
    this.lng = lng;
  }
}


@Component({
  selector: 'map',
  templateUrl: 'map.html'
})



export class GoogleMapView {

  @ViewChild('map') mapElement: ElementRef;
  public map: any;
  public fire: any;
  public crimes: FirebaseListObservable<any>;
  // query: FirebaseListObservable<any[]>;
  public loader: any;
  public userPosition: any;
  public dataPoints: any;
  mapModel: MapModel;
  public safe: any;
  pointsData: any;

 constructor(private navCtrl: NavController,
   public af: AngularFire,
   public loadingCtrl: LoadingController,
   public toastCtrl: ToastController,
   public locationTracker: LocationTracker,
   public dataService: DataService) {


  //  this.translate = translate;

   this.safe = {
     high:    {percentage: "00%", name:"..." },
     medium:  {percentage: "00%", name:"..." },
     low:     {percentage: "00%", name:"..." },
     other:   {percentage: "00%", name:"..." }
   };

   this.mapModel = new MapModel();


    let takeloader = this.loadingCtrl.create({
       content: "Please wait...",
       dismissOnPageChange: true
     });

    this.loader = takeloader;

    setTimeout(() => {
      takeloader.present();
    }, 500);


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

      let latLng = new google.maps.LatLng(-23.4744096, -46.6700553);
      //debugger
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
      this.dataService.getPointsFromLocation(data).then((result) =>
      {
          console.log(result);
          // let pointsData: any[];

          //call base on real data
          this.pointsData = result;
          let safeStats =   this.dataService.calculateSafety(this.pointsData);

          //server
          data.statistics = safeStats[0];
          this.dataService.saveForegroundUserLocation(data, true)

          //map sending copy of safeStats
          var copy = safeStats.slice(0)
          this.calculateSafety(copy);

          //base on fake interpolated data
          let pointsHeatMap = this.mapModel.interpolatePoints(this.pointsData);
          this.mapModel.addPointsToHeatmap(this.map, pointsHeatMap);


          this.loader.dismiss();
      });
  }


  // this.safe = {
  //   high:    {percentage:: "00%", name:"..." },
  //   medium:  {percentage:: "00%", name:"..." },
  //   low:     {percentage:: "00%", name:"..." },
  //   other:   {percentage:: "00%", name:"..." }
  // };
  calculateSafety(response)
  {

      // let response =   this.dataService.calculateSafety(points);
      let percentagesSortAsc:any  = response[0];
      let pointsByName:any        = response[1];

        for(var i=0;i<Math.min(pointsByName,4);i++)
        {

            if(this.safe.high.name == "...")
            {
              let top = percentagesSortAsc.pop()
              this.safe.high.name = top.name;
              this.safe.high.percentage  = (top.percentage*100).toFixed(2) + "%";
            }
            else if(this.safe.medium.name == "...")
            {
                let top = percentagesSortAsc.pop()
                this.safe.medium.name = top.name;
                this.safe.medium.percentage  = (top.percentage*100).toFixed(2) + "%";
            }
            else if(this.safe.low.name == "...")
            {
                let top = percentagesSortAsc.pop()
                this.safe.low.name = top.name;
                this.safe.low.percentage  = (top.percentage*100).toFixed(2) + "%";
            }
            else if(this.safe.other.name == "...")
            {
                let otherPercentage = 0;
                for(var i=0;i<percentagesSortAsc.length;i++)
                {
                   otherPercentage += percentagesSortAsc[i].percentage;
                }
                this.safe.other.name = "Outros";
                this.safe.other.percentage  = (otherPercentage*100).toFixed(2) + "%";
            }

        }

  }


  showMyLocation()
  {
    this.mapModel.addUserPosition(this.map, this.userPosition);
    this.map.setCenter(this.userPosition);
  }

  createIssue()
  {
    this.navCtrl.push(ReportPage);
  }



}




//
// let takefire = this.fire;
// let query = takefire.list('/crimes', {
//   query: {
//     orderByChild: 'location/latitude',
//     startAt:point1.lat,
//     endAt:point2.lat
//   }
// });
//
// var points = [];
// query.subscribe(queriedItems=>{
//        console.log("queriedItems: "+ queriedItems.length);
//       queriedItems.forEach(element => {
//             let lat = element.location.latitude;
//             let lng = element.location.longitude;
//             let latLng = new google.maps.LatLng(Number(lat), Number(lng));
//             let w = element.type;
//             let data = {location: latLng, weight: w}
//             points.push(data);
//       });
//
//
//       // this.addPointsToHeatmap(points);
//       let newPoints = this.interpolatePoints(points);
//
//       for(var i=0;i<points.length;i++)
//       {
//         newPoints.push(points[i]);
//       }
//       let sumPoints = newPoints;
//       this.calculateSafety(sumPoints);
//       this.addPointsToHeatmap(sumPoints);
//       this.loader.dismiss();
//
//   }) //endcrimes.subscribe




//
// initMap(): Promise<any> {
//
//   this.mapInitialised = true;
//
//   return new Promise((resolve) => {
//
//     Geolocation.getCurrentPosition().then((position) => {
//
//       // UNCOMMENT FOR NORMAL USE
//       //let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
//
//       let latLng = new google.maps.LatLng(40.713744, -74.009056);
//
//       let mapOptions = {
//         center: latLng,
//         zoom: 15,
//         mapTypeId: google.maps.MapTypeId.ROADMAP
//       }
//
//       this.map = new google.maps.Map(this.mapElement, mapOptions);
//       resolve(true);
//
//     });
//
//   });
//
// }
