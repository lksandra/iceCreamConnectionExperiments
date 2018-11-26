import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import {Observable} from 'rxjs/Observable';
import * as RX from 'rxjs/Rx'; 

import {Customer, Truck} from '../interfaces/users';
@Injectable()
export class WebSocketService {

  private socket; //socket that connects to our server.
  constructor() { 
    this.socket = io('http://localhost:8080');
  }

  getNearByTrucks(userposition : any, observer: any) : RX.Subject<any>{
    console.log('getNearByTrucks of ws executing');
    if(this.socket.connected){
      console.log('socket is still connected to the server');
    }
    this.socket.emit('getNearByTrucks', JSON.stringify(userposition));
    var observable =  Observable.create((observer)=>{
      this.socket.once('getNearByTrucks', (data)=>{
        observer.next(data);
      });

      this.socket.once('connect_error', (errorObject)=>{
        observer.error(errorObject);
      });

      this.socket.once('error', (errorObject)=>{
        observer.error(errorObject);
      });

      this.socket.once('disconnect', (reason)=>{
        console.log(reason);
      });
      

      
    }) 

    return RX.Subject.create(observer, observable);
  }

  updateCoordinates(userposition: any){
    console.log('updateCoordinates in ws comp executing');
    this.socket.emit('updateCoordinates', JSON.stringify(userposition));
  }
}
