import { Component, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


/**
 * Generated class for the EventOptionComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'event-option',
  templateUrl: 'event-option.html'
})
export class EventOptionComponent {
  @Input() index: number;
  @Output() onExit: EventEmitter<any> = new EventEmitter<any>();
  d: number = 0;
  optionData: Array<any>;
  hide: boolean = false;
  nodeType: string = "shortanswer";
  optionObject: any;

  question: string;
  low: number = 0;
  high: number = 5;
  lowTag: string;
  highTag: string;


  constructor(public navCtrl: NavController,
              private cdRef: ChangeDetectorRef, 
              public navParams: NavParams) {
      this.optionData = [{value: ""}];
      this.optionObject = {
        optionID: "test",
        optionType: "test",
        data: {}
      }
  }

  ngOnInit() {
    this.hide = false;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateEventPage');
  }

  lowSelect(data){
    this.low = data;
  }

  highSelect(data){
    this.high = data;
  }

  typeSelect(data){
    if(data == 'shortAnswer'){
      this.nodeType = 'shortanswer';
      console.log('Changed to short answer!');
    }else if(data == 'checkBox'){
      this.nodeType = 'checkbox';
      console.log('Changed to checkbox!');
    }else if(data == 'linearScale'){
      this.nodeType = 'linearscale';
      console.log('Changed to linear scale!');
    }
    this.cdRef.detectChanges();
  }
  sendObjectToParent() {
    if(this.nodeType == 'shortanswer'){
      this.optionObject.optionType = 'shortanswer';
      this.optionObject.data = {
        question: this.question
      }
    }else if(this.nodeType == 'checkbox'){      
      this.optionObject.optionType = 'checkbox';
      this.optionObject.data = {
        question: this.question,
        options: this.optionData
      }
    }else if(this.nodeType == 'linearscale'){
      this.optionObject.optionType = 'linearscale';
      this.optionObject.data = {
        question: this.question,
        low: this.low,
        high: this.high,
        lowTag: this.lowTag,
        highTag: this.highTag
      }
    }

    return this.optionObject;
  }
  addCheckboxOption(){
    this.d++;
    console.log(this.d);
    this.optionData.push({value: ""});
    this.cdRef.detectChanges();
  }

  exitOption(){
    this.onExit.emit(this.index);
  }
}
