import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeusDadosComponent } from './meus-dados/meus-dados.component';

import { ProfilePage } from './profile.page';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage
  },
  {
    path: 'meus-dados',
    component: MeusDadosComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfilePageRoutingModule {}
