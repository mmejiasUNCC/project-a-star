import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Nav } from 'ionic-angular';
import { HomePage } from '../home/home';
import { ContactPage } from '../contact/contact';
import { ProfilePage } from '../profile/profile';
import { MenuController } from 'ionic-angular';
/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  public rootPage: any = HomePage;
  homePage: any = HomePage;
  contactPage: any = ContactPage;
  profilePage: any = ProfilePage;
  @ViewChild('content') nav: Nav;

  constructor(public navCtrl: NavController, 
    public menuCtrl: MenuController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

  openPage(data){
    //console.log(data);
    this.nav.setRoot(data);
    this.menuCtrl.close();
    //console.log('Display',data);
  }

  closeMenu(){
    this.menuCtrl.close();
  }

}
