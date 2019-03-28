import { Component, Input } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { AngularFireDatabase } from '@angular/fire/database';
/**
 * Generated class for the QrCodeComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'qr-code',
  templateUrl: 'qr-code.html'
})
export class QrCodeComponent {

  text: string;
  options: BarcodeScannerOptions;
  encodeText: string = '';
  encodedData:any = {};
  scannedData:any ={};
  myParticipants: Array<string>;
  @Input() eventID: any;

  constructor(private scanner: BarcodeScanner,
              public db: AngularFireDatabase ) {
    console.log('Hello QrCodeComponent Component');
    this.text = 'Hello World!!!';
  }

  scan(){
    this.options = {
      prompt: 'Scan your barcode'
    }
    this.scanner.scan().then((data) => {
      this.scannedData = data;

    }, (err) => {
      console.log('Error : ',err);
    }) 
  }

  encode(){
    console.log(this.encodeText);
    this.scanner.encode(this.scanner.Encode.TEXT_TYPE, this.encodeText).then((data) => {
      this.encodedData = data;
    }, (err) => {
      console.log('Error : ',err);
      console.log("here");
    })
    
  }

  addParticipant(){
    let data = '800284325';
    this.myParticipants = new Array<string>();
    let x = this.db.object('events/'+ this.eventID + "/participantsList");
    x.update({
      [data]: data
    });
  }
}
