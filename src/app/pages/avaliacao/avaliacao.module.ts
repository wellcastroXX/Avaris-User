import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AvaliacaoPageRoutingModule } from './avaliacao-routing.module';

import { AvaliacaoPage } from './avaliacao.page';
import { EmojisComponent } from './emojis/emojis.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AvaliacaoPageRoutingModule
  ],
  declarations: [AvaliacaoPage, EmojisComponent]
})
export class AvaliacaoPageModule {}
