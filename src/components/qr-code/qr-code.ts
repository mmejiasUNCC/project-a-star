import { Component, Input } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { AngularFireDatabase } from '@angular/fire/database';
import { Platform, AlertController } from 'ionic-angular';

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
  invalid: boolean = false;
  ninerID:string;
  showEventAdd: boolean = false;
  @Input() eventID: any;
  @Input() qrState: any;
  

  constructor(private scanner: BarcodeScanner,
              private platform: Platform,
              public alertController: AlertController,
              public db: AngularFireDatabase ) {
    console.log('Hello QrCodeComponent Component');
    this.text = 'Hello World!!!';
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      title: 'Invaild Input',
      subTitle: 'Cannot Submission',
      message: 'Make sure the NinerNet ID is in the correct format',
      buttons: ['OK']
    });

    await alert.present();
  }

  scan(){
    if(this.platform.is('cordova')){
      this.options = {
        prompt: 'Scan your barcode'
      }
      this.scanner.scan().then((data) => {
        this.addParticipant(data.text);
  
      }, (err) => {
        console.log('Error : ',err);
      }) 
    }else {
      if(this.showEventAdd == false){
        this.showEventAdd = true;
      }else{
        this.showEventAdd = false;
      }
      
    }
    
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
      this.invalid = false;
      this.showEventAdd = false;
      let x = this.db.object('/events/'+ this.eventID + "/participantsList");
      x.update({
        [data]: Number(data)
      });
      console.log("It worked!!!");
    }else{
      this.invalid = true;
      this.presentAlert();
    }
  }

  webAddParticipant(){
    this.addParticipant(this.ninerID);
    this.ninerID = '';
  }
}
