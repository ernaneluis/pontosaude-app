import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { AdMob } from 'ionic-native';

import 'rxjs/add/operator/map';

/*
  Generated class for the AdMobPro provider.
  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AdMobPro {
  private _opt;
  private _admobid;

  constructor(public platform: Platform)
  {

    	console.log('Hello Admobpro Provider');

    	platform.ready().then(() => {
	      	this._admobid = {};

    			if(platform.is('android')) {
    				this._admobid = { // for Android
              banner:       'ca-app-pub-2450368113343310/3256814394',
              interstitial: 'ca-app-pub-2450368113343310/7687013996'
    				};
    			}

  		   	if(platform.is('ios')){
  		    	this._admobid = { // for iOS
              banner:       'ca-app-pub-2450368113343310/1640480394',
              interstitial: 'ca-app-pub-2450368113343310/4593946791'
  		    	};
  		   	}
	      	this.init();
	    });
  }

  init()
  {

  	console.log("AdMob init");
  	if( !AdMob ){
  		console.log("No AdMob?");
  		return;
  	}

   	// Register AdMob events
   	// new events, with variable to differentiate: adNetwork, adType, adEvent

   	document.addEventListener('onAdFailLoad', function(data){
		console.log('onAdFailLoad: ' + JSON.stringify(data));
	});

   	document.addEventListener('onAdLoaded', function(data){
		console.log('onAdLoaded: ' + JSON.stringify(data));
   	});

	  document.addEventListener('onAdPresent', function(data){
		console.log('onAdPresent: ' + JSON.stringify(data));
   	});
   	document.addEventListener('onAdLeaveApp', function(data){
    	console.log('onAdLeaveApp: ' + JSON.stringify(data));
   	});

   	document.addEventListener('onAdDismiss', function(data){
    	console.log('onAdDismiss: ' + JSON.stringify(data));
   	});


   	this._opt = {
  		bannerId: this._admobid.banner,
  		// interstitialId: admobid.interstitial,
  		// adSize: 'SMART_BANNER',
  		// width: integer, // valid when set adSize 'CUSTOM'
  		// height: integer, // valid when set adSize 'CUSTOM'
  		position: 2,
  		offsetTopBar: true, // avoid overlapped by status bar, for iOS7+
  		// bgColor: 'black', // color name, or '#RRGGBB'
  		// x: 10,     // valid when set position to 0 / POS_XY
  		// y: 40,     // valid when set position to 0 / POS_XY
  		isTesting: true, // set to true, to receiving test ad for testing purpose
  		// autoShow: true // auto show interstitial ad when loaded, set to false if prepare/show
   	};

   	AdMob.setOptions(this._opt);
   	this.showBanner();

    this.showInterstitial();
  }

  showInterstitial(){
  	if( !AdMob ) return false;
  	console.log("showInterstitial");
  	AdMob.prepareInterstitial({
  	    adId: this._admobid.interstitial,
  	    autoShow: true
     	})

   	return true;
  }

  showBanner(){
  	if( !AdMob ) return false;

  	console.log("showBanner" );
  	AdMob.createBanner({
  	    adId: this._admobid.banner,
  	    autoShow: true
  	})

	return true;
  }

 removeAds() {
   		if( AdMob ) AdMob.removeBanner();
   	}
}
