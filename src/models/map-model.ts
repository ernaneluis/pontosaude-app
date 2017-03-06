declare var google;

export class MapModel
{
    public interpolationFactor: any;
    public radius: any;
    public interpolationRadius: any;
    public maxImpact: any;

    heatmap: any ;
    mapCircles:any = [];

    constructor()
    {

        this.interpolationFactor = {heatmap:100, circle:3};
        this.interpolationRadius = 200;    //meters
        this.radius = 3000;   //meters
        this.maxImpact = 850;   //meters
    }

    getMapConfig()
    {
        let mapOptions = {
            //  center: latLng,
             disableDefaultUI: true,
             styles: this.getDarkStyle(),
             zoom: 15,
             maxZoom: 19,
             minZoom: 9
          }
        return mapOptions;
    }

    getHeatMapConfig()
    {

      let heatmapConfig = {
                  radius:      50, // The radius of influence for each data point, in pixels.
                  dissipating: true, // dissipating: Specifies whether heatmaps dissipate on zoom.
                  gradient:    this.getGradientStyle()
                };
        return heatmapConfig;
    }


   groupBy(collection, property) {
      var i = 0, val, index, values = [], result = [];
      for (; i < collection.length; i++) {
          val = collection[i][property];
          index = values.indexOf(val);
          if (index > -1)
              result[index].push(collection[i]);
          else {
              values.push(val);
              result.push([collection[i]]);
          }
      }
      return result;
    }


    interpolatePoints(points ,factor )
    {

      console.log("points.length " + points.length);
      var newPoints = [];

      for(var i=0;i<points.length;i++)
      {

        // newPoints.push({location: points[i].location, weight:  points[i].weight});

        var cityCircle = new google.maps.Circle({
           center: {lat: points[i].location.lat(), lng: points[i].location.lng()},
           radius: points[i].impact
         });

         for(var j=0; j < factor ;j++)
         {
            let newPoint = this.getRandomMarker(cityCircle.getBounds());
            // let data = {location: newPoint, weight:  points[i].weight};
            let data = {location: newPoint, weight: points[i].weight, impact: points[i].impact, name: points[i].name, color: points[i].color};
            newPoints.push(data);
         }

       }

      return newPoints;
    }

    getRandomMarker(bounds)
    {

      var lat_min = bounds.getSouthWest().lat(),
          lat_range = bounds.getNorthEast().lat() - lat_min,
          lng_min = bounds.getSouthWest().lng(),
          lng_range = bounds.getNorthEast().lng() - lng_min;

      return new google.maps.LatLng(lat_min + (Math.random() * lat_range),
                                    lng_min + (Math.random() * lng_range));
    }


    distance(p1, p2) {
      //  return (google.maps.geometry.spherical.computeDistanceBetween(p1, p2) / 1000).toFixed(2); in km
      return google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
    }

     getDistanceFromLocationInMeters(point1,point2)
     {
         var lat1 = point1.lat;
         var lon1 = point1.lng;

         var lat2 = point2.lat;
         var lon2 = point2.lng;

        var R = 6371; // Radius of the earth in km
        var dLat = this.deg2rad(lat2-lat1);  // deg2rad below
        var dLon = this.deg2rad(lon2-lon1);
        var a =   Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c; // Distance in km
        return d * 1000;
      }

     deg2rad(deg) {
      return deg * (Math.PI/180)
    }

    //filter a list, return the poinst inside of a radius given a center
    //points = [{location: latLng, weight: w}];
    pointsInside(centerLatLng, radius, points)
    {

      let pointsInside = [];
      for(var i=0;i<points.length;i++)
      {
        let p = points[i].location;
        let distanceIn = this.distance(centerLatLng, p);
        if(distanceIn <= radius){
            pointsInside.push(points[i]);
        }
      }
      return pointsInside;
    }


    addUserPosition(map, latLng)
    {
        let userPosition = {lat: latLng.lat(), lng: latLng.lng()};
        var userCircle = new google.maps.Marker({
            position: userPosition,
            map: map,
             icon: "img/point.png"
          });
    }

