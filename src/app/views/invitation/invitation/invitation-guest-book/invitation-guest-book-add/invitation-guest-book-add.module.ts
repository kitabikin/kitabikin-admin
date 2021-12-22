import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@core/shared.module';

import { InvitationGuestBookAddComponent } from './invitation-guest-book-add.component';

export const routes: Routes = [
  {
    path: '',
    component: InvitationGuestBookAddComponent,
  },
];

@NgModule({
  declarations: [InvitationGuestBookAddComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, SharedModule],
})
export class InvitationGuestBookAddModule {}
