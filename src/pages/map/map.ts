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
import { ViewPage } from '../view/view';
import { Platform } from 'ionic-angular';
import { GoogleAnalytics} from 'ionic-native';

declare var google;



@Component({
  selector: 'map',
  templateUrl: 'map.html'
})



export class GoogleMapView {

  @ViewChild('map') mapElement: ElementRef;
  public map: any;
  public loader: any;
  public userPosition: any;
  public dataPoints: any;
  mapModel: MapModel;
  bounds: any;
  markers: any;

 constructor(private navCtrl: NavController,
   public loadingCtrl: LoadingController,
   public toastCtrl: ToastController,
   public locationTracker: LocationTracker,
   public dataService: DataService,
   public events: Events,
   public platform: Platform,
   public alertCtrl: AlertController) {



   this.mapModel = new MapModel();
   this.markers = []

   this.loader = this.loadingCtrl.create({
     content:   "Carregando..."
   });

 }

// Load map only after view is initialize
ionViewDidLoad()
{
  console.log("ionViewDidLoad")
  this.loadMap();
}

ionViewWillEnter()
{
  console.log("ionViewWillEnter")
   /*this.dataPoints = this.dataService.points;
   clearMarkers()*/
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

        this.loader.present();

        this.platform.ready().then(() =>
        {

                GoogleAnalytics.startTrackerWithId('UA-93159289-2', 30).then(() => {
                      console.log('Google analytics Map Page');
                      GoogleAnalytics.trackView("Map Page");
                      GoogleAnalytics.setAllowIDFACollection(true);
                 }).catch(e =>console.log('Error starting GoogleAnalytics: ', e));



                this.locationTracker.getForegroundPosition().then( (position) => {

                  console.log("user loc " +position.lat + " " + position.lng)

                  //debugger
                  // let latLng = new google.maps.LatLng(-3.7337621, -38.5350491);
                  // let latLng = new google.maps.LatLng(-23.4744096, -46.6700553);

                  let latLng = new google.maps.LatLng(position.lat, position.lng);

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

      // this.loader.onDidDismiss(() =>
      // {

          this.dataService.getPointsFromLocation(data).then(data =>
          {
            setTimeout(() =>
            {

              this.dataPoints = data;
              this.events.publish('data:loaded', data);

               if(this.dataPoints.length == 0)
               {
                 this.showPopup("Falha!", "Nenhuma informação cadastrada.")
               }
               else
               {
                 for(var i =0; i< this.dataPoints.length; i ++)
                 {
                   var marker = this.mapModel.addMarker(this.map, this.dataPoints[i])
                   this.addInfoWindow(this.map, marker, this.dataPoints[i])
                   this.markers.push(marker)
                 }
               }

               this.loader.dismiss();
            }, 1000);

          });



  }

  setMapOnAll(map)
  {
      for (var i = 0; i < this.markers.length; i++)
      {
        this.markers[i].setMap(map);
      }
  }
  // Removes the markers from the map, but keeps them in the array.
  clearMarkers() {
     this.setMapOnAll(null);
   }

  addInfoWindow(map, marker, data)
  {



       google.maps.event.addListener(marker, 'click', () => {

         let content = "<h5>" + data.nome + "</h5>";
        //  content += "<img src='" + this.mapModel.getStreetView(data, "350x200") +"'/>";
         content += "<p>" + data.endereco_completo + "<p>";
         content += "<p>" + data.tipo + "<p>";

         for(var i =0;i <data.convenio.length;i++)
         {
            content += "<ion-badge style='margin-left: 5px;' item-right>" + data.convenio[i] + "</ion-badge>";
         }

         var div = document.createElement('div');
         div.innerHTML = content;

         let infoWindow = new google.maps.InfoWindow({
           content: div,
           maxWidth: 300
         });

          infoWindow.open(map, marker);

          div.onclick = () =>{
            // alert(data.id)
              console.log("open view")
              this.openTest(data)
          };

        });
  }

  openTest(data)
  {
    this.navCtrl.push(ViewPage, {info: data})
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
