import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DataService } from '../../providers/data-service';
import {MapModel} from '../../models/map-model';
import { LocationTracker } from '../../providers/location-tracker';
import { LoadingController,AlertController } from 'ionic-angular';
import { EmailComposer } from 'ionic-native';
import {  AdMobPro } from '../../providers/admobpro';
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
  distance: any;
  mapModel: MapModel;
  loader: any;
  streetview: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public locationTracker: LocationTracker,
              public loadingCtrl: LoadingController,
              private adMobPro: AdMobPro,
              public dataService: DataService
            )
  {

    this.empresa =  this.navParams.get('info');

    this.mapModel = new MapModel();

    this.loader = this.loadingCtrl.create({
      content:   "Carregando..."
    });

    this.streetview = this.mapModel.getStreetView(this.empresa, "400x300");
  }


  ionViewDidLoad() {
      console.log('ionViewDidLoad ViewPage');
      console.log('this.distance ' +   this.locationTracker.lat);
      var dist = this.mapModel.getDistanceFromLocationInMeters({lat: this.locationTracker.lat, lng: this.locationTracker.lng}, {lat:this.empresa.lat, lng:this.empresa.lng})
      this.distance = (dist/1000).toFixed(2)

      this.adMobPro.showInterstitial();
  }

  ionViewWillEnter()
  {
         this.loadInfo(this.empresa.id)
  }

  loadInfo(id)
  {

    this.loader.present();

    this.dataService.getInfoFromId(id).then(data =>
    {

        setTimeout(() =>
        {
            console.log("get view done")
            this.info = data;
            this.loader.dismiss();

        }, 1000);

    });
  }

  openRoute()
  {
     var url = "https://www.google.com/maps/dir/";
     url += this.locationTracker.lat + "," + this.locationTracker.lng + "/";
     url += this.empresa.rua + "," + this.empresa.numero + " " + this.empresa.bairro + "," + this.empresa.municipio + "," + this.empresa.uf + "," + "Brazil";
     console.log(encodeURI(url));
     window.open(encodeURI(url), '_system', 'location=yes');
  }

  report()
  {
      console.log("report")
      EmailComposer.isAvailable().then((available: boolean) =>{

      });

      // if(available) {
        //Now we know we can send
        let email = {
          to: 'ernane.luis@gmail.com',
          subject: '[Ponto Saúde] Reportar um Problema',
          body: '[ ] Lugar não existe. [ ] Endereço Errado. [ ]Outra Informação Errada.  Por favor descreva o problema:',
          isHtml: true
        };

        // Send a text message using default options
        EmailComposer.open(email);
      // }

  }

}
