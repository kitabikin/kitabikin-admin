import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@core/shared.module';

import { ThemeDetailComponent } from './theme-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: ThemeDetailComponent,
  },
];

@NgModule({
  declarations: [ThemeDetailComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, SharedModule],
})
export class ThemeDetailModule {}
