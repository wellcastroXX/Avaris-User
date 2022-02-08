import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from "@angular/router";
import { MenuController, NavController } from '@ionic/angular';
import { LottieAnimationViewModule } from 'ng-lottie';
import { AuthenticationService } from "../../authentication-service";

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit {
  isLoad: boolean = false;
  public lottieConfig: Object;

  constructor(
    public authService: AuthenticationService,
    public router: Router,
    private navCtrl: NavController,
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

  signUp(email, password){
      setTimeout(()=>{
        this.isLoad = true;   
      },0);
      setTimeout(()=>{
        console.log('Cadastrado feito com sucesso!');
        this.authService.RegisterUser(email.value, password.value)      
        .then((res) => {
          console.log('Cadastrado feito com sucesso!');
          this.isLoad = false;  
          this.navCtrl.navigateForward('user-data');
          // Do something here
        }).catch((error) => {
          window.alert(error.message)
        });
      },4000);
  }

}
