import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Events } from 'ionic-angular';
import { DataService } from '../../providers/data-service';
import { ViewPage } from '../view/view';

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public dataService: DataService,
    public events: Events
    )
  {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListPage');

    this.events.subscribe('data:loaded', (data) => {
      // user and time are the same arguments passed in `events.publish(user, time)`
      this.dataPoints = data
      console.log('Welcome', data);
    });

    console.log(this.dataService.points)
    this.dataPoints =  this.dataService.points

  }

  viewOpen(data)
  {
    this.navCtrl.push(ViewPage, {info: data})
  }



}
