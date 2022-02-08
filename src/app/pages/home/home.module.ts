import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';
import { BrMaskerModule } from 'br-mask';
import { HomePage } from './home.page';
import { LottieAnimationViewModule } from 'ng-lottie';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrMaskerModule,
    HomePageRoutingModule,
    LottieAnimationViewModule.forRoot(),
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
