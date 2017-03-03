import { Injectable, NgZone } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Geolocation, BackgroundGeolocation } from 'ionic-native';
import 'rxjs/add/operator/filter';
import { DataService } from './data-service';
import { MapModel } from '../models/map-model';
/*

  https://github.com/mauron85/cordova-plugin-background-geolocation
*/
export var LocationTracker = (function () {
    function LocationTracker(http, zone, dataService) {
        this.http = http;
        this.zone = zone;
        this.dataService = dataService;
        this.lat = 0;
        this.lng = 0;
        console.log('Hello LocationTracker Provider');
        this.mapModel = new MapModel();
    }
    LocationTracker.prototype.startBackgroundTracking = function () {
        // Background Tracking
        var config = {
            desiredAccuracy: 10,
            // Desired accuracy in meters. Possible values [0, 10, 100, 1000]. The lower the number,
            // the more power devoted to GeoLocation resulting in higher accuracy readings.
            // 1000 results in lowest power drain and least accurate readings. @see Apple docs
            stationaryRadius: 100,
            //Stationary radius in meters. When stopped, the minimum distance the device must move beyond
            //the stationary location for aggressive background-tracking to engage.
            distanceFilter: 1000,
            //The minimum distance (measured in meters) a device must move horizontally before an update event
            //is generated. @see Apple docs.
            debug: false,
            interval: 60000
        };
        console.log('Geolocation Background call ');
        // BackgroundGeolocation is highly configurable. See platform specific configuration options
        BackgroundGeolocation.configure(this.callbackSuccess, this.callbackFailure, config);
        BackgroundGeolocation.start();
    };
    /**
    * This callback will be executed every time a geolocation is recorded in the background.
    */
    LocationTracker.prototype.callbackSuccess = function (location) {
        var _this = this;
        console.log('Geolocation Background success ');
        console.log('[geo] old BackgroundGeolocation:  ' + this.lat + ',' + this.lng);
        console.log('[geo] new BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);
        this.sendLocation({ lat: this.lat, lng: this.lng }, { lat: location.latitude, lng: location.longitude }, true);
        // Run update inside of Angular's zone
        this.zone.run(function () {
            _this.lat = location.latitude;
            _this.lng = location.longitude;
        });
        /*
        IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
        and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
        IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
        */
        // BackgroundGeolocation.finish();
    };
    LocationTracker.prototype.callbackFailure = function (error) {
        console.log('Background Geolocation error ' + JSON.stringify(error));
        if (error.code === 2) {
            console.log('Not authorized for location updates. Would you like to open app settings?');
            BackgroundGeolocation.showAppSettings();
        }
    };
    LocationTracker.prototype.stopTracking = function () {
        console.log('stopTracking');
        BackgroundGeolocation.finish();
        // this.watch.unsubscribe();
    };
    LocationTracker.prototype.getForegroundPosition = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // Foreground Tracking
            // enableHighAccuracy:
            // Indicates the application would like to receive the best possible results.
            // If true and if the device is able to provide a more accurate position, it will do so.
            // Note that this can result in slower response times or increased power consumption
            // (with a GPS chip on a mobile device for example). On the other hand, if false,
            // the device can take the liberty to save resources by responding more quickly and/or using less power.
            var options = {
                // frequency: 3000,
                enableHighAccuracy: false
            };
            _this.watch = Geolocation.watchPosition(options).filter(function (p) { return p.code === undefined; }).subscribe(function (position) {
                console.log('Geolocation Foreground ');
                console.log('[geo] old Foreground Geolocation:  ' + _this.lat + ',' + _this.lng);
                console.log('[geo] new Foreground Geolocation:  ' + position.coords.latitude + ',' + position.coords.longitude);
                _this.sendLocation({ lat: _this.lat, lng: _this.lng }, { lat: position.coords.latitude, lng: position.coords.longitude }, false);
                // Run update inside of Angular's zone
                _this.zone.run(function () {
                    _this.lat = position.coords.latitude;
                    _this.lng = position.coords.longitude;
                });
                resolve({ lat: position.coords.latitude, lng: position.coords.longitude });
            });
        });
    };
    LocationTracker.prototype.sendLocation = function (oldPoint, newPoint, sendNotification) {
        if (oldPoint.lat != 0 && oldPoint.lng != 0) {
            var distance = this.mapModel.getDistanceFromLocationInMeters(oldPoint, newPoint);
            console.log('[location-tracker] distance:  ' + distance);
            //send to server only if the distance is greater then 850m
            if (distance > this.mapModel.maxImpact) {
                console.log('[location-tracker] distance is bigger then save it');
                //  let data = {geolocation:newPoint};
                var data = { geolocation: { lat: -23.4744096, lng: -46.6700553 } };
                this.dataService.saveBackgroundUserLocation(data, sendNotification);
            }
        }
    };
    LocationTracker.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    LocationTracker.ctorParameters = [
        { type: Http, },
        { type: NgZone, },
        { type: DataService, },
    ];
    return LocationTracker;
}());
//# sourceMappingURL=location-tracker.js.map