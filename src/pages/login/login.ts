import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events} from 'ionic-angular';
import { HomePage } from '../home/home';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';

import { GooglePlus } from '@ionic-native/google-plus';
import { Platform, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs';


/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

export class User {
  displayName: string;
  email: string;
  userId: string;
  imageUrl: string;
  isLoggedIn:boolean;

  constructor () {
      this.displayName = "";
      this.email = "";
      this.userId = "";
      this.imageUrl = "";
      this.isLoggedIn = false;
  }
}


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  currentUser: User;
  res: any;
  user: Observable<firebase.User>;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public afAuth: AngularFireAuth, 
              private googlePlus: GooglePlus,
              public alertController: AlertController,
              public events: Events,
              private platform: Platform) {

                this.user = this.afAuth.authState;
                this.currentUser = new User();
                events.subscribe('user:logout', () => {
                  this.logout();
                });
  }
  
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  async presentAlert(err) {
    const alert = await this.alertController.create({
      title: 'Test',
      message: err,
      buttons: ['OK']
    });

    await alert.present();
  }

  googleLogin() {
    if(this.platform.is('cordova')){
      this.nativeGoogleLogin();
    }else {
      this.webGoogleLogin();
    }
  }

  async nativeGoogleLogin(): Promise<void> {
    
    try {
      await this.googlePlus.login({
        'webClientId' : '266214346491-on7iuk9hh5k2ibg5crk06p1r1ecjmfe9.apps.googleusercontent.com',
        'offline' : true,
        'scopes' : 'profile email'
      }).then(res => {
        this.res = res;
        //this.presentAlert(JSON.stringify(this.res.givenName + "  " + this.res.familyName + "  " + this.res.imageUrl));
        return this.afAuth.auth.signInWithCredential(
          firebase.auth.GoogleAuthProvider.credential(res.idToken)
        )
      })

      this.currentUser.displayName = this.res.givenName + "  " + this.res.familyName;
      this.currentUser.email = this.res.email;
      this.currentUser.userId = this.res.userId;
      this.currentUser.imageUrl = this.res.imageUrl;
      this.currentUser.isLoggedIn = true;
        
      this.navCtrl.push(HomePage, {
        currentUser: this.currentUser
      });


    } catch(err){
      this.presentAlert(err);
      console.log(err);
    }
  }


  async webGoogleLogin(): Promise<void> {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await this.afAuth.auth.signInWithPopup(provider)
      .then(res => {
        this.currentUser.displayName = res.user.displayName;
        this.currentUser.email = res.user.email;
        this.currentUser.userId = res.user.uid;
        this.currentUser.imageUrl = res.user.photoURL;
        this.currentUser.isLoggedIn = true;
        
        this.navCtrl.push(HomePage, {
          currentUser: this.currentUser
        }).then(() => {
          let index = 0;
          this.navCtrl.remove(index);
        });
      });
    } catch(err){
      console.log(err);
    }
  }


  logout() {
    console.log("Logging out...");
    this.afAuth.auth.signOut()
      .then(res => {
        this.currentUser = new User();
      })
      .catch(err => console.error(err));
  }
  
}













/*
  login() {
    this.googlePlus.login({})
      .then(res => {
        console.log(res);
        this.displayName = res.displayName;
        this.email = res.email;
        this.familyName = res.familyName;
        this.givenName = res.givenName;
        this.userId = res.userId;
        this.imageUrl = res.imageUrl;

        this.isLoggedIn = true;
      })
      .catch(err => console.error(err));
  }

  logout() {
    this.googlePlus.logout()
      .then(res => {
        console.log(res);
        this.displayName = "";
        this.email = "";
        this.familyName = "";
        this.givenName = "";
        this.userId = "";
        this.imageUrl = "";

        this.isLoggedIn = false;
      })
      .catch(err => console.error(err));
  }

  */

