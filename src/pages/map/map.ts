import { Component, ViewChild, ElementRef } from '@angular/core';
import { Geolocation,Geoposition } from 'ionic-native';

import { LoadingController,AlertController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { ReportPage } from '../report/report';
import {MapModel} from '../../models/map-model';
import { LocationTracker } from '../../providers/location-tracker';
import { DataService } from '../../providers/data-service';
import 'rxjs/Rx';
import * as moment from 'moment';
import { Events } from 'ionic-angular';

declare var google;



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
  bounds: any;

 constructor(private navCtrl: NavController,
  //  public af: AngularFire,
   public loadingCtrl: LoadingController,
   public toastCtrl: ToastController,
   public locationTracker: LocationTracker,
   public dataService: DataService,
   public events: Events,
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

mapZoomChanged(zoom)
{

  if(zoom >= 15 && zoom <= 17)
  {
    /*this.loadPointsFromBounds(this.bounds);*/
    console.log("mapZoomChanged")
  }

}




loadMap()
{

    this.locationTracker.getForegroundPosition().then( (position) => {

      console.log("user loc " +position.lat + " " + position.lng)
      //debugger

      let latLng = new google.maps.LatLng(-3.7337621, -38.5350491);
      // let latLng = new google.maps.LatLng(-23.4744096, -46.6700553);

      // let latLng = new google.maps.LatLng(position.lat, position.lng);

      this.userPosition = new google.maps.LatLng(position.lat, position.lng);

      let mapOptions = this.mapModel.getMapConfig();
      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      this.map.setCenter(latLng);

      this.mapModel.addUserPosition(this.map, latLng);

       this.map.addListener('zoom_changed', () => {
          this.bounds = this.map.getBounds()
       });


        this.map.addListener('zoom_changed', () => {
          this.mapZoomChanged(this.map.getZoom())
        });

        google.maps.event.addListenerOnce(this.map, 'idle', () => {
              //loaded fully
              this.bounds = this.map.getBounds()
              this.loadPointsFromBounds(this.bounds);
        });



    });


  }




  loadPointsFromBounds(bounds)
  {
      let data:any = {}
      data = {
        swlat:bounds.getSouthWest().lat(),
        swlng:bounds.getSouthWest().lng(),
        nelat:bounds.getNorthEast().lat(),
        nelng:bounds.getNorthEast().lng()
      };

      this.dataService.getPointsFromLocation(data).then(data => {
         this.dataPoints = data;

        this.events.publish('data:loaded', data);

         if(this.dataPoints.length == 0)
         {
           this.showPopup("fail", "failMsg")
         }
         else
         {
           for(var i =0; i< this.dataPoints.length; i ++)
           {
             var marker = this.mapModel.addMarker(this.map, this.dataPoints[i])
             this.addInfoWindow(this.map, marker, this.dataPoints[i])
           }

         }

      });

  }

  addInfoWindow(map, marker, data)
  {



       google.maps.event.addListener(marker, 'click', () => {

         let content = "<h5>" + data.nome + "</h5>";
         content += "<p>" + data.endereco_completo + "<p>";
         content += "<p>" + data.tipo + "<p>";

         var div = document.createElement('div');
         div.innerHTML = content;

         let infoWindow = new google.maps.InfoWindow({
           content: div
         });

          infoWindow.open(map, marker);

          div.onclick = function(){
            alert(data.id)
          };

        });


        //-3.734169, -38.531445
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
