import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@core/shared.module';

import { ThemeCategoryDetailComponent } from './theme-category-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: ThemeCategoryDetailComponent,
  },
];

@NgModule({
  declarations: [ThemeCategoryDetailComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, SharedModule],
})
export class ThemeCategoryDetailModule {}
