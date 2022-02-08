import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// geolocation and native-geocoder
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { GoogleMaps } from '@ionic-native/google-maps';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
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
import { PayPal } from '@ionic-native/paypal/ngx';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Apollo } from "apollo-angular";
import {APOLLO_OPTIONS} from 'apollo-angular';
import {InMemoryCache} from '@apollo/client/core';
import { HttpLinkModule } from 'apollo-angular-link-http';

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
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,
    LottieAnimationViewModule.forRoot()
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
   GoogleMaps,
   Geolocation,
   NativeGeocoder,
   HttpClient,
   DatePipe,
   Apollo, 
   PayPal,
   AndroidPermissions,
   LocationAccuracy,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
