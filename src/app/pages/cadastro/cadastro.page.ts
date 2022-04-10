import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from "@angular/router";
import { AlertController, MenuController, NavController } from '@ionic/angular';
import { LottieAnimationViewModule } from 'ng-lottie';
import { AuthenticationService } from "../../authentication-service";

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit { 

  public account = {  
    password: null  
  };  
  public barLabel: string = "Força da senha:"; 

  isLoad: boolean = false;
  public lottieConfig: Object;
  btn_allowed: boolean = false;

  constructor(
    public authService: AuthenticationService,
    public router: Router,
    private navCtrl: NavController,
    public alertController: AlertController,
    public menuCtrl: MenuController,
  ) { 
    this.menuCtrl.enable(false);

    LottieAnimationViewModule.forRoot();
    this.lottieConfig = {
      path: 'assets/load.json',
      autoplay: true,
      loop: true
    };
   }

  ngOnInit(){
   
  }

  back(){
    this.navCtrl.navigateBack('home');
  } 

  checkTerms($event){
    console.log($event.target.checked);
    const check = $event.target.checked;
    if(check == true){
      this.btn_allowed = false;
    }
    if(check == false){
      this.btn_allowed = true;
    }
  }

  signUp(email, password){
      setTimeout(()=>{
        this.isLoad = true;   
      },0);
      setTimeout(()=>{
        this.authService.RegisterUser(email.value, password.value)      
        .then((res) => {
          console.log('Cadastrado feito com sucesso!');
          this.isLoad = false;  
          let navigationExtras: NavigationExtras = {
            queryParams: {
              email: JSON.stringify(email.value)
            }
          };
          this.router.navigate(['user-data'], navigationExtras);
          // Do something here
        }).catch(async (error) => {
          if(error.code == "auth/email-already-in-use"){
            const alert = await this.alertController.create({
              cssClass: 'my-custom-class',
              header: 'Atenção',
              subHeader: 'verifique e tente novamente',
              message: 'Esse e-mail já está cadastrado',
              buttons: ['OK']
            });
            await alert.present();
            this.isLoad = false;
          }
          if(error.code == "auth/invalid-email"){
            const alert = await this.alertController.create({
              cssClass: 'my-custom-class',
              header: 'Atenção',
              subHeader: 'verifique e tente novamente',
              message: 'Digite um E-mail válido!',
              buttons: ['OK']
            });
            await alert.present();
            this.isLoad = false;
          }
          console.log(error.message);
          
        });
      },4000);
  }

}
