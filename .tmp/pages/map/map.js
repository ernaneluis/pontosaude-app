import { Component, ViewChild } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import { ReportPage } from '../report/report';
import { MapModel } from '../../models/map-model';
import { LocationTracker } from '../../providers/location-tracker';
import { DataService } from '../../providers/data-service';
import { AngularFire } from 'angularfire2';
export var UserPosition = (function () {
    function UserPosition(lat, lng) {
        this.lat = lat;
        this.lng = lng;
    }
    return UserPosition;
}());
export var GoogleMapView = (function () {
    function GoogleMapView(navCtrl, af, loadingCtrl, toastCtrl, locationTracker, dataService) {
        //  this.translate = translate;
        this.navCtrl = navCtrl;
        this.af = af;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.locationTracker = locationTracker;
        this.dataService = dataService;
        this.safe = {
            high: { percentage: "00%", name: "..." },
            medium: { percentage: "00%", name: "..." },
            low: { percentage: "00%", name: "..." },
            other: { percentage: "00%", name: "..." }
        };
        this.mapModel = new MapModel();
        var takeloader = this.loadingCtrl.create({
            content: "Please wait...",
            dismissOnPageChange: true
        });
        this.loader = takeloader;
        setTimeout(function () {
            takeloader.present();
        }, 500);
        this.locationTracker.startBackgroundTracking();
    }
    // Load map only after view is initialize
    GoogleMapView.prototype.ionViewDidLoad = function () {
        this.loadMap();
    };
    GoogleMapView.prototype.loadMap = function () {
        var _this = this;
        this.locationTracker.getForegroundPosition().then(function (position) {
            console.log("user loc " + position.lat + " " + position.lng);
            var latLng = new google.maps.LatLng(-23.4744096, -46.6700553);
            //debugger
            _this.userPosition = new google.maps.LatLng(position.lat, position.lng);
            var mapOptions = _this.mapModel.getMapConfig();
            _this.map = new google.maps.Map(_this.mapElement.nativeElement, mapOptions);
            _this.map.setCenter(latLng);
            _this.loadPointsFromLocation(latLng);
            _this.mapModel.addUserPosition(_this.map, latLng);
        });
    };
    GoogleMapView.prototype.loadPointsFromLocation = function (userlatLng) {
        var _this = this;
        var data = {};
        data = { geolocation: { lat: userlatLng.lat(), lng: userlatLng.lng() } };
        this.dataService.getPointsFromLocation(data).then(function (result) {
            console.log(result);
            // let pointsData: any[];
            //call base on real data
            _this.pointsData = result;
            var safeStats = _this.dataService.calculateSafety(_this.pointsData);
            //server
            data.statistics = safeStats[0];
            _this.dataService.saveForegroundUserLocation(data, true);
            //map sending copy of safeStats
            var copy = safeStats.slice(0);
            _this.calculateSafety(copy);
            //base on fake interpolated data
            var pointsHeatMap = _this.mapModel.interpolatePoints(_this.pointsData);
            _this.mapModel.addPointsToHeatmap(_this.map, pointsHeatMap);
            _this.loader.dismiss();
        });
    };
    // this.safe = {
    //   high:    {percentage:: "00%", name:"..." },
    //   medium:  {percentage:: "00%", name:"..." },
    //   low:     {percentage:: "00%", name:"..." },
    //   other:   {percentage:: "00%", name:"..." }
    // };
    GoogleMapView.prototype.calculateSafety = function (response) {
        // let response =   this.dataService.calculateSafety(points);
        var percentagesSortAsc = response[0];
        var pointsByName = response[1];
        for (var i = 0; i < Math.min(pointsByName, 4); i++) {
            if (this.safe.high.name == "...") {
                var top_1 = percentagesSortAsc.pop();
                this.safe.high.name = top_1.name;
                this.safe.high.percentage = (top_1.percentage * 100).toFixed(2) + "%";
            }
            else if (this.safe.medium.name == "...") {
                var top_2 = percentagesSortAsc.pop();
                this.safe.medium.name = top_2.name;
                this.safe.medium.percentage = (top_2.percentage * 100).toFixed(2) + "%";
            }
            else if (this.safe.low.name == "...") {
                var top_3 = percentagesSortAsc.pop();
                this.safe.low.name = top_3.name;
                this.safe.low.percentage = (top_3.percentage * 100).toFixed(2) + "%";
            }
            else if (this.safe.other.name == "...") {
                var otherPercentage = 0;
                for (var i = 0; i < percentagesSortAsc.length; i++) {
                    otherPercentage += percentagesSortAsc[i].percentage;
                }
                this.safe.other.name = "Outros";
                this.safe.other.percentage = (otherPercentage * 100).toFixed(2) + "%";
            }
        }
    };
    GoogleMapView.prototype.showMyLocation = function () {
        this.mapModel.addUserPosition(this.map, this.userPosition);
        this.map.setCenter(this.userPosition);
    };
    GoogleMapView.prototype.createIssue = function () {
        this.navCtrl.push(ReportPage);
    };
    GoogleMapView.decorators = [
        { type: Component, args: [{
                    selector: 'map',
                    templateUrl: 'map.html'
                },] },
    ];
    /** @nocollapse */
    GoogleMapView.ctorParameters = [
        { type: NavController, },
        { type: AngularFire, },
        { type: LoadingController, },
        { type: ToastController, },
        { type: LocationTracker, },
        { type: DataService, },
    ];
    GoogleMapView.propDecorators = {
        'mapElement': [{ type: ViewChild, args: ['map',] },],
    };
    return GoogleMapView;
}());
//# sourceMappingURL=map.js.map