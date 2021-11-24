import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@core/shared.module';
import { NgbDropdownModule, NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';

import { InvitationDataComponent } from './invitation-data.component';

export const routes: Routes = [
  {
    path: '',
    component: InvitationDataComponent,
  },
];

@NgModule({
  declarations: [InvitationDataComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    SharedModule,
    NgbDropdownModule,
    NgbAccordionModule,
  ],
})
export class InvitationDataModule {}
