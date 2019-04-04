import { Component, Input } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
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
  scannedData:any = '';
  @Input() eventID: any;
  @Input() qrState: any;
  

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
      this.addParticipant(data.text);

    }, (err) => {
      console.log('Error : ',err);
    }) 
  }

  encode(){
    console.log(this.encodeText);
    this.scanner.encode(this.scanner.Encode.TEXT_TYPE, this.encodeText).then((data) => {
      this.encodedData = data;
      console.log(data);
    }, (err) => {
      console.log('Error : ',err);
      console.log("here");
    })
    
  }

  addParticipant(data){
    let regexp = new RegExp('^([0-9]{9})$');
    let validate = regexp.test(data);

    if(validate){
      let x = this.db.object('/events/'+ this.eventID + "/participantsList");
      x.update({
        [data]: Number(data)
      });
      console.log("It worked!!!");
    }
  }
}
