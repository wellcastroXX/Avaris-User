import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { MenuController, NavController, Platform } from '@ionic/angular';
import { LottieAnimationViewModule } from 'ng-lottie';
import { take } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/authentication-service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  userData: any;
  profileUser: any = [];
  lottieConfig: { path: string; autoplay: boolean; loop: boolean; };
  isLoad: boolean = false;
  nota: any;
  UID: any;
  myPhoto: any;
  PHOTO: boolean = false;

  constructor(private platform: Platform, private androidPermissions: AndroidPermissions, private navCtrl: NavController, private router: Router,
    private afAuth: AngularFireAuth, public afstore: AngularFirestore, private authService: AuthenticationService, public menuCtrl: MenuController) {

      LottieAnimationViewModule.forRoot();
      this.lottieConfig = {
        path: 'assets/load.json',
        autoplay: true,
        loop: true
      };

    //Code example - with user logged on APP!
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
        console.log(this.userData);
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
    this.afAuth.authState.pipe(take(1)).subscribe(async data => {
      if (data && data.email && data.uid){
        this.authService.getDatas(data.uid).subscribe( data => {
            this.profileUser = data;
            localStorage.setItem('userId', JSON.stringify(this.profileUser.ID))
            localStorage.setItem('data', JSON.stringify(this.profileUser));
            JSON.parse(localStorage.getItem('data'));
            console.log(this.profileUser);
            if(this.profileUser.photo != undefined)
            {
              this.PHOTO = true;
              this.myPhoto = this.profileUser.photo;
              console.log("with photo");
            }else{
              this.PHOTO = false;
              console.log("without photo");
            }
        });
      }
      else {
      } 
    }); 
    //
  }

  home(){
    this.navCtrl.navigateBack('home');
  }

  ngOnInit() {
    /* this.rankData(); */
  }

  logout(){
    setTimeout(()=>{
      this.isLoad = true;   
    },0);
    setTimeout(()=>{
      this.isLoad = false;
      this.authService.SignOut();
    },4000);
  }

  meusDados() {
    this.router.navigate(['profile/meus-dados']);
  }

  myCards(){
    this.navCtrl.navigateForward('wallet');
  }

  Payments(){
    this.navCtrl.navigateForward('history');
  }

  rankData() {
    const userId = localStorage.getItem('userId');
    console.log(userId);
    
    //const userId = 'WETXaXNar4O5heXAfkqhVpzzuo72';
    firebase.firestore().collection('usuarios').doc(userId).onSnapshot(snap => {
      console.log(snap.data().nota);
      this.nota = snap.data().nota;
    });
  }

}
