import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@core/shared.module';

import { ThemeFeatureEditComponent } from './theme-feature-edit.component';

export const routes: Routes = [
  {
    path: '',
    component: ThemeFeatureEditComponent,
  },
];

@NgModule({
  declarations: [ThemeFeatureEditComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, SharedModule],
})
export class ThemeFeatureEditModule {}
