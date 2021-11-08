import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@core/shared.module';

import { ApplicationEditComponent } from './application-edit.component';

export const routes: Routes = [
  {
    path: '',
    component: ApplicationEditComponent,
  },
];

@NgModule({
  declarations: [ApplicationEditComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, SharedModule],
})
export class ApplicationEditModule {}
