import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { CustomerDashBoardComponent } from './customer-dash-board/customer-dash-board.component';
import {WebSocketService} from './web-socket.service';

@NgModule({
  declarations: [
    AppComponent,
    CustomerDashBoardComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [WebSocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
