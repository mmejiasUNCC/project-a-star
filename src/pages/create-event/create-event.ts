import { Component, ChangeDetectorRef, ViewChildren, QueryList} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {EventOptionComponent} from '../../components/event-option/event-option';

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


@IonicPage()
@Component({
  selector: 'page-create-event',
  templateUrl: 'create-event.html',
})



export class CreateEventPage {

  i: number = 1;
  data: Array<number>;
  title = "Sent from parent";
  @ViewChildren(EventOptionComponent) childern: QueryList<EventOptionComponent>;

  constructor(public navCtrl: NavController, 
              private cdRef: ChangeDetectorRef, 
              public navParams: NavParams) {
                this.data = [this.i];
  }

  ngOnInit() {
    
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateEventPage');
  }

  addItem(){
    this.i++;
    this.data.push(this.i);
    this.cdRef.detectChanges();
  }

  saveEvent(){
    let eventObject = {
        title: "Test Event Creation",
        eventID: 13234,
        data: []
    };

    let optionData: Array<IMyEntity> = new Array<IMyEntity>();

    this.childern.forEach(cmp => {
      optionData.push(cmp.sendObjectToParent());
    });

    eventObject.data = optionData;
    console.log(eventObject);
  }

  closeOption(index){
    this.data.splice(index, 1);
    this.cdRef.detectChanges();
    console.log(index);
  }
}
