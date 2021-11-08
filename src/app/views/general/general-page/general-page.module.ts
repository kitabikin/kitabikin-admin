import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@core/shared.module';

import { GeneralPageComponent } from './general-page.component';

export const routes: Routes = [
  {
    path: '',
    component: GeneralPageComponent,
  },
];

@NgModule({
  declarations: [GeneralPageComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, SharedModule],
})
export class GeneralPageModule {}
