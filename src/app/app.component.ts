import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
//import { CreateEventPage } from '../pages/create-event/create-event';
import { HomePage } from '../pages/home/home';
import {Storage} from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  rootPage:any;
  //rootPage:any = CreateEventPage;

  constructor(platform: Platform, public storage: Storage, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
  ngOnInit() {
    this.storage.get('user').then((val) => {
      if(val != null){
        this.rootPage = HomePage;
      }else{
        this.rootPage = LoginPage;
      }
    });
  }
}
