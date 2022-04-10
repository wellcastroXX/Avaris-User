import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import * as firebase from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthenticationService } from 'src/app/authentication-service';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  currentData = {
    uid: '',
  }
  users = [];
  profileUser: any;
  constructor(private navCtrl: NavController, private menuCtrl: MenuController, private router: Router, public authService: AuthenticationService, private afAuth: AngularFireAuth) {
  }
  ngOnInit() {
    this.getDataUsuario();
    this.users = this.getDataChats();
  }
  getDataUsuario() {
    this.currentData.uid = localStorage.getItem('currentUid');
  }
  getDataChats() {
    let allUsers = [];
    firebase.firestore().collection('usuarios').onSnapshot(snap => {
      snap.forEach(child => {
        firebase.firestore().collection('chats').doc(this.currentData.uid).collection(child.data()['ID']).onSnapshot(snap => {
          if (!snap.empty) {
            allUsers.push(child.data());
          }
        });
      });
    });
    return allUsers;
  }
  home() {
    this.navCtrl.navigateBack('home');
  }
  menu() {
    this.menuCtrl.enable(true, 'end');
    this.menuCtrl.open('end');
  }
  chatNavigate(uid: string, unome: string) {
    localStorage.setItem('otherId', uid);
    localStorage.setItem('otherName', unome);
    this.router.navigate(['chat/chat-area']);
  }
}