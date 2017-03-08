import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { DataService } from '../../providers/data-service';
import { ViewPage } from '../view/view';
import { LoadingController,AlertController } from 'ionic-angular';
import {MapModel} from '../../models/map-model';
import { LocationTracker } from '../../providers/location-tracker';
/*
  Generated class for the List page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

   dataPoints:any;
   searchDataPoints:Array<any>;
   loader: any;
   mapModel: MapModel;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataService: DataService,
    public loadingCtrl: LoadingController,
    public locationTracker: LocationTracker,
    public events: Events)
  {
      this.mapModel = new MapModel();
      this.searchDataPoints = [];
  }

  ionViewDidLoad()
  {
    console.log('ionViewDidLoad ListPage');

    // this.events.subscribe('data:loaded', (data) => {
    //   // user and time are the same arguments passed in `events.publish(user, time)`
    //   this.dataPoints = data
    //   console.log('Welcome', data);
    // });



  }

  ionViewWillEnter()
  {
      if(this.searchDataPoints.length > 0)
      {
          this.dataPoints = this.getDistance(this.searchDataPoints)
      }
      else {
          this.dataPoints  = this.getDistance(this.dataService.points)
      }

  }

  viewOpen(data)
  {
    this.navCtrl.push(ViewPage, {info: data})
  }

  getItems(ev: any) {

      // set val to the value of the searchbar
      let val = ev.target.value;

      // if the value is an empty string don't filter the items
      if (val && val.trim() != '' && val.trim().length >= 3)
      {
          console.log("search value")
          this.dataPoints = this.dataPoints.filter((item) => {
            return (item.nome.toLowerCase().indexOf(val.toLowerCase()) > -1);
          })

          if(this.dataPoints.length == 0)
          {
              this.loader = this.loadingCtrl.create({
                content:   "Buscando..."
              });

              this.loader.present();

              console.log("searchPoints")
              this.dataService.searchPoints(val).then(data =>
              {
                  console.log("got searchPoints")
                  setTimeout(() =>
                  {
                      var array = []
                      array = array.concat(data)

                      this.searchDataPoints = array.concat(data)

                      this.dataPoints = this.getDistance(array)
                      this.loader.dismiss();
                  }, 1000);

              });
          }

      }
      else
      {
          console.log("not search value")
          this.dataPoints  = this.getDistance(this.dataService.points)
      }
  }

  getDistance(data)
  {
      for(var i=0; i< data.length; i++)
      {

          var dist = this.mapModel.getDistanceFromLocationInMeters(
                            {lat: this.locationTracker.lat, lng: this.locationTracker.lng},
                            {lat:data[i].lat, lng:data[i].lng});

          data[i]["distance"] = (dist/1000).toFixed(2)
      }

      return data
  }





}
