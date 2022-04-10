import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';

@Component({
  selector: 'app-avaliacao',
  templateUrl: './avaliacao.page.html',
  styleUrls: ['./avaliacao.page.scss'],
})
export class AvaliacaoPage implements OnInit {

  media: any = 0;

  motoristaUID: string = "";
  msg: string = "";
  avaliacao: number = 5;

  constructor(private afstore: AngularFirestore) { }

  ngOnInit() {
    // this.motoristaUID = localStorage.getItem('otherId');
    this.motoristaUID = 'WETXaXNar4O5heXAfkqhVpzzuo72';
    this.getMediaAvaliacaoMotorista();
  }

  log(event) {
    this.avaliacao = event;
  }

  send() {
    // firebase.firestore().collection('motoristas').doc(this.motoristaUID).collection('avaliacoes').add({
    //   msg: this.msg,
    //   nota: this.avaliacao
    // }).then(() => console.log('enviado com sucesso!'));

    this.afstore.doc(`motoristas/${this.motoristaUID}`).update({
      nota: this.avaliacao,
      msg: this.msg
    })
  }

  getMediaAvaliacaoMotorista() {
    firebase.firestore().collection('motoristas').doc(this.motoristaUID).collection('avaliacoes').onSnapshot(snap => {
      snap.forEach(avaliacao => {
        this.media += avaliacao.data().nota;
      })
      this.media /= snap.size;
    });
  }

}
