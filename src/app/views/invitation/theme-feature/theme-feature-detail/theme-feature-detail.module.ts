import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@core/shared.module';

import { ThemeFeatureDetailComponent } from './theme-feature-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: ThemeFeatureDetailComponent,
  },
];

@NgModule({
  declarations: [ThemeFeatureDetailComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, SharedModule],
})
export class ThemeFeatureDetailModule {}
