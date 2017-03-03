import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {MapModel} from '../models/map-model';
import {ParseModel} from '../models/parse-model';
import { LocalNotifications } from 'ionic-native';

declare var google;
/*
  Generated class for the DataService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class DataService {


  mapModel: MapModel;
  parseModel: ParseModel;
  // Parse: any;

  constructor(public http: Http)
  {

    console.log('Hello DataService Provider');

    this.parseModel = new ParseModel();
    this.mapModel = new MapModel();
  }

  saveBackgroundUserLocation(data, sendNot)
  {
    //geolocation{[lat] [lng]}
    this.getPointsFromLocation(data).then( (dataPoints) =>
    {
        //array dataPoints
        let stats =  this.calculateSafety(dataPoints);
        data.statistics = stats[0];

        this.saveForegroundUserLocation(data, sendNot);

        // if(sendNot){
        //     this.sendLocalNotificationStats(stats[0]);
        // }
        //
        //
        // this.saveUserLocationAndStats(data).then( (allowed) =>
        // {
        //    if (allowed) {
        //      console.log("[js] BackgroundGeolocation saveUserLocation saved")
        //    } else {
        //      console.log("[js] BackgroundGeolocation saveUserLocation not saved, at dataService")
        //    }
        //  });

    });
  }

  saveForegroundUserLocation(data, sendNot)
  {

        if(sendNot)
        {
            let copy = data.statistics.slice(0)
            this.sendLocalNotificationStats(copy);
        }

        this.saveUserLocationAndStats(data).then( (allowed) =>
        {
           if (allowed) {
             console.log("[js]  UserLocation saved")
           } else {
             console.log("[js]  UserLocation not saved, at dataService")
           }
         });

  }


  saveUserLocationAndStats(data)
  {

      var Parse = this.parseModel.getParse();

      var UserLocation = Parse.Object.extend("UserLocation");
      var object = new UserLocation();
      var point  = new Parse.GeoPoint({latitude: data['geolocation']['lat'], longitude: data['geolocation']['lng']});

      object.set("geolocation", point);
      let copy = data.statistics.slice(0)
      object.set("statistics", copy);
      object.set("user", Parse.User.current());

      console.log("[saveUserLocationAndStats] " +JSON.stringify(object))
      return object.save().then( (object) => {
          console.log("UserLocation saved");
          console.log(object);
          if(object) return true;
      });
  }

  getPointsFromLocation(data)
  {

      var Parse = this.parseModel.getParse();

      var CrimeClass = new Parse.Object.extend('Crime');
      var point = new Parse.GeoPoint(data['geolocation']['lat'],   data['geolocation']['lng']);
      var query = new Parse.Query(CrimeClass);

      query.withinKilometers("geolocation", point, this.mapModel.radius/1000);
      query.include("type");
      query.limit(1000);
      return query.find().then( (crimesInRadius) => {

        // let points = [];
        let pointsData = [];

        for(var i=1;i<crimesInRadius.length;i++)
        {
            console.log("crime");
            let crime     = crimesInRadius[i];
            let geo       = crime.get("geolocation");
            let latLng    = new google.maps.LatLng(Number(geo.latitude), Number(geo.longitude));
            let crimeType = crime.get("type");
            let w         = crimeType.get("weight");
            let imp       = crimeType.get("impact");
            let na        = crimeType.get("name");
            let data      = {location: latLng, weight: w, impact: imp, name: na};
            pointsData.push(data);

        }

        return pointsData;

      });

  }

  //return:
// [{"percentage":0.05263157894736842,"name":"Theft"},
// {"percentage":0.05263157894736842,"name":"Attempted robbery"}]

  calculateSafety(points)
  {
      //calculate safe % to map html
      let total = points.length;
      let percentages = [];

      let pointsByName = this.mapModel.groupBy(points, "name");

      for(var i =0; i < pointsByName.length;i++)
      {
        percentages.push({percentage: pointsByName[i].length/total, name: pointsByName[i][0].name });
      }

      let percentagesSortAsc = percentages.sort(function(a,b) {return (a.percentage > b.percentage) ? 1 : ((b.percentage > a.percentage) ? -1 : 0);} );

      console.log(JSON.stringify(percentagesSortAsc));

      return [percentagesSortAsc, pointsByName.length];

  } //calculateSafety


  calculateRisk()
  {

    // let highestRadiusImpact =  Math.max.apply(Math, points.map( function(obj){return obj.impact;} ) )
    // let filterPoints = this.mapModel.pointsInside(userGoogleLatLng, highestRadiusImpact, points);
    //
    //
    //
    // if(filterPoints.length > 0)
    // {
    //     let very_low  = [1, 2, 4, 10, 16];
    //     let low       = [3, 5, 6, 7, 8, 12];
    //     let moderate  = [13, 15, 19];
    //     let high      = [9, 11, 17];
    //
    //     let veryLowImpact = [];
    //     let lowImpact = [];
    //     let moderateImpact = [];
    //     let highImpact = [];
    //     // let veryHighImpact = [];
    //
    //     for(var i=0;i<points.length;i++)
    //     {
    //         //put points into box values of impact
    //         let w = points[i].weight;
    //         if (very_low.indexOf(w) > -1)
    //         {
    //             veryLowImpact.push(points[i]);
    //         }
    //         else if (low.indexOf(w) > -1)
    //         {
    //             lowImpact.push(points[i]);
    //         }
    //         else if (moderate.indexOf(w) > -1)
    //         {
    //             moderateImpact.push(points[i]);
    //         }
    //         else if (high.indexOf(w) > -1)
    //         {
    //             highImpact.push(points[i]);
    //         }
    //      }
    //
    //     let total         = veryLowImpact.length + lowImpact.length +  moderateImpact.length +  highImpact.length;
    //     let ratioVeryLow  = veryLowImpact.length/total;
    //     let ratioLow      = lowImpact.length/total;
    //     let ratioModerate = moderateImpact.length/total;
    //     let ratioHigh     = highImpact.length/total;
    //     let ratioSafe     = Math.max(ratioVeryLow, ratioLow, ratioModerate, ratioHigh);
    //
    //     console.log("You are in a area of " + (ratioSafe*100).toFixed(2) + "% of insecurity!");
    //
    //     let toast = this.toastCtrl.create({
    //         message: "You are in a area of " + (ratioSafe*100).toFixed(2) + "% of insecurity!",
    //         position: 'bottom',
    //         duration: 30000
    //       });
    //     toast.present();
    //
    // }
  }


  sendLocalNotificationStats(stats)
  {
    //asc order
    let top = stats[stats.length-1]
    let crime = top.name;
    let text = "Você estar em uma área de alto risco de " + crime;
    let title = "Cuidado!"
    this.sendLocalNotification(title, text);
  }

  sendLocalNotification(title, text)
  {
      let date = new Date(new Date().getTime() + 60000 )
      let data = {
         id: 1,
         text: text,  //JSON.stringify(this.safe)
         title: title,
         at: date, //60000 = 1 min
      };

      console.log("[not] " + date)
      console.log("[not] " + JSON.stringify(data))
      LocalNotifications.schedule([data]);


      //  //debugger comentado pq n funciona na web ionic serve
      // LocalNotifications.getAll().then( (array) => {
      //       console.log("[not] getAll")
      //       console.log(JSON.stringify(array))
      // });
      //
      // LocalNotifications.getScheduledIds().then( (array) => {
      //       console.log("[not] getScheduledIds")
      //       console.log(JSON.stringify(array))
      // });
      //
      // LocalNotifications.getTriggeredIds().then( (array) => {
      //       console.log("[not] getTriggeredIds")
      //       console.log(JSON.stringify(array))
      // });

  }





}
