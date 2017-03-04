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
  points: any;

  constructor(public http: Http)
  {

    console.log('Hello DataService Provider');

    this.parseModel = new ParseModel();
    this.mapModel = new MapModel();

  }



  getPointsFromLocation(data)
  {

    return new Promise(resolve => {
     // We're using Angular HTTP provider to request the data,
     // then on the response, it'll map the JSON data to a parsed JS object.
     // Next, we process the data and resolve the promise with the new data.

     var url = "http://pontosaude-ernaneluis.rhcloud.com/api/v1/pontos?";

     url += "&southwestlat=" + data.swlat
     url += "&southwestlng=" + data.swlng
     url += "&northeastlat=" + data.nelat
     url += "&northeastlng=" + data.nelng

     console.log(url)

     this.http.get(url)
       .map(res => res.json())
       .subscribe(data => {
         // we've got back the raw data, now generate the core schedule data
         // and save the data for later reference
         this.points = data;
         resolve(this.points);
       });
    });


  }

  getInfoFromId(empresa_id)
  {

    return new Promise(resolve => {
     // We're using Angular HTTP provider to request the data,
     // then on the response, it'll map the JSON data to a parsed JS object.
     // Next, we process the data and resolve the promise with the new data.

     var url = "http://pontosaude-ernaneluis.rhcloud.com/api/v1/empresa/" + empresa_id

     console.log(url)

     this.http.get(url)
       .map(res => res.json())
       .subscribe(data => {
         // we've got back the raw data, now generate the core schedule data
         // and save the data for later reference
          /*data;*/
         resolve(data);
       });
    });


  }












}
