import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@core/shared.module';

import { EventPackageEditComponent } from './event-package-edit.component';

export const routes: Routes = [
  {
    path: '',
    component: EventPackageEditComponent,
  },
];

@NgModule({
  declarations: [EventPackageEditComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, SharedModule],
})
export class EventPackageEditModule {}
