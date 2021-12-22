import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@core/shared.module';

import { InvitationGuestBookEditComponent } from './invitation-guest-book-edit.component';

export const routes: Routes = [
  {
    path: '',
    component: InvitationGuestBookEditComponent,
  },
];

@NgModule({
  declarations: [InvitationGuestBookEditComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, SharedModule],
})
export class InvitationGuestBookEditModule {}
