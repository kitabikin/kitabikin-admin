import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@core/shared.module';

import { ApplicationDetailComponent } from './application-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: ApplicationDetailComponent,
  },
];

@NgModule({
  declarations: [ApplicationDetailComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, SharedModule],
})
export class ApplicationDetailModule {}
