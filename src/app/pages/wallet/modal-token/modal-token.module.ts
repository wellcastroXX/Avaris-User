import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ModalTokenPageRoutingModule } from './modal-token-routing.module';

import { ModalTokenPage } from './modal-token.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ModalTokenPageRoutingModule
  ],
  declarations: [ModalTokenPage]
})
export class ModalTokenPageModule {}
