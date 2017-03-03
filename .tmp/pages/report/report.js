import { Component, ViewChild } from '@angular/core';
import { NavController, LoadingController, AlertController, ToastController } from 'ionic-angular';
import { FormBuilder } from '@angular/forms';
import { CrimeService } from '../../providers/crime-service';
import { ReportTwoPage } from '../report-two/report-two';
import { MapModel } from '../../models/map-model';
export var ReportPage = (function () {
    function ReportPage(navCtrl, formBuilder, crimeService, loadingCtrl, alertCtrl, toastCtrl) {
        this.navCtrl = navCtrl;
        this.formBuilder = formBuilder;
        this.crimeService = crimeService;
        this.loadingCtrl = loadingCtrl;
        this.alertCtrl = alertCtrl;
        this.toastCtrl = toastCtrl;
        this.mapModel = new MapModel();
    }
    ReportPage.prototype.ionViewDidLoad = function () {
        console.log('Hello ReportPage Page');
        this.loadMap();
    };
    ReportPage.prototype.loadMap = function () {
        var _this = this;
        // console.log("position "+ position.coords.latitude);
        // let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        //debug
        var latLng = new google.maps.LatLng(-23.4744096, -46.6700553);
        var mapOptions = this.mapModel.getMapConfig();
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.map.setCenter(latLng);
        google.maps.event.addListener(this.map, 'click', function (point) {
            //clean
            _this.showLoading();
            if (_this.marker)
                _this.marker.setMap(null);
            _this.addMarker(point.latLng);
            var geocoder = new google.maps.Geocoder;
            var latlng = { lat: point.latLng.lat(), lng: point.latLng.lng() };
            geocoder.geocode({ 'location': latlng }, function (results, status) {
                if (status === 'OK') {
                    console.log(results);
                    if (results[0]) {
                        var theLocation = _this.getLocationData(results, latlng);
                        var formatted_address_1 = theLocation[1];
                        _this.location = theLocation[0];
                        _this.addInfoWindow(formatted_address_1);
                        setTimeout(function () {
                            _this.loading.dismiss();
                            var toast = _this.toastCtrl.create({
                                message: formatted_address_1,
                                position: 'bottom',
                                duration: 5000
                            });
                            toast.present();
                        });
                    }
                    else {
                        console.log('No results found');
                        _this.showLoading();
                    }
                }
                else {
                    console.log('Geocoder failed due to: ' + status);
                    _this.showLoading();
                }
            });
        });
    };
    ReportPage.prototype.getLocationData = function (googleData, latlng) {
        var address;
        var addressNumber;
        var city;
        var country;
        var formatedAddress;
        for (var _i = 0, googleData_1 = googleData; _i < googleData_1.length; _i++) {
            var location_1 = googleData_1[_i];
            for (var _a = 0, _b = location_1['address_components']; _a < _b.length; _a++) {
                var component = _b[_a];
                var type = component["types"];
                if (type.indexOf("street_number") > -1) {
                    addressNumber = component["long_name"];
                }
                else if (type.indexOf("street_address") > -1 || type.indexOf("route") > -1) {
                    address = component["long_name"];
                }
                else if (type.indexOf("administrative_area_level_2") > -1 || type.indexOf("locality") > -1) {
                    city = component["long_name"];
                }
                else if (type.indexOf("country") > -1) {
                    country = component["long_name"];
                }
            }
            if (address && city && country) {
                formatedAddress = location_1["formatted_address"];
                break;
            }
        }
        var location = {
            // address: address+", "+addressNumber,
            address: formatedAddress,
            city: city,
            country: country,
            geolocation: latlng,
        };
        return [location, formatedAddress];
    };
    ReportPage.prototype.addMarker = function (position) {
        this.marker = new google.maps.Marker({
            map: this.map,
            animation: google.maps.Animation.DROP,
            position: position
        });
    };
    //
    ReportPage.prototype.addInfoWindow = function (text) {
        var _this = this;
        var content = "<h5>" + text + "</h5>";
        var infoWindow = new google.maps.InfoWindow({
            content: content
        });
        google.maps.event.addListener(this.marker, 'click', function () {
            infoWindow.open(_this.map, _this.marker);
        });
    };
    ReportPage.prototype.next = function () {
        if (this.location) {
            this.navCtrl.push(ReportTwoPage, {
                location: this.location
            });
        }
        else {
            var alert_1 = this.alertCtrl.create({
                title: 'Fail',
                subTitle: 'Must set an address',
                buttons: ['OK']
            });
            alert_1.present(prompt);
        }
    };
    ReportPage.prototype.showLoading = function () {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...'
        });
        this.loading.present();
    };
    ReportPage.prototype.showError = function (text) {
        var _this = this;
        setTimeout(function () {
            _this.loading.dismiss();
        });
        var alert = this.alertCtrl.create({
            title: 'Fail',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present(prompt);
    };
    ReportPage.prototype.getDarkStyle = function () {
        return [
            {
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#212121"
                    }
                ]
            },
            {
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#212121"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "administrative.country",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9e9e9e"
                    }
                ]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#bdbdbd"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#181818"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#616161"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#1b1b1b"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#2c2c2c"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#8a8a8a"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#373737"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#3c3c3c"
                    }
                ]
            },
            {
                "featureType": "road.highway.controlled_access",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#4e4e4e"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#616161"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#757575"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#000000"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#3d3d3d"
                    }
                ]
            }
        ];
    };
    ReportPage.decorators = [
        { type: Component, args: [{
                    selector: 'page-report',
                    templateUrl: 'report.html'
                },] },
    ];
    /** @nocollapse */
    ReportPage.ctorParameters = [
        { type: NavController, },
        { type: FormBuilder, },
        { type: CrimeService, },
        { type: LoadingController, },
        { type: AlertController, },
        { type: ToastController, },
    ];
    ReportPage.propDecorators = {
        'mapElement': [{ type: ViewChild, args: ['map',] },],
    };
    return ReportPage;
}());
//# sourceMappingURL=report.js.map