    addMarker(map, point)
    {
      /*GURO TERCEIRO" : "http://labs.google.com/ridefinder/images/mm_20_blue.png",
      "PLANO DE SAUDE PUBLICO" : "http://labs.google.com/ridefinder/images/mm_20_red.png",
      "GRATUIDADE" : "http://labs.google.com/ridefinder/images/mm_20_red.png",
      "MISTO" : "http://labs.google.com/ridefinder/images/mm_20_green.png"*/

        var h = 32 //w
        var w = 37 //h
        var icon = ""
        var pin = {
                    "SUS":"http://maps.google.com/mapfiles/kml/paddle/red-blank.png",
                    "PARTICULAR" : "http://maps.google.com/mapfiles/kml/paddle/blu-blank.png",
                    "PLANO / SEGURO PROPRIO" : "http://maps.google.com/mapfiles/kml/paddle/blu-blank.png",
                    "PLANO DE SAUDE PRIVADO" : "http://maps.google.com/mapfiles/kml/paddle/blu-blank.png",
                    "PLANO / SEGURO TERCEIRO" : "http://maps.google.com/mapfiles/kml/paddle/blu-blank.png",
                    "PLANO DE SAUDE PUBLICO" : "http://maps.google.com/mapfiles/kml/paddle/red-blank.png",
                    "GRATUIDADE" : "http://maps.google.com/mapfiles/kml/paddle/red-blank.png",
                    "MISTO" : "http://maps.google.com/mapfiles/kml/paddle/grn-blank.png"
                  }

        if(point.convenio.length == 1)
        {

          icon = new google.maps.MarkerImage(pin[point.convenio[0]], null, null, null, new google.maps.Size(h,w));
        }
        else
        {
          var particular = 0
          var publico = 0

          for(var i = 0; i < point.convenio.length; i++)
          {
              if(point.convenio[i] == "SUS" || point.convenio[i] == "GRATUIDADE")
              {
                publico++
              }
              else
              {
                particular++
              }
          }

          if(particular == 0 && publico > 0)
          {
            icon = new google.maps.MarkerImage(pin["GRATUIDADE"], null, null, null, new google.maps.Size(h,w));
          }
          else if(particular > 0 && publico == 0)
          {
            icon = new google.maps.MarkerImage(pin["PARTICULAR"], null, null, null, new google.maps.Size(h,w));
          }
          else if(particular > 0 && publico > 0)
          {
              icon = new google.maps.MarkerImage(pin["MISTO"], null, null, null, new google.maps.Size(h,w));
          }

        }
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(point.lat, point.lng),
            map: map,
            icon: icon
          });
        return marker;
    }

    addPointsToHeatmap(map, points)
    {
        let config  =  this.getHeatMapConfig();
        this.heatmap = new google.maps.visualization.HeatmapLayer(config);
        this.heatmap.setData(points);
        this.heatmap.setMap(map);
        // return heatmap;
    }

    clearHeatmap() {
      if(this.heatmap)
        this.heatmap.setMap(null);
    }

    clearCircles() {
          for (var i = 0; i < this.mapCircles.length; i++) {
            this.mapCircles[i].setMap(null);
          }
      }

    addPointsAsCircle(map, points)
    {
        // let config  =  this.getHeatMapConfig();

        for(var i=0;i<points.length;i++)
        {
          // let fillColor = this.getColor(points[i]["weight"]-1);
          let fillColor = points[i]["color"];
           var circle = new google.maps.Circle({
              // strokeColor: '#FF0000',
              strokeOpacity: 0,
              strokeWeight: 0,
              fillColor: fillColor,
              fillOpacity: 0.20,
              map: map,
              center: points[i]["location"],
              radius: points[i]["impact"]
            });
            this.mapCircles.push(circle)
        }
    }

    getStreetView(empresa, size)
    {
        var heading = 100;

        if(empresa.numero)
          heading = (empresa.numero % 2 == 0)? 235 : 100;

        var streetview = "https://maps.googleapis.com/maps/api/streetview?size=" + size ;
        streetview += "&location=" + empresa.rua + "," + empresa.numero + " " + empresa.bairro + "," + empresa.municipio + "," + empresa.uf + "," + "Brazil";
        streetview += "&fov=80&heading=" + heading + "&pitch=10&key=AIzaSyAo79eLenkSGm-LHEL_eC6yAfxVF39WCaQ"
        streetview = encodeURI(streetview)
        console.log(streetview)
        return streetview
    }

    getColor(w)
    {
      var gradient = [
          '#6EEB83', //1
          '#6EEB83', //2
          '#03A9E7', //3
          '#03A9E7', //4
          '#fcb521', //5
          'rgba(252,181,33, 1)', //6
          '#03A9E7', //7
          '#03A9E7', //8
          '#FF0000', //9
          'rgba(252,181,33, 1)',//10
          '#FF0000',//11
          'rgba(252,181,33, 1)',//12
          '#FF0000',//13
          'rgba(252,181,33, 1)',//14
          'rgba(252,181,33, 1)',//15
          '#FF0000',//16
          ]
          return gradient[w]

          //#9B3C82
          //#03A9E7
    }

    // var bigCircle = new google.maps.Circle({
    //    // strokeColor: '#FF0000',
    //    strokeOpacity: 0,
    //    strokeWeight: 0,
    //    fillColor: '#FF0000',
    //    fillOpacity: 0.15,
    //    map: this.map,
    //    center: userPosition,
    //    radius: this.config.circle_radius
    //  });

    //  var smallCircle = new google.maps.Circle({
    //     // strokeColor: '#FF0000',
    //     strokeOpacity: 0,
    //     strokeWeight: 0,
    //     fillColor: '#FF0000',
    //     fillOpacity: 0.45,
    //     map: this.map,
    //     center: userPosition,
    //     radius: this.config.circle_radius*0.5
    //   });
     //
    //   var userCircle = new google.maps.Circle({
    //      strokeColor: '#FFFFFF',
    //      strokeOpacity: 0,
    //      strokeWeight: 0,
    //      fillColor: '#03A9E7',
    //      fillOpacity: 1,
    //      map: this.map,
    //      center: userPosition,
    //      radius: 100
    //    });


    getGradientStyle()
    {

        var gradient = [
              'rgba(255,232,112, 0)',
              //'rgba(255,232,112, 1)',
              'rgba(254,217,118, 1)',
              'rgba(254,178,76, 1)',
              //'rgba(252,181,33, 1)',
              //'rgba(253,141,60, 1)',
              'rgba(251,106,74, 1)',
              'rgba(252,78,42, 1)',
              'rgba(227,26,28, 1)',
              'rgba(189,0,38, 1)',
              'rgba(143, 13, 13, 1)'
            ];
          return gradient;

    }



    getDarkStyle()
    {

      return this.getStyle14();
    }



    getStyle14()
    {
      //light dream
      return [
            {
              "featureType": "landscape",
              "stylers": [
                {
                  "hue": "#FFBB00"
                },
                {
                  "saturation": 43.400000000000006
                },
                {
                  "lightness": 37.599999999999994
                },
                {
                  "gamma": 1
                }
              ]
            },
            {
              "featureType": "road.arterial",
              "stylers": [
                {
                  "saturation": -100
                },
                {
                  "lightness": 50
                }
              ]
            },
            {
              "featureType": "road.highway",
              "stylers": [
                {
                  "hue": "#FFC200"
                },
                {
                  "saturation": -61.8
                },
                {
                  "lightness": 45.599999999999994
                },
                {
                  "gamma": 1
                }
              ]
            },
            {
              "featureType": "water",
              "stylers": [
                {
                  "hue": "#0078FF"
                },
                {
                  "saturation": -13.200000000000003
                },
                {
                  "lightness": 2.4000000000000057
                },
                {
                  "gamma": 1
                }
              ]
            }
          ];
      }



}
