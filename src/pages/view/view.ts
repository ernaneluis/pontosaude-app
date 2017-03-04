import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DataService } from '../../providers/data-service';
/*
  Generated class for the View page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-view',
  templateUrl: 'view.html'
})
export class ViewPage {

  empresa : any;
  info : any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dataService: DataService
            )
  {

    this.empresa =  this.navParams.get('info');

  }

  ionViewWi

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewPage');


  }

  ionViewWillEnter()
  {
         this.loadInfo(this.empresa.id)
  }

  loadInfo(id)
  {

    this.dataService.getInfoFromId(id).then(data => {
      console.log(data)
      this.info = data;

    });
  }

}
