import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';
import {Storage} from '@ionic/storage';
import { Observable } from 'rxjs';

/**
 * Generated class for the AttendedEventsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-attended-events',
  templateUrl: 'attended-events.html',
})
export class AttendedEventsPage {

  userRef: Observable<any>;
  user: any;
  eventData: Array<any>;
  
  constructor(public navCtrl: NavController, 
    public db: AngularFireDatabase, 
    public storage: Storage,
    public navParams: NavParams) {
  }

  ngOnInit() {
    this.storage.get('user').then((val) => {
      this.user = val;
      let obj: any;
      let x = this.db.object('users/'+ this.user.userId);
      x.snapshotChanges().subscribe(action => {
        obj = action.payload.val();
        this.retrieveEvents(obj.ninernetID);
      });
     
    });
  }

  retrieveEvents(data){
    let id:string = data;
    let x = this.db.list('ninernetID/'+ id + '/attendedEvents');

    x.snapshotChanges().subscribe(item => {
      this.eventData = new Array<any>();
      let y: Array<any> = new Array<any>();
      item.forEach(element => {
        y.push(element.payload.toJSON());
        
      });
       
      for (let key in y) {

       let x: Observable<any> = this.db.object('events/'+ y[key].eventID +'/eventdetails').valueChanges();
       this.eventData.push([  y[key].eventID , x]); 

      } 
    }); 
  }


}
