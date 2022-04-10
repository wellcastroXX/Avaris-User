import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { IonicModule } from '@ionic/angular';
import { HomePageRoutingModule } from './home-routing.module';
import { BrMaskerModule } from 'br-mask';
import { HomePage } from './home.page';
import { LottieAnimationViewModule } from 'ng-lottie';
import { LOCALE_ID } from '@angular/core';
import localePt from '@angular/common/locales/pt';
import {registerLocaleData} from '@angular/common';
registerLocaleData(localePt)

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BrMaskerModule,
    HomePageRoutingModule,
    LottieAnimationViewModule.forRoot(),
  ],
  providers: [Geolocation, {provide: LOCALE_ID, useValue: "pt-BR"}],
  declarations: [HomePage]
})
export class HomePageModule {}
