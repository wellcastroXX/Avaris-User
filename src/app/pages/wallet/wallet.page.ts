import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {

  constructor(private navCtrl: NavController,) { }

  ngOnInit() {
  }

  home(){
    this.navCtrl.navigateBack('home');
  }

}
