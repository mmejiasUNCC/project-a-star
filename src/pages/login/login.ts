import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams} from 'ionic-angular';
import { MenuPage } from '../menu/menu';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase/app';

import { GooglePlus } from '@ionic-native/google-plus';
import { Platform, AlertController } from 'ionic-angular';
import { Observable } from 'rxjs';

import {Storage} from '@ionic/storage';
import { NgForm } from '@angular/forms';


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
  firstLogin: boolean = false;
  @ViewChild('firstLoginForm') firstLoginForm: NgForm;
  invalid: boolean;
  ninernetValidation: boolean;
  username: string;
  ninernetID: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              private cdRef: ChangeDetectorRef,
              public afAuth: AngularFireAuth, 
              public db: AngularFireDatabase, 
              private googlePlus: GooglePlus,
              public alertController: AlertController,
              public storage: Storage,
              private platform: Platform) {

                this.user = this.afAuth.authState;
                this.currentUser = new User();
                
  }
  
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      title: 'Invaild Input',
      subTitle: 'Cannot Submission',
      message: 'Make sure to fill out every field in red and also make sure the NinerNet ID is in the correct format',
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
      console.log(this.res);
      this.currentUser.displayName = this.res.givenName + "  " + this.res.familyName;
      this.currentUser.email = this.res.email;
      this.currentUser.userId = this.res.userId;
      this.currentUser.imageUrl = this.res.imageUrl;
      this.currentUser.isLoggedIn = true;
        
      this.storage.set('user', this.currentUser);


      
      this.nav();

    } catch(err){
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
        this.currentUser.userId = Object(res.additionalUserInfo.profile)["id"];
        this.currentUser.imageUrl = res.user.photoURL;
        this.currentUser.isLoggedIn = true;
        
        this.storage.set('user', this.currentUser);

        this.nav();
      });
    } catch(err){
      console.log(err);
    }
  }

  goToHomePage(){
    this.navCtrl.push(MenuPage, {
      currentUser: this.currentUser
    }).then(() => {
      let index = 0;
      this.navCtrl.remove(index);
    });
  }

  nav(){
    let x = this.db.object('users/'+ this.currentUser.userId);

    x.snapshotChanges().take(1).subscribe(user => {
      if(user.key == null ){
        console.log("First login");
        this.firstLogin = true;
      }else{
        console.log("User exists");
        this.goToHomePage();
      }
    });
  }
  firstSignIn(){
    if(this.inputValidation() == true){
      this.presentAlert();
    }else{
      let x = this.db.object('users/'+ this.currentUser.userId);
      x.update({
        name: this.currentUser.displayName,
        email: this.currentUser.email,
        image: this.currentUser.imageUrl,
        username: this.username,
        ninernetID: this.ninernetID
      });

      let y = this.db.object('ninernetID/'+ this.ninernetID);
      y.update({
        user: this.currentUser.userId,
      });

      this.goToHomePage();
    }
  }

  inputValidation(){

    if(this.firstLoginForm.valid == false){
      this.invalid = true;
    }else{
      this.invalid = false;
    }

    let regexp = new RegExp('^([0-9]{9})$');
    let validate = regexp.test(this.ninernetID);

    if(!validate){
      this.invalid = true;
      this.ninernetValidation = false;
    }
    
    this.cdRef.detectChanges();
    return this.invalid;
  }
}

