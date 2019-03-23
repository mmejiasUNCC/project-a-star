import { Component} from '@angular/core';
import { NavController, NavParams , Events} from 'ionic-angular';
import { User } from '../login/login';
import { LoginPage } from '../login/login';
import { CreateEventPage } from '../create-event/create-event';
import { Platform } from 'ionic-angular';

import { AngularFireDatabase } from '@angular/fire/database';
import {Storage} from '@ionic/storage';
import { Observable } from 'rxjs';

import {EventDetailsPage} from '../event-details/event-details';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user: User;
  afHolder: any;
  test: any;
  loaded: boolean;
  eventListData: any;
  
  eventData: Array<any>;
  items: Observable<any[]>;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public events: Events, 
              public db: AngularFireDatabase, 
              public storage: Storage,
              private platform: Platform) {

    //this.user = navParams.get('currentUser');
    this.loaded = false;
  }

  ionViewDidLoad() {
    this.storage.get('user').then((val) => {
      this.user = val;
      this.loaded = true;
      console.log(this.user.userId);

      let x = this.db.list('users/'+ this.user.userId + "/myevents");
      this.items = this.db.list('users/'+ this.user.userId + "/myevents").valueChanges();
      
      x.snapshotChanges().subscribe(item => {
        this.eventData = new Array<any>();
        let y: Array<any> = new Array<any>();
        item.forEach(element => {
          y.push(element.payload.toJSON());
          
        });
         
        for (let key in y) {
  
         let x: Observable<any> = this.db.object('events/'+ y[key] +'/eventdetails').valueChanges();
         this.eventData.push([ y[key] , x]); 

        } 
      });
    });
  }

  goToEvent(index){
    this.navCtrl.push(EventDetailsPage, {
      event: this.eventData[index][0]
    })
    console.log(this.eventData[index][0]);
  }

  goToCreateEvent(){
    this.navCtrl.push(CreateEventPage);
  }

  signOut(){
   this.events.publish('user:logout');
   this.navCtrl.push(LoginPage).then(() => {
     let index = 0;
     this.navCtrl.remove(index);
  }); 
    //this.currentUser = new User();
      //console.log(this.currentUser);
    if(this.platform.is('cordova')){
      //this.googlePlus.logout();
    }

  }
}