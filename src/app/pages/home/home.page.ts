import { Component, NgZone, OnInit, Pipe, ViewChild } from '@angular/core';
import { Environment, Geocoder, GoogleMap, GoogleMapOptions, GoogleMaps, GoogleMapsAnimation, GoogleMapsEvent, ILatLng, LatLng, Marker, MarkerIcon, MyLocation } from '@ionic-native/google-maps';
import { LoadingController, MenuController, NavController, Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions, NativeGeocoderResult } from '@ionic-native/native-geocoder/ngx';
import { Geoposition } from '@ionic-native/geolocation/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/authentication-service';
import { LottieAnimationViewModule } from 'ng-lottie';
import { HttpClient } from '@angular/common/http';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
/* import * as MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import MapboxDirections from '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions';
import '@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css'; */
declare var google;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('map', {static: true}) mapElement: any;
  /* @Pipe({
    name: 'kmDistance'
  }) */
  paymentHandler:any = null;
  private loading: any;
  Map: GoogleMap;
  latitude: any = 0; //latitude
  longitude: any = 0; //longitude
  public latLng = {lng: 0, lat: 0};
  public latLng2 = {lng: 0, lat: 0};
  public search: string = '';
  mapStyles=  [
    {
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "elementType": "labels.text.stroke",
      "stylers": [
        {
          "color": "#f5f5f5"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#bdbdbd"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#ffffff"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#757575"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#dadada"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#616161"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    },
    {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#e5e5e5"
        }
      ]
    },
    {
      "featureType": "transit.station",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#eeeeee"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "geometry",
      "stylers": [
        {
          "color": "#c9c9c9"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#9e9e9e"
        }
      ]
    }
  ];
  private googleAutocomplete = new google.maps.places.AutocompleteService();
 /*  private CalculateDistance = new google.maps.geometry.spherical.computeDistanceBetween(); */
  public searchResults = new Array<any>();
  public listResults: boolean;
  private originMarker: Marker;
  public destionation: any;
  public searchingDriver: any;
  private googleDirectionService = new google.maps.DirectionsService();
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  load: boolean;
  //
  // Readable Address
  address: string;

  // Location coordinates
  Mylatitude: number;
  Mylongitude: number;
  accuracy: number;
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };
  Coordinates: any;
   watch:any;
   locationCoords: any;
   timetest: any;
   locationCordinates: any;
  timestamp: any;
  startPosition: any;
  originPosition: any;
  destinationPosition: any;
  MYdestination: boolean = false;
  opt1: boolean = false;
  opt2: boolean = false;
  opt3: boolean = false;
  allowStep1: boolean = false;
  step_request: boolean = true;
  kmDistance: any;
  public km = 0;
  userData: any;
  lg: boolean = false;
  token: any;
  profileUser: any = [];
  time: any;
  myHour: Date = new Date();
  Ride: boolean = true;
  minTOend: any;
  lottieConfig: { path: string; autoplay: boolean; loop: boolean; };
  lottieConfig2: { path: string; autoplay: boolean; loop: boolean; };
  isLoad: boolean = false;
  //Result trip search
  startPointTitle: any;
  endPointTitle: any;
  timeRide: any;
  kmRide: any = [];
  kmRideValue: any;
  //Price Ride
  price: any;
  priceDescont: any;
  price2: any;
  //
  loadDriver: boolean = false;
  pointsTrip: ILatLng[];
  randomID: number;
  cardDetails: {};
  //
  paymentAmount: string = '23.33';
  currency: string = 'BRL';
  currencyIcon: string = 'R$';
  //Firebase Functions
  

  constructor(private platform: Platform, private loadingCtrl: LoadingController, private ngZone: NgZone, private geolocation: Geolocation, private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy, public menuCtrl: MenuController, private nativeGeocoder: NativeGeocoder, private afAuth: AngularFireAuth, public afstore: AngularFirestore,
    private db: AngularFirestore, private authService: AuthenticationService, private http: HttpClient, private payPal: PayPal, private navCtrl: NavController) {
      
      LottieAnimationViewModule.forRoot();
      this.lottieConfig = {
        path: 'assets/load.json',
        autoplay: true,
        loop: true
      };
      this.lottieConfig2 = {
        path: 'assets/car-avaris.json',
        autoplay: true,
        loop: true
      };

      platform.ready().then(() => {
        this.getCurrentCoordinates();
      });

      this.locationCoords = {
        lat: "",
        lng: "",
        accuracy: "",
        timestamp: ""
      }
      this.timetest = Date.now();
      /* lat: "",
        lng: "" */

      this.locationCordinates = {
          latitude: "",
          longitude: "",
          accuracy: "",
          timestamp: ""
        }
      this.timestamp = Date.now();  
      if(this.lg == null){
        this.lg = false;
      }
  }

  
  async ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
        this.lg = true;
        this.token = this.userData.uid;
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
            this.lg = true;
            localStorage.setItem('data', JSON.stringify(this.profileUser));
            JSON.parse(localStorage.getItem('data'));
            console.log(this.profileUser);
        });
      }
      else {
      } 
    }); 
    //
    this.mapElement = this.mapElement.nativeElement;

    this.mapElement.style.width = this.platform.width() + 'px';
    this.mapElement.style.height = this.platform.height() + 'px'; 
    //
    /* this.loadMap(); */
    //
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

    this.watch = this.geolocation.watchPosition(options)
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
  }
  
  // geolocation options
  options = { maximumAge: 3000, timeout: 5000, enableHighAccuracy: true };

  // use geolocation to get user's device coordinates
  
  /* WORKING, MAS GPS LOKO, mudar forma de pegar coordenadas */
  async loadMap(){
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...'});
    await this.loading.present();

    Environment.setEnv({
      'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyBTNRO9es7fPuPAh2WXwhu6AQjSW_8UOKE',
      'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyBTNRO9es7fPuPAh2WXwhu6AQjSW_8UOKE'
    });

    console.log( this.latLng );
  

    const MapOptions: GoogleMapOptions = {
      controls: {
        zoom: false
      },
      camera: {
        target: this.latLng,
        zoom: 16,
      },
      styles: this.mapStyles
    }

    this.Map = GoogleMaps.create(this.mapElement, MapOptions);
    try{
      await this.Map.one(GoogleMapsEvent.MAP_READY);
      this.addOriginMarker();
      const myLocation: MyLocation = await this.Map.getMyLocation();
      this.locationCoords.lat = myLocation.latLng.lat;
      this.locationCoords.lng = myLocation.latLng.lng;
      this.locationCoords.accuracy = myLocation.accuracy;
      this.locationCoords.timestamp = myLocation.time;
      console.log(myLocation, this.locationCoords);  
    } catch(error){
      console.log(error);
    }
  }

  async addOriginMarker(){
    try{
      this.Map.animateCamera({
        target: this.latLng,
        zoom: 16.5
       });

      let icon: MarkerIcon = {
        url: 'assets/icon/myLocation.png',
        size: {
          width: 52,
          height: 52
        }
      };

      this.originMarker = this.Map.addMarkerSync({
        title: 'Origem',
        icon: icon,
        position: this.latLng,
      });
       /* animation: GoogleMapsAnimation.DROP, */
    } catch(error){
      console.error(error);
    }finally{
      this.loading.dismiss();
    }
  }

  async addOriginMarker2(){
    this.Map.animateCamera({
      target: this.latLng,
      zoom: 16.5
     });

    this.loadDriver = true;

    let icon: MarkerIcon = {
      url: 'assets/icon/myLocation.svg',
      size: {
        width: 52,
        height: 52
      }
    };

    this.originMarker = this.Map.addMarkerSync({
      title: 'Origem',
      icon: icon,
      position: this.latLng,
    });
  }

  searchChanged(){
    if(!this.search.trim().length) return;
    this.googleAutocomplete.getPlacePredictions({ input: this.search }, predictions => {
      this.ngZone.run(() => {
        this.searchResults = predictions;
      });
      console.log(predictions);
    });
  }

  async calcRoute(item: any){
    this.search = '';
    this.destionation = item;
    if(this.destionation == item){
      this.MYdestination = true;
    }

    this.endPointTitle = item.structured_formatting.main_text;
    console.log(item);
    
    const info: any = await Geocoder.geocode({address: this.destionation.description});
    
    let markerDestionation: Marker = this.Map.addMarkerSync({
      title: this.destionation.description,
      icon: '#031D44',
      animation: GoogleMapsAnimation.DROP,
      position: info[0].position
    });

    this.googleDirectionService.route({
      origin: this.originMarker.getPosition(),
      destination: markerDestionation.getPosition(),
      travelMode: 'DRIVING'
    }, async results => {
      console.log(results);
      this.directionsDisplay.setDirections(results);
      //Calcule Min & Km - start //
      if(results.status == "OK"){
        this.startPointTitle = results.routes[0].legs[0].start_address;
        this.kmRide = results.routes[0].legs[0].distance.text;
        this.kmRideValue = results.routes[0].legs[0].distance.value;
        this.timeRide = results.routes[0].legs[0].duration;
        console.log(this.kmRide, this.kmRideValue, this.timeRide);
        //
      }
      this.transformMN(this.timeRide.value);
      this.minTOend; /////////////////////////////////////variable 1
      var km = this.kmRideValue / 1000;
      this.kmDistance = (km.toFixed(1)); /////////////////variable 2
      console.log(this.kmDistance);
      this.getPriceTravel();
      //
      this.getDistanceFromLatLonInKm();
      //
      //Calcule Min & Km - end//
      const points = new Array<ILatLng>();
      const routes = results.routes[0].overview_path;

      for(let i = 0; i < routes.length; i++){
       points[i] = {
         lat: routes[i].lat(),
         lng: routes[i].lng()
       }
      }
      this.pointsTrip = points;
      //
      var latitude1 = this.latLng.lat;
      var longitude1 = this.latLng.lng;
      var latitude2 = markerDestionation.getPosition().lat;
      var longitude2 = markerDestionation.getPosition().lng;
      this.latLng2.lat = markerDestionation.getPosition().lat;
      this.latLng2.lng = markerDestionation.getPosition().lng;
      console.log(latitude1, longitude1, latitude2, longitude2);
      /* var distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(latitude1, longitude1), new google.maps.LatLng(latitude2, longitude2));   
      console.log(distance); */
      //
      await this.Map.addPolyline({
        points: points,
        color: '#031D44',
        width: 3,
      });
      this.Map.animateCamera({
        target: points,
        zoom: 13
      });
      this.Map.moveCamera({target: points, zoom: 13});
    });
  }

  pickLocation(){
    this.Map.moveCamera({
      target: this.latLng,
      zoom: 16.5
     });
     this.addOriginMarker();
  }

  randomNumber() {
    let min = 1;
    let max = 10;
    this.randomID = Math.random() * (max - min) + min;
  }

  confirmRide(){
    this.afAuth.authState.subscribe(async user => {
      if (user) {
        //Checkout
        /* this.payWithPaypal(); */
        //
        this.searchingDriver = true;
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
        this.token = this.userData.uid;
        //Start load
        this.randomNumber();
        this.Map.moveCamera({
          target: this.latLng,
          zoom: 16.5
         });
        await this.Map.clear();
        /* this.destionation = null; */
        this.addOriginMarker2();
        const orderToString = this.randomID.toString();
        //CHAMAR CARREGAMENTO E PROCURA DE MOTORISTAS
        //Tirar points line, e manter Marker origem on center
        //sobrepor menu com z-inde
        //mostrar mensagem de procura/
        const ID = this.token;
        const Ride = this.Ride;
        const hour = this.myHour;
        const order = orderToString.replace(/[\D]+/g, '');
        const startPointTitle = this.startPointTitle;
        const endPointTitle = this.endPointTitle;
        const pointsTrip = this.pointsTrip;
        const lat1 = this.latLng.lat;
        const lat2 = this.latLng2.lat;
        const lng1 = this.latLng.lng;
        const lng2 = this.latLng2.lng;
        const kmRide = this.kmRide;
        const kmRideValue = this.kmRideValue;
        const timeRide = this.timeRide;
        const price = this.price;
        this.afstore.doc(`trip/${this.token}`).set({
          ID,
          Ride,
          hour,
          order,
          startPointTitle,
          endPointTitle,
          pointsTrip,
          lat1,
          lat2,
          lng1,
          lng2,
          kmRide,
          kmRideValue,
          timeRide,
          price
        });
        
        console.log(ID,
          Ride,
          hour,
          order,
          startPointTitle,
          endPointTitle,
          pointsTrip,
          lat1,
          lat2,
          lng1,
          lng2,
          kmRide,
          kmRideValue,
          timeRide);
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
        this.menu();
      }
    });
  }

  getDistanceFromLatLonInKm() {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(this.latLng2.lat - this.latLng.lat); // deg2rad below
    var dLon = this.deg2rad(this.latLng2.lng - this.latLng.lng);
    var a =
       Math.sin(dLat / 2) * Math.sin(dLat / 2) +
       Math.cos(this.deg2rad(this.latLng.lat)) * Math.cos(this.deg2rad(this.latLng2.lat)) *
       Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    console.log(d);
    return d;
 }
 
 deg2rad(deg) {
   console.log( deg * (Math.PI / 180)); 
   return deg * (Math.PI / 180)
 }

  transformMN(value: number){
    const minutes: number = Math.floor(value / 60);
    console.log(minutes);
    this.minTOend = minutes;
    this.time = new Date().toString().split(' ')[4];
    console.log(this.time, minutes);  
    /* return minutes + ':' + (value - minutes * 60); */
  }

  //Select options cars - STEP 1 -

  option1(){
    this.opt1 = true;
    console.log('Opção 1 selecionada!');
    if(this.opt1 == true){
      this.opt2 = false;
      this.opt3 = false;
      this.allowStep1 = true;
    }
  }
  option2(){
    this.opt2 = true;
    console.log('Opção 2 selecionada!');
    if(this.opt2 == true){
      this.opt1 = false;
      this.opt3 = false;
      this.allowStep1 = true;
    }
  }
  option3(){
    this.opt3 = true;
    console.log('Opção 3 selecionada!');
    if(this.opt3 == true){
      this.opt1 = false;
      this.opt2 = false;
      this.allowStep1 = true;
    }
  }
  nextStep(){
    this.step_request = false;
  }

  async back(){
    try{
      await this.Map.clear();
      this.destionation = null;
      this.addOriginMarker();
      //
      this.opt1 = false;
      this.opt2 = false;
      this.opt3 = false;
      this.allowStep1 = false;
      this.loadDriver = false;
      this.step_request = true;
    } catch(error){
      console.error(error);
    }
  }

  /* Navegation - pages*/
  menu(){
    this.menuCtrl.enable(true, 'end');
    this.menuCtrl.open('end');
  }

  getPriceTravel(){
    //SCRIPT TO CALCULE THE PRICE OF TRAVEL DESTINATION
    //Pegar por base as corridas do mesmo local do ponto x ao Y no uber e analisar o preço!
    //ANALISAR TAMBÉM O PREÇO DA CORRIDA POR 1KM, 2km, 5km, 10km >>>
    //Minuto - km = O RESULTADO SERÁ O VALOR DA VIAGEM.
    
    
    //Price Full
    //km = 1,35 
    //m = 10cent
    this.kmDistance; ///////////////////////////////////variable 1
    this.minTOend; /////////////////////////////////////variable 2
    let km1 = 2.70;
    const calculeKM1 = this.kmDistance * km1;
    let min1 = 0.20;
    const calculeM1 = this.minTOend * min1;
    const priceFull = calculeKM1 + calculeM1;
    this.price = priceFull;
    console.log(calculeKM1, calculeM1, priceFull);
    const descont = ((priceFull)*50);
    console.log(descont);

    //Price with Descont - SUBSCRIBS
    //km = 1,35 
    //m = 10cent
    this.kmDistance; ///////////////////////////////////variable 1
    this.minTOend; /////////////////////////////////////variable 2
    let km2 = 1.35;
    const calculeKM2 = this.kmDistance * km2;
    let min2 = 0.10;
    const calculeM2 = this.minTOend * min2;
    const priceWithDescont = calculeKM2 + calculeM2;
    this.priceDescont = priceWithDescont;
    console.log(calculeKM2, calculeM2, priceWithDescont);
    const descont2 = ((priceWithDescont)*50);
    console.log(descont2);
    
    /* this.brazilianCurrency(0, price) */
  }

  brazilianCurrency(money, decimalEmbeded) {
    var decimalPart;
  
    if (decimalEmbeded) {
      money = String(money);
      money = 'R$ ' + Number(money.slice(0, -2)).toLocaleString().replace(/,/g, '.') + ',' + money.slice(-2);
  
    } else {
      money = 'R$ ' + Number(money).toLocaleString().replace(/,/g, ';').replace(/\./g, ',').replace(/;/g, '.');
      if (money.search(',') >= 0) {
        decimalPart = money.split(',').pop();
        decimalPart = decimalPart.length === 1 ? decimalPart + '0' : decimalPart;
        money = money.split(',').shift() + ',' + decimalPart;
      } else {
        money = money + ',00';
      }
    }
    console.log(money);
    return money;
  }
  //
  //
  //
  //
  //
  //Code to API Checkout and Payment ===>>>
  payWithPaypal() {
    this.payPal.init({
      PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
      PayPalEnvironmentSandbox: 'AfFmfMMNUrTblSOumTxKBuAs0kVKozz-taTYP0h8o1LdAI5i6scgtr6vmzE__Om_97Xt5a46KGE_qIPo'
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
      })).then(() => {
        let payment = new PayPalPayment(this.paymentAmount, this.currency, 'Description', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then((res) => {
          console.log(res);
          // Successfully paid
        }, () => {
          // Error or render dialog closed without being successful
        });
      }, () => {
        // Error in configuration
      });
    }, () => {
      // Error in initialization, maybe PayPal isn't supported or something else
    });
  }






  //Get current coordinates of device
  /* getGeolocation() {
    this.geolocation.getCurrentPosition().then((resp) => {

      this.latitude = resp.coords.latitude;
      this.longitude = resp.coords.longitude;
      this.accuracy = resp.coords.accuracy;

      this.getGeoencoder(resp.coords.latitude, resp.coords.longitude);

    }).catch((error) => {
      alert('Error getting location' + JSON.stringify(error));
    });
  } */

  //geocoder method to fetch address from coordinates passed as arguments
  getGeoencoder(latitude, longitude) {
    this.nativeGeocoder.reverseGeocode(latitude, longitude, this.geoencoderOptions)
      .then((result: NativeGeocoderResult[]) => {
        this.address = this.generateAddress(result[0]);
      })
      .catch((error: any) => {
        alert('Error getting location' + JSON.stringify(error));
      });
  }

  //Return Comma saperated address
  generateAddress(addressObj) {
    let obj = [];
    let address = "";
    for (let key in addressObj) {
      obj.push(addressObj[key]);
    }
    obj.reverse();
    for (let val in obj) {
      if (obj[val].length)
        address += obj[val] + ', ';
    }
    return address.slice(0, -2);
  }


  chat(){
    this.navCtrl.navigateForward('chat');
  }
  

}
