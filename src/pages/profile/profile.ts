import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Observable } from 'rxjs';
import { LoginPage } from '../login/login';
import { AngularFireDatabase } from '@angular/fire/database';
import {Storage} from '@ionic/storage';
import { Platform } from 'ionic-angular';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  userRef: Observable<any>;
  user: any;
  loaded: boolean;
  constructor(public navCtrl: NavController, 
    public db: AngularFireDatabase, 
    public storage: Storage,
    public events: Events,
    private platform: Platform, 
    public navParams: NavParams) {
  }

  ngOnInit() {
    
    this.storage.get('user').then((val) => {
      this.user = val;
      
      this.userRef = this.db.object('users/' + this.user.userId).valueChanges();

      this.loaded = true;
      //console.log(this.userRef);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
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
