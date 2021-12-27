import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@core/shared.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { InvitationConfirmationAttendancePageComponent } from './invitation-confirmation-attendance-page.component';

export const routes: Routes = [
  {
    path: '',
    component: InvitationConfirmationAttendancePageComponent,
  },
];

@NgModule({
  declarations: [InvitationConfirmationAttendancePageComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, SharedModule, NgbDropdownModule],
})
export class InvitationConfirmationAttendancePageModule {}
