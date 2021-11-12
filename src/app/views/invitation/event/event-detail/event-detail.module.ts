import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@core/shared.module';

import { EventDetailComponent } from './event-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: EventDetailComponent,
  },
];

@NgModule({
  declarations: [EventDetailComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, SharedModule],
})
export class EventDetailModule {}
