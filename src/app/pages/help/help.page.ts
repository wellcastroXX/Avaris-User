import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-help',
  templateUrl: './help.page.html',
  styleUrls: ['./help.page.scss'],
})
export class HelpPage implements OnInit {

  topicos = [];

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
    this.getData();
  }

  getData() {
    firebase.firestore().collection('perguntasRespostas').onSnapshot(snap => {
      snap.forEach(topico => {
        this.topicos.push(topico.data());
      });
    });
  }

  home(){
    this.navCtrl.navigateBack('home');
  }

}
