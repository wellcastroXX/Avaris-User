import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WalletPageRoutingModule } from './wallet-routing.module';
import { LottieAnimationViewModule } from 'ng-lottie';
import { WalletPage } from './wallet.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WalletPageRoutingModule,
    LottieAnimationViewModule.forRoot(),
  ],
  declarations: [WalletPage]
})
export class WalletPageModule {}
