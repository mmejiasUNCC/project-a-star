import { Component, ChangeDetectorRef, ViewChildren, QueryList, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { User } from '../login/login';
import { EventOptionComponent } from '../../components/event-option/event-option';
import { AngularFireDatabase } from '@angular/fire/database';
import 'rxjs/add/operator/take';

import { Storage } from '@ionic/storage';
import { NgForm } from '@angular/forms';
/**
 * Generated class for the CreateEventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */


interface IMyEntity {
  optionID: string;
  optionType: string;
  data: any;
}

interface LooseObject {
  [key: string]: any
}


@IonicPage()
@Component({
  selector: 'page-create-event',
  templateUrl: 'create-event.html',
})



export class CreateEventPage {

  myEvents: Array<string>;
  user: User;
  i: number = 1;
  examType: any = 'exam';
  myEventTitle: string;
  data: Array<number>;
  addedUsers: Array<string>= [];
  invalid: boolean;
  ninerIdInvalid: boolean;
  showAddAdminUser: boolean = false;
  accessType: string = 'superUser';
  ninerID: string;
  adminList: LooseObject = {};
  title = "Sent from parent";

  @ViewChildren(EventOptionComponent) childern: QueryList<EventOptionComponent>;
  @ViewChild('eventTitle') eventTitle: NgForm;

  constructor(public navCtrl: NavController,
    private cdRef: ChangeDetectorRef,
    public db: AngularFireDatabase,
    public alertController: AlertController,
    public storage: Storage,
    public navParams: NavParams) {
    this.data = [this.i];
    this.myEvents = [];
  }

  inputValidation() {

    if (this.eventTitle.valid == false) {
      this.invalid = true;
    } else {
      this.invalid = false;
    }
    this.cdRef.detectChanges();
    return this.invalid;
  }

  ngOnInit() {
    this.storage.get('user').then((val) => {
      this.user = val;
      this.adminList[this.user.userId] = { access: 'admin' };

    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateEventPage');
  }

  addItem() {
    this.i++;
    this.data.push(this.i);
    this.cdRef.detectChanges();
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
          let key: any;

          item.forEach(element => {
            if(typeof element.payload.toJSON() === "string"){
             key =  element.payload.toJSON();
            }
          });
          
          this.addedUsers.push(key);
          this.ninerIdInvalid = false;
          this.showAddAdminUser = false;
          this.adminList[key] = { access: this.accessType };
          this.ninerID = '';
        }
      });

      console.log('Returned: ', this.adminList);

    } else {
      this.ninerIdInvalid = true;
      this.presentAlert();
    }

  }

  createEvent(eventObject) {

      var newPostRef = this.db.database.ref('events/').push({
        eventdetails: eventObject
      });

      this.db.database.ref('events/' + newPostRef.key).update({
        accessControl: this.adminList
      });

      this.db.database.ref('events/' + newPostRef.key + '/eventdetails').update({
        eventID: newPostRef.key
      });

      //this.myEvents.push(newPostRef.key);
      this.addedUsers.push(this.user.userId);

      for(let key in this.addedUsers){
        //console.log(this.addedUsers[userId]);
        this.db.database.ref('users/' + this.addedUsers[key] + '/myevents').update({
          [newPostRef.key]: newPostRef.key
        });
      }
      
      console.log(this.addedUsers);
   
  }

  saveEvent() {
    let eventObject = {
      title: this.myEventTitle,
      eventID: '1',
      eventType: 'exam',
      data: {}
    };

    let optionData: Array<IMyEntity> = new Array<IMyEntity>();
    this.myEvents = new Array<string>();
    let validated: boolean = true;

    if (this.inputValidation() == true) {
      validated = false;
    }

    if (this.examType == 'lab') {
      eventObject.eventType = 'lab';
      this.childern.forEach(cmp => {
        if (cmp.inputValidation() == true) {
          validated = false;
        }
      });
    }
    if (validated) {
      if (this.examType == 'lab') {
        this.childern.forEach(cmp => {
          optionData.push(cmp.sendObjectToParent());
        });

        eventObject.data = optionData;
      }
      this.createEvent(eventObject);

      this.navCtrl.pop();

    } else {
      this.presentAlert();
    }

  }

  async presentAlert() {
    const alert = await this.alertController.create({
      title: 'Invaild Input',
      subTitle: 'Cannot Submission',
      message: 'Make sure to fill out every field in red to save Event.',
      buttons: ['OK']
    });

    await alert.present();
  }

  closeOption(index) {
    this.data.splice(index, 1);
    this.cdRef.detectChanges();
    console.log(index);
  }
}
