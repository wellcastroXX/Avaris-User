import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { MenuController, NavController } from '@ionic/angular';
import { LottieAnimationViewModule } from 'ng-lottie';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.page.html',
  styleUrls: ['./user-data.page.scss'],
})
export class UserDataPage implements OnInit {
  
  public lottieConfig: Object;
  Step1: boolean = true;
  Step2: boolean = false;
  Step3: boolean = false;
  Step4: boolean = false;
  Step5: boolean = false;
  Step6: boolean = false;
  //
  userData: any;
  cpf: any;
  nome: any;
  sobrenome: any;
  datadenascimento: any;
  celular: any;
  token: any;
  isLoad: boolean = false;

  constructor(public menuCtrl: MenuController, private afAuth: AngularFireAuth, public afstore: AngularFirestore, public navCtrl: NavController) {
    this.menuCtrl.enable(false);

    LottieAnimationViewModule.forRoot();
    this.lottieConfig = {
      path: 'assets/load.json',
      autoplay: true,
      loop: true
    };
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
  }

  saveData(cpf, nome, sobrenome, datadenascimento, celular){
    const ID = this.token;
    console.log(nome, sobrenome, datadenascimento, celular, cpf);
    setTimeout(()=>{
      this.isLoad = true;   
    },0);
    setTimeout(()=>{
      this.afstore.doc(`usuarios/${this.token}`).set({
        ID, nome, sobrenome, datadenascimento, celular, cpf
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
