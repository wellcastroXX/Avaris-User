import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import * as moment from 'moment';

@Component({
  selector: 'app-chat-area',
  templateUrl: './chat-area.component.html',
  styleUrls: ['./chat-area.component.scss'],
})
export class ChatAreaComponent implements OnInit {

  startDate = new Date(1970, 0, 1);

  myData = {
    uid: '',
  }

  otherData = {
    name: '',
    uid: '',
  }

  chats = [];

  textMsg = '';

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.getData();

    this.chats.forEach(a => console.log(a));
  }

  getData() {
    this.otherData.name = localStorage.getItem('otherName');
    this.otherData.uid = localStorage.getItem('otherId');

    this.myData.uid = localStorage.getItem('currentUid');

    // this.otherData.uid = localStorage.getItem('currentUid');

    // this.myData.uid =  localStorage.getItem('otherId');

    firebase.firestore().collection('chats').doc(this.myData.uid).collection(this.otherData.uid).orderBy('time').onSnapshot(snap => {
      this.chats = [];
      snap.forEach(child => {
        this.chats.push(child.data());
      });
    });
  }

  send() {

    if (this.textMsg === "") return;

    firebase.firestore().collection("chats").doc(this.myData.uid).collection(this.otherData.uid).add({
      time: firebase.firestore.Timestamp.fromDate(new Date()),
      uid: this.myData.uid,
      msg: this.textMsg
    }).then(() => {
      this.textMsg = "";
    });

    firebase.firestore().collection("chats").doc(this.otherData.uid).collection(this.myData.uid).add({
      time: firebase.firestore.Timestamp.fromDate(new Date()),
      uid: this.myData.uid,
      msg: this.textMsg
    }).then(() => {
      this.textMsg = "";
    });

  }

  load() {
    location.reload();
  }

  backToChat() {
    this.router.navigate(['chat']);
  }

  teste(argument: any) {
    var t = new Date(1970, 0, 1); // Epoch
    t.setSeconds(argument.seconds);
    
    console.log(t)
  }

  setTime(seconds) {
    this.startDate = new Date(1970, 0, 1);
    this.startDate.setSeconds(seconds);
    return moment(this.startDate).format('HH:mm');
  }

}
