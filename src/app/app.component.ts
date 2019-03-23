import { Component } from '@angular/core';
import { Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
//import { CreateEventPage } from '../pages/create-event/create-event';
import { HomePage } from '../pages/home/home';
import {Storage} from '@ionic/storage';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any;
  //rootPage:any = CreateEventPage;

  constructor(platform: Platform, 
    public storage: Storage, 
    statusBar: StatusBar, 
    public events: Events,
    public afAuth: AngularFireAuth, 
    splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    events.subscribe('user:logout', () => {
      this.logout();
    });
  }
  ngOnInit() {
    this.storage.get('user').then((val) => {
      console.log(val);
      if(val != null){
        this.rootPage = HomePage;
      }else{
        this.rootPage = LoginPage;
      }
    });
  }

  logout() {
    console.log("Logging out...");
    this.afAuth.auth.signOut()
      .then(() => {
        this.storage.remove('user');
      })
      .catch(err => console.error(err));
  }

}
