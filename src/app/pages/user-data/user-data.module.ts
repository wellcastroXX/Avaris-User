import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserDataPageRoutingModule } from './user-data-routing.module';
import { LottieAnimationViewModule } from 'ng-lottie';
import { UserDataPage } from './user-data.page';
import { BrMaskerModule } from 'br-mask';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BrMaskerModule,
    IonicModule,
    UserDataPageRoutingModule,
    LottieAnimationViewModule.forRoot(),
  ],
  declarations: [UserDataPage]
})
export class UserDataPageModule {}
