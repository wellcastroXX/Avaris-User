import { Component, ViewChild } from '@angular/core';
import { Environment, Geocoder, GoogleMap, GoogleMapOptions, GoogleMaps, GoogleMapsAnimation, GoogleMapsEvent, ILatLng, LatLng, Marker, MarkerIcon, MyLocation } from '@ionic-native/google-maps';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Stripe } from '@ionic-native/stripe/ngx';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { LoadingController, MenuController, NavController, Platform } from '@ionic/angular';
import { LottieAnimationViewModule } from 'ng-lottie';
import { take } from 'rxjs/operators';
import { AuthenticationService } from './authentication-service';
import { Geoposition, Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  @ViewChild('map', {static: true}) mapElement: any;
  public appPages = [
    { title: 'Inbox', url: '/folder/Inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/Outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  stripe_key: 'pk_test_51KF5JnBYiw2MYl1OABl24qrUOe56ZGWD5l0y6He2Rp7aHSM54XPtOlfVOm5kQia2GrpDV7fUgJhhFyWcTp8jS6QH00LKcqMnFA';
  lg: boolean = false;
  userData: any;
  tokenUser: any;
  profileUser: any = [];
  lottieConfig: { path: string; autoplay: boolean; loop: boolean; };
  isLoad: boolean = false;
  makeLogin: boolean = false;
  myCode: any;
  premium: boolean = false;
  email: any;
  password: any;
  locationCordinates: any;
  //
  myPhoto: any;
  PHOTO: boolean = false;
  Coordinates: any;
  public latLng = {lng: 0, lat: 0};
  private loading: any;
  Map: GoogleMap;
  locationCoords: any;

  constructor(private platform: Platform, private androidPermissions: AndroidPermissions, private navCtrl: NavController, private stripe: Stripe, private geolocation: Geolocation,
    private loadingCtrl: LoadingController,
    private afAuth: AngularFireAuth, public afstore: AngularFirestore, private authService: AuthenticationService, public menuCtrl: MenuController, private locationAccuracy: LocationAccuracy) {

    this.locationCordinates = {
        latitude: "",
        longitude: "",
        accuracy: "",
        timestamp: ""
    }
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
            if(this.profileUser.avarispremium != undefined){
              this.premium = this.profileUser.avarispremium[0].avaris;
            }else{
              this.premium = false;
            }
            if(this.profileUser.photo != undefined)
            {
              this.PHOTO = true;
              this.myPhoto = this.profileUser.photo;
              console.log("with photo");
            }else{
              this.PHOTO = false;
              console.log("without photo");
            }
            console.log(this.premium);
        });
      }
      else {
      } 
    }); 
    //
    localStorage.setItem('currentUid', this.tokenUser);
  }

  checkPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) {
          this.enableGPS();
        } else {
          this.locationAccPermission();
        }
      },
      error => {
        alert(error);
      }
    );
  }
  locationAccPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
      } else {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
            () => {
              this.enableGPS();
            },
            error => {
              alert(error)
            }
          );
      }
    });
  }
  enableGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      () => {
        this.currentLocPosition()
      },
      error => alert(JSON.stringify(error))
    );
  }
  currentLocPosition() {
    this.geolocation.getCurrentPosition().then((response) => {
      this.locationCordinates.latitude = response.coords.latitude;
      this.locationCordinates.longitude = response.coords.longitude;
      this.locationCordinates.accuracy = response.coords.accuracy;
      this.locationCordinates.timestamp = response.timestamp;
    }).catch((error) => {
      alert('Error: ' + error);
    });
  }

  getCurrentCoordinates() {
    let options = {
     frequency: 3000,
     enableHighAccuracy: true
   };

   const cord = this.geolocation.watchPosition(options)
   .subscribe((position: Geoposition) => {
     console.log(position);
     this.Coordinates = position.coords;
     this.executemap();
   }); 
 }
  executemap(){
    console.log(this.Coordinates);
    this.latLng = {
      lat: this.Coordinates.latitude,
      lng: this.Coordinates.longitude 
    }
    localStorage.setItem("lat", this.latLng.lat.toString());
    localStorage.setItem("lng", this.latLng.lng.toString());
    this.loadMap();
 }
 //
  async loadMap(){

    Environment.setEnv({
      'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyBTNRO9es7fPuPAh2WXwhu6AQjSW_8UOKE',
      'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyBTNRO9es7fPuPAh2WXwhu6AQjSW_8UOKE'
    });

    this.Map = GoogleMaps.create(this.mapElement);
    await this.Map.one(GoogleMapsEvent.MAP_READY);
    const myLocation: MyLocation = await this.Map.getMyLocation();
    this.locationCoords.lat = myLocation.latLng.lat;
    this.locationCoords.lng = myLocation.latLng.lng;
    this.locationCoords.accuracy = myLocation.accuracy;
    this.locationCoords.timestamp = myLocation.time;
    console.log(myLocation, this.locationCoords); 
  }
 //

  initializeApp(){
    this.platform.ready().then(() => {
      /* this.statusBar.styleDefault(); */
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.LOCATION_COURSE)
      .then(
        result => console.log('Has permission?', result.hasPermission),
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.LOCATION_COURSE)
      );
      /* this.checkPermission(); */
      this.getCurrentCoordinates();
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

  randomCode(){
    const max = 10000;
    const min = 1000;
    const x = Math.floor(Math.random() * (max - min + 1)) + min;
    var code = 'AVA'+x;
    this.myCode = code;
    console.log(code);
  }
  
  Premium(){
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.menuCtrl.enable(false);
        this.navCtrl.navigateForward('avaris-premium')
      } else {
        this.makeLogin = true;
      }
    });
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
      this.getCurrentCoordinates();
      this.authService.SignOut();
    },4000);
  }
}
