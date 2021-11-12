import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@core/shared.module';

import { EventAddComponent } from './event-add.component';

export const routes: Routes = [
  {
    path: '',
    component: EventAddComponent,
  },
];

@NgModule({
  declarations: [EventAddComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, SharedModule],
})
export class EventAddModule {}
