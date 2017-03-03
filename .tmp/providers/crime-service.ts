import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the CrimeService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class CrimeService {

  parseConfig: any;

  constructor(public http: Http) {
    console.log('Hello CrimeService Provider');

    this.parseConfig = {
       appName: "schild-besafe",
       serverURL: "https://besafe-parse.herokuapp.com/parse",
       masterKey: "schild#besafe"
    };

  }

  save(data)
  {

    var Parse = require('parse');
    Parse.initialize(this.parseConfig.appName, 'unused');  //,,'unused'
    Parse.masterKey =  this.parseConfig.masterKey;
    Parse.serverURL = this.parseConfig.serverURL;

    var CrimeTypeObjcId = "u6q6CPscz9" ; //getObjectId(a);

    var CrimeType = Parse.Object.extend("CrimeType");
    var query = new Parse.Query(CrimeType);
   return  query.get(CrimeTypeObjcId).then( (object) => {
      // Increment the reviews field on the Movie object

      var CrimeClass = Parse.Object.extend("CrimeTest");
      var crime = new CrimeClass();

      var damage = [{"currency":"R$","object":"","value":data['damage']}];
      var point = new Parse.GeoPoint({latitude: data['geolocation']['lat'], longitude: data['geolocation']['lng']});

      crime.set("content", data['description']);
      crime.set("country", data['country']);
      crime.set('city', data['city']);
      crime.set('address', data['address']);
      crime.set('geolocation', point);
      crime.set('damages', damage);
      crime.set("type", object);
      crime.set("reportedBy", Parse.User.current());
      let date = new Date(data['reportDate']);
      let time = new Date(data['reportTime']);
      crime.set('date_time', new Date(this.formatDateTime(date, time)) );

      return crime.save();
    }).then( (crime) => {

        console.log("crime saved");
        console.log(crime);
        if(crime) return true;
    });


  }

  formatDateTime(date,time)
  {
    // 2016-08-17T02:30:00.000+3:00
    let timezone =  -(new Date().getTimezoneOffset() / 60);
    let timezoneStr = (timezone > 0)? "+"+this.addZero(timezone)+":00" : "-"+this.addZero(timezone)+":00";
    let date_time = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate() + "T" + this.addZero(time.getHours()) + ":" + this.addZero(time.getMinutes()) + ":00" + timezoneStr;
    return date_time;
  }

  addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
  }


  // getPointsFromLocation(googleLatLng)
  // {
  //
  //   return new Promise<any>((resolve, reject) => {
  //
  //
  //     var Parse = require('parse');
  //     Parse.initialize('schild-besafe');
  //     Parse.serverURL = 'https://besafe-parse.herokuapp.com/parse';
  //
  //     var CrimeClass = new Parse.Object.extend('Crime');
  //     var point = new Parse.GeoPoint(googleLatLng.lat(),  googleLatLng.lng());
  //     var query = new Parse.Query(CrimeClass);
  //
  //     query.withinKilometers("geolocation", point, this.mapModel.radius/1000);
  //     query.include("type");
  //     query.limit(100);
  //     query.find({
  //       success: function(crimesInRadius)
  //       {
  //             // let points = [];
  //             let pointsData = [];
  //
  //             for(var i=1;i<crimesInRadius.length;i++)
  //             {
  //                 console.log("crime");
  //                 let crime     = crimesInRadius[i];
  //                 let geo       = crime.get("geolocation");
  //                 let latLng    = new google.maps.LatLng(Number(geo.latitude), Number(geo.longitude));
  //                 let crimeType = crime.get("type");
  //                 let w         = crimeType.get("weight");
  //                 // let heatmapData      = {location: latLng, weight: w};
  //                 //data for google maps
  //                 // points.push(heatmapData);
  //
  //                 let imp       = crimeType.get("impact");
  //                 let na        = crimeType.get("name");
  //                 let data      = {location: latLng, weight: w, impact: imp, name: na};
  //                 pointsData.push(data);
  //
  //             }
  //             resolve(pointsData);
  //
  //       },
  //         error: function(error)
  //         {
  //             console.log(error.message);
  //         }
  //     });
  //
  //   });    //end promise


}
