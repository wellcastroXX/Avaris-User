import { Component, OnInit, ViewChild } from '@angular/core';
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions,
} from '@stripe/stripe-js';
import { DataService } from 'src/app/data.service';
import { ActionSheetController, AlertController, MenuController, NavController, Platform } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { InAppPurchase2 } from '@awesome-cordova-plugins/in-app-purchase-2/ngx';
import { firestore } from 'firebase';
import { HTTP } from '@ionic-native/http/ngx';
import { Stripe } from '@ionic-native/stripe/ngx';
import { take } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/authentication-service';
import { btn } from 'src/assets/script.js';
import { LottieAnimationViewModule } from 'ng-lottie';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-avaris-premium',
  templateUrl: './avaris-premium.page.html',
  styleUrls: ['./avaris-premium.page.scss'],
})
export class AvarisPremiumPage implements OnInit {
  @ViewChild(StripeCardComponent) card: StripeCardComponent;

  isLoad: boolean = false;
  success: boolean = false;
  loading: boolean = false;
  error: boolean = false;
  warning: boolean = false;
  premium: boolean = false;
  cardOptions: StripeCardElementOptions = {
    style: {
        base: {
        iconColor: '#666EE8',
         color: '#31325F',
         fontWeight: '300',
         fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
         fontSize: '18px',
        '::placeholder': {
        color: '#CFD7E0',
        },
      },
   },
  };elementsOptions: StripeElementsOptions = {
      locale: 'pt',
  };
  url = "https://api.iugu.com";
  public lottieConfig: Object;
  userData: any
  token: any;
  PaymentMethodID;
  customerID: any;
  banner: boolean = false;
  terms: boolean = false;
  noCards: boolean = false;
  public profileUser: any = [];
  cardInfo: { name: any; number: any; expMonth: any; expYear: any; cvc: any; };
  dataCard: any = [];
  cardNumber: any;
  expiryMonthYear: any;
  cardCVV: any;
  nameCard: any;
  public CUS_ID: any;
  name: any;
  lastname: any;

  constructor(private stripeService: StripeService, private service: DataService,public actionSheetController: ActionSheetController, private navCtrl: NavController, public Http: HTTP, private stripe: Stripe,
    public afstore: AngularFirestore, private afAuth: AngularFireAuth, private iab: InAppBrowser, public platform: Platform, private store: InAppPurchase2, private menuCtrl: MenuController,
    private authService: AuthenticationService, public alertController: AlertController, private http: HttpClient,) 
    {
      LottieAnimationViewModule.forRoot();
      this.lottieConfig = {
        path: 'assets/confetti_sucess.json',
        autoplay: true,
        loop: true
      };

      this.afAuth.authState.subscribe(user => {
        if (user) {
          this.userData = user;
          localStorage.setItem('user', JSON.stringify(this.userData));
          JSON.parse(localStorage.getItem('user'));
          console.log(this.userData);
          this.token = this.userData.uid;
        } else {
          localStorage.setItem('user', null);
          JSON.parse(localStorage.getItem('user'));
        }
      });
      this.afAuth.authState.pipe(take(1)).subscribe(async data => {
        if (data && data.email && data.uid){
          this.authService.getDatas(data.uid).subscribe( data => {
              this.profileUser = data;   
              const CUS = this.profileUser.CUS_ID;  
              this.CUS_ID = CUS;
              this.name = this.profileUser.nome;
              this.lastname = this.profileUser.sobrenome;
              localStorage.setItem('data', JSON.stringify(this.profileUser));
              JSON.parse(localStorage.getItem('data'));
              console.log(this.profileUser);    
              //
          });
        }
        else {
        } 
      });
    }


  ionViewDidLoad() {
    this.stripe.setPublishableKey('pk_test_51KF5JnBYiw2MYl1OABl24qrUOe56ZGWD5l0y6He2Rp7aHSM54XPtOlfVOm5kQia2GrpDV7fUgJhhFyWcTp8jS6QH00LKcqMnFA');
  }

  ngOnInit() {
    this.menuCtrl.enable(false);
    
  }

  closePopUp(){
    this.navCtrl.navigateBack('home');
  }

  closeTerms(){
    this.terms = false;
    this.Terms();
  }

  checkvalues(): void {
    this.stripeService.createPaymentMethod({
       type: 'card',
       card: this.card.element,
       billing_details: { name: null },
    }).subscribe((result) => {
      console.log(result);
    });
  }

  backSubscribe(){
    this.banner = false;
  }

  async Terms() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Aceito os termos de serviço',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Eu aceito',
        handler: () => {
          console.log('accepted');
          this.afstore.doc(`usuarios/${this.token}`).update({
          terms: 'Aceito'
          });
          this.banner = true;
        } 
      }, {
        text: 'Ver termos',
        handler: () => {
          console.log('look terms');
          this.terms = true;
        }
      }, {
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }

  async SaveCard(cardNumber,expiryMonthYear, cardCVV, nameCard){
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

    console.log(postData, this.cardInfo);
    
    try{
      this.http.post(`https://api-cors-proxy-avaris.herokuapp.com/${this.url}/v1/payment_token`, postData)
      .subscribe(async res => {
        console.log(res);
        this.dataCard = res;
        const thiscard = this.dataCard.id;
        this.saveCard(thiscard);
      }, async err => {
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

  saveCard(thiscard){ 
    let payment = {
      "description": "subscribe",
      "token": thiscard,
      "set_as_default": "true"
    }
    this.Http.post(`https://api.iugu.com/v1/customers/${this.CUS_ID}/payment_methods?api_token=BF48A73439D7BF9676337F97DBCB9929B959D8D3CB7982BD6512DC2FA023267A`, payment, {})
    .then((response) => {
      const data = JSON.parse(response.data);
      console.log(data);
      /* const name = this.cardInfo.name;
      const card = this.dataCard.id;
      const brand = this.dataCard.extra_info.brand;
      const lastNumbers = this.dataCard.extra_info.display_number;
      this.afstore.doc(`usuarios/${this.token}`).update({
        cards: firestore.FieldValue.arrayUnion({
          name, card, brand, lastNumbers
        })
      }); */
      this.subscribe();
    })
    .catch((error) =>{
      this.isLoad = true;
      this.error = true;
    });
  }
  
  subscribe(){
    let day = new Date().getDate()
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    const date = day + '-' + month + '-' + year;

    let sub = {
      "two_step": false,
      "suspend_on_invoice_expired": true,
      "only_charge_on_due_date": false,
      "plan_identifier": "premium",
      "expires_at": date,
      "only_on_charge_success": true,
      "ignore_due_email": false,
      "customer_id": this.CUS_ID
    }
    this.Http.post("https://api.iugu.com/v1/subscriptions?api_token=BF48A73439D7BF9676337F97DBCB9929B959D8D3CB7982BD6512DC2FA023267A", sub, {})
    .then((response) => {
      const data = JSON.parse(response.data);
      console.log(data);
      this.isLoad = false;   
      this.premium = true;
      this.success = true;
      const avaris = true;
      const firstPayment = date;
      const amount = "R$ 4,99";
      this.afstore.doc(`usuarios/${this.token}`).update({
        avarispremium: firestore.FieldValue.arrayUnion({
          avaris, amount, firstPayment
        })
      });
    })
    .catch((error) =>{
      this.isLoad = true;
      this.error = true;
    });
    
  }

  finish(){
    this.navCtrl.navigateForward("home");
  }

  CloseBox(){
    this.isLoad = false;   
    this.loading = false;
    this.premium = false;
    this.success = false;
    this.error = false;
    this.warning = false;
  }

}
