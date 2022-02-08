import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { MenuController, NavController, Platform } from '@ionic/angular';
import { LottieAnimationViewModule } from 'ng-lottie';
import { take } from 'rxjs/operators';
import { AuthenticationService } from './authentication-service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Inbox', url: '/folder/Inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/Outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  
  lg: boolean = false;
  userData: any;
  tokenUser: any;
  profileUser: any = [];
  lottieConfig: { path: string; autoplay: boolean; loop: boolean; };
  isLoad: boolean = false;
  makeLogin: boolean = false;
  
  constructor(private platform: Platform, private androidPermissions: AndroidPermissions, private navCtrl: NavController,
    private afAuth: AngularFireAuth, public afstore: AngularFirestore, private authService: AuthenticationService, public menuCtrl: MenuController) {
    this.initializeApp();

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
        this.lg = true;
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
            this.tokenUser = this.profileUser.uid;
            localStorage.setItem('data', JSON.stringify(this.profileUser));
            JSON.parse(localStorage.getItem('data'));
            console.log(this.profileUser);
        });
      }
      else {
      } 
    }); 
    //
    localStorage.setItem('currentUid', this.tokenUser);
  }

  initializeApp(){
    this.platform.ready().then(() => {
      /* this.statusBar.styleDefault(); */
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.LOCATION_COURSE)
      .then(
        result => console.log('Has permission?', result.hasPermission),
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.LOCATION_COURSE)
      );

      //navigator.mediaDevices
    });
  }
  goRegister(){
    this.navCtrl.navigateForward('cadastro');
  }
  
  logIn(email, password) {
    setTimeout(()=>{
      this.isLoad = true;   
    },0);
    setTimeout(()=>{
      console.log(email, password);
      this.authService.SignIn(email, password)
        .then((res) => {
          this.menuCtrl.close();
          this.isLoad = false;
          this.lg = true;
          window.location.reload();
          /* if(this.authService.isEmailVerified) {
            this.router.navigate(['dashboard']);          
          } else {
            window.alert('Email is not verified')
            return false;
          } */
        }).catch((error) => {
          window.alert(error.message)
        })
    },4000);
  }


  goLOGIN(){
    this.makeLogin = true;
  }
  backLogin(){
    this.lg = false;
    this.makeLogin = false;
  }

  home(){
    this.menuCtrl.close();
  }
  myAccount(){
    this.menuCtrl.enable(false);
    this.navCtrl.navigateForward('profile');
  }
  wallet(){
    this.menuCtrl.enable(false);
    this.navCtrl.navigateForward('wallet');
  }
  message(){
    this.menuCtrl.enable(false);
    this.navCtrl.navigateForward('chat');
  }
  history(){
    this.menuCtrl.enable(false);
    this.navCtrl.navigateForward('history');
  }
  help(){
    this.menuCtrl.enable(false);
    this.navCtrl.navigateForward('help');
  }
  config(){
    this.menuCtrl.enable(false);
    this.navCtrl.navigateForward('config');
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
}
