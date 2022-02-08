import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatAreaComponent } from './chat-area/chat-area.component';

import { ChatPage } from './chat.page';

const routes: Routes = [
  {
    path: '',
    component: ChatPage
  },
  {
    path: 'chat-area',
    component: ChatAreaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatPageRoutingModule {}
