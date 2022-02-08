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
    //to nodejs Serve
    /* var mercadopago = require('mercadopago');
    mercadopago.configure({
        access_token: 'TEST-2855653370769129-062909-4db3d16ee58fdb3c026f15bdfdec4664-293253437'
    });

    var preference = {
      items: [
        {
          title: 'Test',
          quantity: 1,
          currency_id: 'ARS',
          unit_price: 10.5
        }
      ]
    };

    mercadopago.preferences.create(preference) */
  }

  start(){
    this.navCtrl.navigateForward("home");
  }

}
