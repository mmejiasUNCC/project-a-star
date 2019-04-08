import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { ProfilePage } from '../pages/profile/profile';
import { EventDetailsPage } from '../pages/event-details/event-details';
import { LoginPage } from '../pages/login/login';
import { MenuPage } from '../pages/menu/menu';
import { CreateEventPage } from '../pages/create-event/create-event';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { AngularFireModule } from '@angular/fire';
import firebaseConfig from './firebase';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { GooglePlus } from '@ionic-native/google-plus';
import {ComponentsModule} from '../components/components.module';
import { FormsModule } from '@angular/forms';

import {IonicStorageModule} from '@ionic/storage';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ProfilePage,
    MenuPage,
    ContactPage,
    HomePage,
    EventDetailsPage,
    LoginPage,
    CreateEventPage
  ],
  imports: [
    BrowserModule,
    RouterModule,
    ComponentsModule,
    FormsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    MenuPage,
    EventDetailsPage,
    LoginPage,
    ProfilePage,
    CreateEventPage
  ],
  providers: [
    GooglePlus,
    StatusBar,
    SplashScreen,
    BarcodeScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
