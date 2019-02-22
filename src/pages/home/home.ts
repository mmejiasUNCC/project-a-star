import { Component } from '@angular/core';
import { NavController, NavParams , Events} from 'ionic-angular';
import { User } from '../login/login';
import { LoginPage } from '../login/login';
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
              public events: Events, 
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
   this.events.publish('user:logout');
   this.navCtrl.push(LoginPage).then(() => {
     let index = 0;
     this.navCtrl.remove(index);
  });
    //this.currentUser = new User();
      //console.log(this.currentUser);
    if(this.platform.is('cordova')){
      //this.googlePlus.logout();
    }

  }
}