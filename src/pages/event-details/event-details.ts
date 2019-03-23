import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';

import { AngularFireDatabase } from '@angular/fire/database';

/**
 * Generated class for the EventDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-event-details',
  templateUrl: 'event-details.html',
})
export class EventDetailsPage {
  event: Observable<any>;
  eventData: Array<any>;
  eventID: string;

  constructor(public navCtrl: NavController,
              private cdRef: ChangeDetectorRef, 
              public db: AngularFireDatabase, 
              public navParams: NavParams) {
    this.eventID = navParams.get('event');
    this.event = this.db.object('events/'+ this.eventID +'/eventdetails').valueChanges();
  }

  ngOnInit() {
      let x = this.db.list('events/'+ this.eventID + "/eventdetails/data");
      
      x.snapshotChanges().subscribe(item => {
        this.eventData = new Array<any>();
        let y: Array<any> = new Array<any>();
        item.forEach(element => {
          y.push(element.payload.toJSON());
          
        });
         
        for (let key in y) {
          console.log(key);
         let x: Observable<any> = this.db.object('events/'+ this.eventID +'/eventdetails/data/' + key).valueChanges();
         this.eventData.push(x);
        } 
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventDetailsPage');
    this.cdRef.detectChanges();
  }

}
