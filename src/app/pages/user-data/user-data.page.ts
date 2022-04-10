import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { HTTP } from '@ionic-native/http/ngx';
import { Stripe } from '@ionic-native/stripe/ngx';
import { MenuController, NavController } from '@ionic/angular';
import { LottieAnimationViewModule } from 'ng-lottie';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.page.html',
  styleUrls: ['./user-data.page.scss'],
})
export class UserDataPage implements OnInit {

  //DESISTIR DO NODE.JS E APOLLO CLIENT, E FOCAR EM CHAMAR OS CURLS, VIA HTTP.POST. UTLIZANDO HEADERS NATIVOS
  
  url = 'https://api.iugu.com/v1/customers?api_token=BF48A73439D7BF9676337F97DBCB9929B959D8D3CB7982BD6512DC2FA023267A';
  public lottieConfig: Object;
  Step1: boolean = true;
  Step2: boolean = false;
  Step3: boolean = false;
  Step4: boolean = false;
  Step5: boolean = false;
  Step6: boolean = false;
  //
  email: any;
  userData: any;
  cpf: any;
  nome: any;
  sobrenome: any;
  datadenascimento: any;
  celular: any;
  token: any;
  isLoad: boolean = false;
  user = {name: '', email: ''};

  constructor(public menuCtrl: MenuController, private afAuth: AngularFireAuth, public afstore: AngularFirestore, public navCtrl: NavController, private route: ActivatedRoute, private router: Router,
    private stripe: Stripe, private http: HttpClient, public Http: HTTP) {
    this.menuCtrl.enable(false);

    LottieAnimationViewModule.forRoot();
    this.lottieConfig = {
      path: 'assets/load.json',
      autoplay: true,
      loop: true
    };

    this.route.queryParams.subscribe(params => {
      if (params && params.email) {
        this.email = JSON.parse(params.email);
        console.log(this.email);
      }
    });
  }

  ngOnInit() {
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
    this.sendPostRequest();
  }

  sendPostRequest() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept':'application/json',
        "Content-Type":'application/json'
        })
    };
    let postData = {
      "email": "customer004@email.com",
      "name": "Customer004",
    }
    /* const headers = new HttpHeaders()
    .set('Accept', 'application/json')
    .set('Content-Type', 'application/json'); */

    
    /* .subscribe(data => {
      console.log(data['_body']);
     }, error => {
      console.log(error);
    }); */
  }

  getUser(cpf, nome, sobrenome, datadenascimento, celular){
    let postData = {
      "email": this.email,
      "name": nome,
    }

    this.Http.post(this.url, postData, {} )
    .then((response) => {
      console.log(JSON.parse(response.data));
      const data = JSON.parse(response.data);
      const CUS_ID = data.id;
      console.log(CUS_ID);
      this.saveData(cpf, nome, sobrenome, datadenascimento, celular, CUS_ID);
    })                                                                                                                                                                                                                                                                                                                                 
    .catch((error) => {
      console.log(error);   
    })
  }

  saveData(cpf, nome, sobrenome, datadenascimento, celular, CUS_ID){
    const ID = this.token;
    const email = this.email;
    console.log(nome, sobrenome, datadenascimento, celular, CUS_ID, cpf);
    setTimeout(()=>{
      this.isLoad = true;   
    },0);
    setTimeout(()=>{
      this.afstore.doc(`usuarios/${this.token}`).set({
        ID, email, nome, sobrenome, datadenascimento, celular, cpf, CUS_ID
      });
      this.navCtrl.navigateForward('home');
    },6000);
  }

  backStep1(){ this.Step1 = true; this.Step2 = false; }
  backStep2(){ this.Step2 = true; this.Step3 = false; }
  backStep3(){ this.Step3 = true; this.Step4 = false; }
  backStep4(){ this.Step4 = true; this.Step5 = false; }
  backStep5(){ this.Step5 = true; this.Step6 = false; }

  nextStep1(){
    this.Step1 = false;
    this.Step2 = true;
  }
  nextStep2(){
    this.Step2 = false;
    this.Step3 = true;
  }
  nextStep3(){
    this.Step3 = false;
    this.Step4 = true;
  }
  nextStep4(){
    this.Step4 = false;
    this.Step5 = true;
  }
}
