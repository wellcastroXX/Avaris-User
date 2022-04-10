import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AvarisPremiumPage } from './avaris-premium.page';

const routes: Routes = [
  {
    path: '',
    component: AvarisPremiumPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AvarisPremiumPageRoutingModule {}
