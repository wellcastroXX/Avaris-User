import { Component, OnInit } from '@angular/core';
import { AlertController, IonRouterOutlet, ModalController, NavController } from '@ionic/angular';
import { Stripe } from '@ionic-native/stripe/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, take } from 'rxjs/operators';    
import { HTTP } from '@ionic-native/http/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthenticationService } from 'src/app/authentication-service';
import { firestore } from 'firebase';
import * as $ from 'jquery';
import { ModalTokenPage } from './modal-token/modal-token.page';
import { LottieAnimationViewModule } from 'ng-lottie';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.page.html',
  styleUrls: ['./wallet.page.scss'],
})
export class WalletPage implements OnInit {

  lottieConfig: { path: string; autoplay: boolean; loop: boolean; };
  //url = 'https://us-central1-avaris-465f8.cloudfunctions.net';
  url = "https://api.iugu.com";
  cards: boolean = false;
  card1: boolean = false;
  card2: boolean = false;
  card3: boolean = false;
  newcard: boolean = false;
  //
  user = {name: 'Well', email: 'well@hotmail.com'};
  expiryMonth: any;
  expiryYear: any;
  customer = {id: ''};
  //
  AllCards: any = [];
  userData: any;
  profileUser: any = [];
  tokenUser: any;
  noCards: boolean = false;
  cardInfo: { name: any; number: any; expMonth: any; expYear: any; cvc: any; };
  dataCard: any = [];
  cardNumber: any;
  expiryMonthYear: any;
  cardCVV: any;
  nameCard: any;
  public CUS_ID: any;
  name: any;
  lastname: any;
  //
  isLoad: boolean = false;
  loading: boolean = false;
  error: boolean = false;
  success: boolean = false;
  warning: boolean = false;
  token: any;
  
