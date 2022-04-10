import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// geolocation and native-geocoder
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { GoogleMaps } from '@ionic-native/google-maps';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { LocationAccuracy } from '@awesome-cordova-plugins/location-accuracy/ngx';
import { KilometerToMeterPipe } from './kilometer-to-meter.pipe';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';       
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FIREBASE_CONFIG } from './FIREBASE-AUTHENTICATION';
import { LottieAnimationViewModule } from 'ng-lottie';
import { BrMaskerModule } from 'br-mask';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Apollo } from "apollo-angular";
import {APOLLO_OPTIONS} from 'apollo-angular';
import {InMemoryCache} from '@apollo/client/core';
import { HttpLinkModule } from 'apollo-angular-link-http';
import { HTTP } from '@ionic-native/http/ngx';
import localeDe from '@angular/common/locales/de';
import { registerLocaleData } from '@angular/common';
import { Stripe } from '@ionic-native/stripe/ngx';
import { NgxStripeModule } from 'ngx-stripe';
import { InAppPurchase2 } from '@awesome-cordova-plugins/in-app-purchase-2/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Camera } from '@awesome-cordova-plugins/camera/ngx';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { PasswordStrengthMeterModule } from 'angular-password-strength-meter';
import { Apollo_Module } from './Apollo.module';
import { AuthenticationModule } from './Authentication';
registerLocaleData(localeDe);

@NgModule({
  declarations: [AppComponent, KilometerToMeterPipe],
  entryComponents: [],
  imports: [BrowserModule, 
    IonicModule.forRoot(),
    AppRoutingModule,
    BrMaskerModule,
    HttpLinkModule,
    HttpClientModule,
    FormsModule,
    AngularFireStorageModule,
    NgxStripeModule.forRoot('pk_test_51KF5JnBYiw2MYl1OgsYPpCVpYHQ3OTV1hvgr0ewMR8wZmGz3KwrAbxjzFUquO7lcfctwBJoQHWoZrwMVKAv8XeN400sAwBGjmK'),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    PasswordStrengthMeterModule,
    LottieAnimationViewModule.forRoot(),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
   GoogleMaps,
   Geolocation,
   NativeGeocoder,
   HttpClient,
   InAppPurchase2,
   InAppBrowser,
   HTTP,
   Camera,
   DatePipe,
   Apollo,
   Stripe,
   AndroidPermissions,
   LocationAccuracy,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
