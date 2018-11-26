import { Component, OnInit, ViewChild } from '@angular/core';
import {} from '@types/googlemaps';
import {WebSocketService} from '../web-socket.service';



@Component({
  selector: 'app-customer-dash-board',
  templateUrl: './customer-dash-board.component.html',
  styleUrls: ['./customer-dash-board.component.css']
})

export class CustomerDashBoardComponent implements OnInit {

  @ViewChild('gmapcustomer') gmapElem: any;
  mapObject: google.maps.Map;
  infoWindowObject : google.maps.InfoWindow = new google.maps.InfoWindow;
  selfMarkerObject : google.maps.Marker;
  ws : WebSocketService;
  nearByTruckPostions : {'truckId': any, 'lat' : any, 'lng': any}[];
  nearByTruckMarkers : google.maps.Marker[] =[];
  constructor(private webSocketService: WebSocketService) { 
    this.ws = webSocketService;
  }

  ngOnInit() {
    var mapPropObject = {
      // center: new google.maps.LatLng(43.0417898, -76.1228379),
      center: new google.maps.LatLng(35, -76.1228379),
       zoom: 15,
       mapTypeId: google.maps.MapTypeId.ROADMAP
     };
     this.mapObject = new google.maps.Map(this.gmapElem.nativeElement, mapPropObject);
     this.selfMarkerObject = new google.maps.Marker({
       position : new google.maps.LatLng(35, -76.1228379),
       map: this.mapObject,
       title: 'this is a marker'
     });
     console.log('this in ngOnInit function:\n',this);
     //this function continuously updates the browser location.
     this.updateCoordinates(this);
  }

  handleLocationError(browserHasGeolocation : boolean, infoWindow : google.maps.InfoWindow , pos : google.maps.LatLng) : void {
      infoWindow.setPosition(pos);
      infoWindow.setContent(browserHasGeolocation ?
                            'Error: The Geolocation service failed.' :
                            'Error: Your browser doesn\'t support geolocation.');
      infoWindow.open(this.mapObject);
  }
  
  updateCoordinates(thisobject : any) : void{
    console.log('thisobject in updateCoordinates of customer-d-b comp\n',thisobject);
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position)=>{
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        thisobject.infoWindowObject.setPosition(pos);
        thisobject.infoWindowObject.setContent('You are here!');
        thisobject.infoWindowObject.open(thisobject.mapObject);
        thisobject.mapObject.setCenter(pos);
        thisobject.selfMarkerObject.setPosition(pos);
        //here via socket send the pos data to the backend server. and also subscribe to it.
        // setTimeout(() => {
        //   console.log('executing setTimeout after time limit')
        //   this.updateCoordinates(thisobject);
        // }, 10000);
        // console.log('after calling setTimeout');


        //sending coordinates to the backend server.
        thisobject.ws.updateCoordinates(pos);

        //this function needs the position and an observer as inputs. once the array of
        //nearbytruckpositions gets filled it should fire a event that can update the maps.
        thisobject.ws.getNearByTrucks({'customerId': 123, 'lat': pos.lat, 'lng': pos.lng}, 
        thisobject.observer).subscribe((res)=>{
          console.log('near by truck positions received');
          console.log(res);
          thisobject.populateTruckMarkers(res);
        }, (err)=>{
          console.log('error occured in rcvng nearby trucks from the server:\n', err);
        })
      }, ()=>{
        thisobject.handleLocationError(true, thisobject.infoWindowObject, thisobject.mapObject.getCenter());
      });
    }else{
      //browser doesnt support geolocation
      thisobject.handleLocationError(false, thisobject.infoWindowObject, thisobject.mapObject.getCenter());
    }
  }

  observer : any = {
    next: (data : any)=>{
      // this.nearByTruckPostions = [];
      // // this.nearByTruckPostions = <{'truckId': any, 'lat' : any, 'lng': any}[]>data;
      // console.log('start of the observer.next function');

      // this.nearByTruckMarkers = [];
      // for(let each of data){
      //   this.nearByTruckMarkers.push(new google.maps.Marker({
      //     'position' : new google.maps.LatLng(each.lat, each.lng),
      //     'map' : this.mapObject,
      //     'title' : "Truck"
      //   }));
      // }
      // console.log('end of the observer.next function');
    },
    error: (errorObject: any)=>{
      console.log('error occured in fetching the nearby truck positions with details:', errorObject);
    }

  }

  populateTruckMarkers = (truckObjects: any)=>{
    this.nearByTruckMarkers = [];
  // JSON.parse()
      for(let each of JSON.parse(truckObjects)){
        console.log('each truck obj: ', each.lat, ',', each.lng);
        this.nearByTruckMarkers.push(new google.maps.Marker({
          'position' : new google.maps.LatLng(each.lat, each.lng),
          'map' : this.mapObject,
          'title' : "Truck"
        }));
      }

     /* for(let each of this.nearByTruckMarkers)
        console.log('each truck marker in the array\n', each);*/
  }

  



}
