import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { User } from '../login/login'
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  user: User;
  afHolder: any;
  qrOpen: boolean;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private platform: Platform) {

    this.user = navParams.get('currentUser');
    this.qrOpen = false;
    
  }

  ionViewDidLoad() {
    
  }

  showScanner(){
    this.qrOpen = true;
  }

  hideScanner(){
    this.qrOpen = false;
  }

  signOut(){
    console.log(this.user);
    //this.afHolder.auth.signOut()
    //this.currentUser = new User();
      //console.log(this.currentUser);
    if(this.platform.is('cordova')){
      //this.googlePlus.logout();
    }

  }
}