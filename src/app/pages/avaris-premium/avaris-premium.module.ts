import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AvarisPremiumPageRoutingModule } from './avaris-premium-routing.module';
import localeDe from '@angular/common/locales/de';
import { registerLocaleData } from '@angular/common';
import { AvarisPremiumPage } from './avaris-premium.page';
import { NgxStripeModule } from 'ngx-stripe';
import { LottieAnimationViewModule } from 'ng-lottie';
registerLocaleData(localeDe);
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxStripeModule.forRoot('pk_test_51KF5JnBYiw2MYl1OgsYPpCVpYHQ3OTV1hvgr0ewMR8wZmGz3KwrAbxjzFUquO7lcfctwBJoQHWoZrwMVKAv8XeN400sAwBGjmK'),
    AvarisPremiumPageRoutingModule,
    LottieAnimationViewModule.forRoot(),
  ],
  declarations: [AvarisPremiumPage]
})
export class AvarisPremiumPageModule {}
