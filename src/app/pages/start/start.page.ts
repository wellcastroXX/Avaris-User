import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';


@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  constructor(private menuCtrl: MenuController, private navCtrl: NavController) { 
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
  }

  start(){
    this.navCtrl.navigateForward("home");
  }

}
