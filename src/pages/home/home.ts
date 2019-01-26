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
  test: any;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private platform: Platform) {

    this.user = navParams.get('currentUser');
    this.test = "fuck it man";
    
  }

  ionViewDidLoad() {
    
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