import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
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
  qrState: string;
  myParticipants: any;
  invalid: boolean;
  ninerIdInvalid: boolean;
  showAddAdminUser: boolean = false;
  accessType: string = 'superUser';
  ninerID: string;
  isAdmin: boolean = false;
  userID: string;


  constructor(public navCtrl: NavController,
              private cdRef: ChangeDetectorRef, 
              public db: AngularFireDatabase, 
              public storage: Storage,
              public alertController: AlertController,
              public navParams: NavParams) {
    this.eventID = navParams.get('event');
    this.qrState = "addParticipant";
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

      //this.myParticipants = this.db.list('/events/'+ this.eventID + "/participantsList").valueChanges();    

      let y = this.db.list('/events/'+ this.eventID + "/participantsList");
      y.snapshotChanges().subscribe(item => {
        this.myParticipants = [];
        item.forEach(element => {
          let ninernetId = element.payload.toJSON();
          let z = this.db.list('/ninernetID/'+ ninernetId );
          z.snapshotChanges().take(1).subscribe(item => {
            item.forEach(element => {
              if(typeof element.payload.toJSON() === "string"){
                let user: any = element.payload.toJSON();
                let z = this.db.object('/users/'+ user + '/name');
                z.snapshotChanges().take(1).subscribe(item => {
                  console.log();
                  this.myParticipants.push({
                    name : item.payload.val(),
                    ninerID: user
                  }); 
                });
              }
            });
          });
        });
      });

      this.storage.get('user').then((val) => {
        this.userID = val.userId;
        
        let x = this.db.list('events/' + this.eventID + '/accessControl/' + this.userID);
      
        x.snapshotChanges().subscribe(item => {
          item.forEach(element => {
            if(element.payload.toJSON() == 'admin'){
              this.isAdmin = true;
            }
          });
        });
      });
  }

  typeSelect(data) {
    if (data == 'superUser') {
      this.accessType = 'superUser';
    } else if (data == 'adminUser') {
      this.accessType = 'admin';
    }
  }

  showAdminList() {
    if (this.showAddAdminUser == false) {
      this.showAddAdminUser = true;
    } else {
      this.showAddAdminUser = false;
    }
  }

  addToAdminList() {
    let regexp = new RegExp('^([0-9]{9})$');
    let validate = regexp.test(this.ninerID);

    if (validate) {
      let x = this.db.list('ninernetID/' + this.ninerID);
      x.snapshotChanges().take(1).subscribe(item => {
        if (item.length == 0) {
          console.log('Null');
          this.ninerIdInvalid = true;
        } else {
          let key;

          let user: Array<any> = new Array<any>();
          item.forEach(element => {
            user.push(element.payload.toJSON());
          });

          if(item.length == 1){
            key = user[0];
          }else{
            key = user[1];
          }

          this.db.database.ref('users/' + key + '/myevents').update({
            [this.eventID]: this.eventID
          });
          this.ninerIdInvalid = false;
          this.showAddAdminUser = false;
          this.db.database.ref('events/' + this.eventID + '/accessControl').update({
            [key]: { access: this.accessType }
          });
          this.ninerID = '';
        }
      });

    } else {
      this.ninerIdInvalid = true;
      this.presentAlert();
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EventDetailsPage');
    this.cdRef.detectChanges();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      title: 'Invaild Input',
      subTitle: 'Cannot Submission',
      message: 'Make sure to fill out every field in red.',
      buttons: ['OK']
    });

    await alert.present();
  }

}
