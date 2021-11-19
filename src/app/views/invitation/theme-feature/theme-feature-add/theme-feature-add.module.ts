import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@core/shared.module';

import { ThemeFeatureAddComponent } from './theme-feature-add.component';

export const routes: Routes = [
  {
    path: '',
    component: ThemeFeatureAddComponent,
  },
];

@NgModule({
  declarations: [ThemeFeatureAddComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, SharedModule],
})
export class ThemeFeatureAddModule {}
