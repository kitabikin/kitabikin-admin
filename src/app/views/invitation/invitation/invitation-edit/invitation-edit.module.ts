import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@core/shared.module';

import { InvitationEditComponent } from './invitation-edit.component';

export const routes: Routes = [
  {
    path: '',
    component: InvitationEditComponent,
  },
];

@NgModule({
  declarations: [InvitationEditComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, SharedModule],
})
export class InvitationEditModule {}
