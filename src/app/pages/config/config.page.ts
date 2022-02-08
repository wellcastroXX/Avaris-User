import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  home(){
    this.navCtrl.navigateBack('home');
  }


}
