import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@core/shared.module';

import { InvitationGuestBookDetailComponent } from './invitation-guest-book-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: InvitationGuestBookDetailComponent,
  },
];

@NgModule({
  declarations: [InvitationGuestBookDetailComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, SharedModule],
})
export class InvitationGuestBookDetailModule {}
