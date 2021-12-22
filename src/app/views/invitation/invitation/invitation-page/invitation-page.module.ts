import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@core/shared.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { InvitationPageComponent } from './invitation-page.component';

export const routes: Routes = [
  {
    path: '',
    component: InvitationPageComponent,
  },
];

@NgModule({
  declarations: [InvitationPageComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, SharedModule, NgbDropdownModule],
})
export class InvitationPageModule {}
