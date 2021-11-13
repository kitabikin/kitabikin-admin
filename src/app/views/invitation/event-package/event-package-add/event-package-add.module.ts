import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@core/shared.module';

import { EventPackageAddComponent } from './event-package-add.component';

export const routes: Routes = [
  {
    path: '',
    component: EventPackageAddComponent,
  },
];

@NgModule({
  declarations: [EventPackageAddComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, SharedModule],
})
export class EventPackageAddModule {}
