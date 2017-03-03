import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, LoadingController, Loading, AlertController, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ReportTwoPage } from '../report-two/report-two';
import {MapModel} from '../../models/map-model';

import { LocationTracker } from '../../providers/location-tracker';

declare var google;

@Component({
  selector: 'page-report',
  templateUrl: 'report.html'
})
export class ReportPage {
     marker: any;
    location: any;
    public map: any;
    @ViewChild('map') mapElement: ElementRef;
    loading: Loading;
    mapModel: MapModel;

  constructor(public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public locationTracker: LocationTracker) {

      this.mapModel = new MapModel();

  }

  ionViewDidLoad() {
    console.log('Hello ReportPage Page');
    this.loadMap();
  }



  loadMap()
  {
        this.showInstruction();
        // console.log("position "+ position.coords.latitude);

        //debugger todo pegar local do user vindo do map
        // let latLng = new google.maps.LatLng(-23.4744096, -46.6700553);

         let latLng = new google.maps.LatLng(this.locationTracker.lat, this.locationTracker.lng);

         let mapOptions = this.mapModel.getMapConfig();
         this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
         this.map.setCenter(latLng);

         //on click map
        google.maps.event.addListener(this.map, 'click', (point) =>
        {
            //clean
            this.showLoading();

            if(this.marker)
              this.marker.setMap(null);

            this.addMarker(point.latLng);

            var geocoder = new google.maps.Geocoder;
            var latlng = {lat: point.latLng.lat(), lng: point.latLng.lng()};
            geocoder.geocode({'location': latlng}, (results, status) => {

                 if (status === 'OK')
                 {
                   console.log(results);
                   if (results[0])
                   {

                       let theLocation        = this.getLocationData(results, latlng);
                       let formatted_address  = theLocation[1];
                       this.location          = theLocation[0];

                       this.addInfoWindow(formatted_address);

                       setTimeout(() =>
                       {
                           this.loading.dismiss();
                           let toast = this.toastCtrl.create({
                               message: formatted_address,
                               position: 'bottom',
                               duration: 5000
                             });
                           toast.present();
                        });
                   }
                   else {
                    console.log('No results found');
                    this.showLoading();
                   }
                 }
                 else {
                   console.log('Geocoder failed due to: ' + status);
                   this.showLoading();
                 }
               });

        });

    }


    getLocationData(googleData, latlng)
    {
      let address; let addressNumber; let city; let country; let formatedAddress;
      for(let location of googleData)
      {
          for(let component of location['address_components'])
          {
             let type = component["types"];
             if(type.indexOf("street_number") > -1 )
             {
               addressNumber = component["long_name"];
             }
             else if(type.indexOf("street_address") > -1 || type.indexOf("route")  > -1)
             {
               address = component["long_name"];
             }
             else if(type.indexOf("administrative_area_level_2") > -1 || type.indexOf("locality")  > -1)
             {
               city = component["long_name"];
             }
             else if(type.indexOf("country") > -1)
             {
               country = component["long_name"];
             }
          }

          if(address && city && country)
          {
            formatedAddress = location["formatted_address"]
            break;
          }
        }

        let location = {
          // address: address+", "+addressNumber,
          address: formatedAddress,
          city: city,
          country: country,
          geolocation: latlng,
        };
        return [location, formatedAddress];
    }


    addMarker(position)
    {

      this.marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: position
      });

    }
    //
    addInfoWindow(text)
    {
        let content = "<h5>" + text + "</h5>";
        let infoWindow = new google.maps.InfoWindow({
          content: content
        });

         google.maps.event.addListener(this.marker, 'click', () => {
            infoWindow.open(this.map, this.marker);
          });

    }


  next(){

      if(this.location)
      {
        this.navCtrl.push(ReportTwoPage,{
          location: this.location
        });
      }
      else
      {

          let alert = this.alertCtrl.create({
                  title: 'fail',
                  subTitle: 'setAddress',
                  buttons: ['OK']
                });
                alert.present(prompt);


      }
  }



  showLoading()
  {
    this.loading = this.loadingCtrl.create({
            content: "wait"
          });
          this.loading.present();


  }

  showError(text)
  {
    setTimeout(() => {
      this.loading.dismiss();
    });

    let alert = this.alertCtrl.create({
          title: 'fail',
          subTitle: text,
          buttons: ['OK']
        });
        alert.present();


  }


  showInstruction()
  {

    let toast = this.toastCtrl.create({
              message: "instructionMap",
              position: 'bottom',
              duration: 5000
            });
          toast.present();


  }


}
