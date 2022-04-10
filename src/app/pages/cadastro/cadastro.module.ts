import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CadastroPageRoutingModule } from './cadastro-routing.module';

import { CadastroPage } from './cadastro.page';

import { LottieAnimationViewModule } from 'ng-lottie';
import { PasswordStrengthBarComponent } from 'src/app/password-strength-bar/password-strength-bar.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    CadastroPageRoutingModule,
    LottieAnimationViewModule.forRoot(),
  ],
  declarations: [CadastroPage,PasswordStrengthBarComponent ]
})
export class CadastroPageModule {}