  constructor(private navCtrl: NavController,private stripe: Stripe, private http: HttpClient, public Http: HTTP, private modalCtrl: ModalController, private alertCtrl: AlertController,
  private afAuth: AngularFireAuth, public afstore: AngularFirestore, private authService: AuthenticationService, public routerOutlet: IonRouterOutlet) 
  { 
    LottieAnimationViewModule.forRoot();
    this.lottieConfig = {
      path: 'assets/load.json',
      autoplay: true,
      loop: true
    };
  }
  
  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json'
    })
  }

  ngAfterViewInit(){
    $("#payment-form").on;
  }

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: ModalTokenPage,
      showBackdrop: true,
      mode: 'ios',
      backdropDismiss: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    return await modal.present();
  }

  async ngOnInit() {
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
            this.token = this.profileUser.ID;
            const CUS = this.profileUser.CUS_ID;  
            this.CUS_ID = CUS;
            this.name = this.profileUser.nome;
            this.lastname = this.profileUser.sobrenome;
            localStorage.setItem('data', JSON.stringify(this.profileUser));
            JSON.parse(localStorage.getItem('data'));
            console.log(this.profileUser);
            //
            this.verifyCards();
        });
      }
      else {
      } 
    });
  }

  payT(){
    //$("#payment-form").load;
    //$("#token");
    $("#payment-form").submit(function(e) {
      $("#token").show();
      return; 
    });

  }

  logForm(){
    $("#payment-form").trigger("click");
    $("#token").show();
    /* $("#payment-form").submit(function(e) {
      $("#token").show();
      return; 
    }); */
  }

  ionViewDidLoad() {
    this.stripe.setPublishableKey('pk_test_51KF5JnBYiw2MYl1OABl24qrUOe56ZGWD5l0y6He2Rp7aHSM54XPtOlfVOm5kQia2GrpDV7fUgJhhFyWcTp8jS6QH00LKcqMnFA');
  }

  home(){
    this.navCtrl.navigateBack('home');
  }

  addNewCard(){
    this.newcard = true;
    this.cards = false;
  }

  cancelNewCard(){
    this.newcard = false;
    this.verifyCards();
  }

  verifyCards(){
    if(this.profileUser.cards != undefined){
      if(this.profileUser.cards.length >= 1){
        this.cards = true;
        this.AllCards = this.profileUser.cards;
      }else{
        this.cards = false;
      }
    }else{
      this.cards = false;
    }
  }

  getUser(){
    /* const headers = {
      'Content-Type': 'application/json',
      'secretkey': 'xxx',
      'Access-Control-Allow-Origin' : '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT',
      'Accept' : 'application/json',
    }
    const options = {  headers:headers, withCredintials: true}; */
    this.Http.post(`${this.url}/addCustomer`, {
      cusName: this.user.name,
      cusEmail: this.user.email,
    }, {}).then((response) => {
      console.log(response);
    })
    .catch((error) =>{
      console.log(error);
    })
  }

  makeToken(){
    let postData = {
      "account_id": "13E99F0E22E542C58BA9FC087CB6F87B",
      "method": "credit_card",
      "test": true,
      "data": {
        "number": "4242424242424242",
        "verification_value": "123",
        "first_name": "holder",
        "last_name": "name",
        "month": "06",
        "year": "2026"
      }
    }

    console.log(postData);
    const headers = new HttpHeaders().set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('Authorization',  'Basic ' + 'QkY0OEE3MzQzOUQ3QkY5Njc2MzM3Rjk3REJDQjk5MjlCOTU5RDhEM0NCNzk4MkJENjUxMkRDMkZBMDIzMjY3QQ==');

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json ',
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + 'QkY0OEE3MzQzOUQ3QkY5Njc2MzM3Rjk3REJDQjk5MjlCOTU5RDhEM0NCNzk4MkJENjUxMkRDMkZBMDIzMjY3QQ=='
      })
    }

    let head = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
    };//'Authorization': 'Basic ' + 'QkY0OEE3MzQzOUQ3QkY5Njc2MzM3Rjk3REJDQjk5MjlCOTU5RDhEM0NCNzk4MkJENjUxMkRDMkZBMDIzMjY3QQ==',

    let headerss = new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
    });


    this.http.post(`https://api-cors-proxy-avaris.herokuapp.com/${this.url}/v1/payment_token`, postData)
    .subscribe(async res => {
      alert('sucess load data');
      console.log(res);
    }, async err => {
      const alert = await this.alertCtrl.create({
        header: 'Erro',
        message: err.message,
        buttons: ['OK']
      });
      await alert.present();
    });
    
    /* this.Http.post(`${this.url}/v1/payment_token`, postData, {})
    .then((response) => {
      const data = JSON.parse(response.data);
      this.success = data;
      console.log(response);
    })
    .catch((error) => {
      const er = JSON.parse(error.data);
      console.log(error);
      this.error = er;
    }); */

  }

  async SaveCard(cardNumber,expiryMonthYear, cardCVV, nameCard){
    this.isLoad = true;
    this.loading = true;
    if(expiryMonthYear == undefined){
      this.isLoad = true;
      this.error = true;
    }
    expiryMonthYear.split("/");
    this.cardInfo = {
      name: nameCard,
      number: cardNumber,
      expMonth: expiryMonthYear.split("/")[0],
      expYear: expiryMonthYear.split("/")[1],
      cvc: cardCVV,
    };

    let postData = {
      "account_id": "13E99F0E22E542C58BA9FC087CB6F87B",
      "method": "credit_card",
      "test": true,
      "data": {
        "number": this.cardInfo.number,
        "verification_value": this.cardInfo.cvc,
        "first_name": this.name,
        "last_name": this.lastname,
        "month": this.cardInfo.expMonth,
        "year": this.cardInfo.expYear
      }
    }
    console.log(postData);
    try{
      this.http.post(`https://api-cors-proxy-avaris.herokuapp.com/${this.url}/v1/payment_token`, postData)
      .subscribe(async res => {
        this.loading = false;
        this.isLoad = true;
        this.success = true;
        console.log(res);
        this.dataCard = res;
        const thiscard = this.dataCard.id;
        this.saveToken(thiscard);
      }, async err => {
        this.loading = false;
        this.isLoad = true;
        this.warning = true;
        console.log(err);
      });
    }
    catch{
      this.isLoad = true;
      this.loading = false;
      this.error = true;
    }
  }

  saveToken(thiscard){
    let payment = {
      "description": "subscribe",
      "token": thiscard,
      "set_as_default": "true"
    }
    this.Http.post(`https://api.iugu.com/v1/customers/${this.CUS_ID}/payment_methods?api_token=BF48A73439D7BF9676337F97DBCB9929B959D8D3CB7982BD6512DC2FA023267A`, payment, {})
    .then((response) => {
      const data = JSON.parse(response.data);
      console.log(data);
      const name = this.cardInfo.name;
      const card = data.id;
      const brand = this.dataCard.extra_info.brand;
      const lastNumbers = this.dataCard.extra_info.display_number;
      this.afstore.doc(`usuarios/${this.token}`).update({
        cards: firestore.FieldValue.arrayUnion({
        name, card, brand, lastNumbers
        })
      });
      this.verifyCards();
    })
    .catch((error) =>{
      this.isLoad = true;
      this.error = true;
    });
  }

  getAllCards(){
    this.Http.post(`${this.url}/getAllCards`, {
      custId: this.CUS_ID
    }, {})
    .then((response) => {
      console.log(response);
      const data = JSON.parse(response.data);
      console.log(data);//code: "parameter_unknown"
      if(data.code == "parameter_unknown"){
        console.log(`Sem cartoes`);
      }
      if(data.length >= 1){
        console.log(`com cartoes`);
        this.noCards = true;
      }
    })
    .catch((error) =>{
      console.log(error);
    })
    //old request
    /* this.http.post(`${this.url}/getAllCards`, {
      custId: this.customer.id
    }).subscribe(data => {
      console.log(data);
    }); */
  }

  pay(){
    //100 = 1
    //1000 = 10
    //10000 = 100
    const amount = 2400;
    const currency = 'BRL';
    const card = 'card_1KTMZkBYiw2MYl1OQ4eYfdvk';
    const stripeId = this.CUS_ID;
    this.Http.post(`${this.url}/charge`, {
      amount,
      currency,
      token: card,
      custId: stripeId,
    }, {})
    .then((response) => {
      console.log(response);
    })
    .catch((error) =>{
      console.log(error);
    })
  }

  CloseBox(){
    this.error = false;
    this.warning = false;
    this.success = false;
    this.isLoad = false;
  }
  
}
