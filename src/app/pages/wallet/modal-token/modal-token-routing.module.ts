import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ModalTokenPage } from './modal-token.page';

const routes: Routes = [
  {
    path: '',
    component: ModalTokenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ModalTokenPageRoutingModule {}
