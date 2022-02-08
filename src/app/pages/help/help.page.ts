import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
  }

  home(){
    this.navCtrl.navigateBack('home');
  }

}
