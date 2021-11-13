import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@core/shared.module';

import { ThemeCategoryEditComponent } from './theme-category-edit.component';

export const routes: Routes = [
  {
    path: '',
    component: ThemeCategoryEditComponent,
  },
];

@NgModule({
  declarations: [ThemeCategoryEditComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, SharedModule],
})
export class ThemeCategoryEditModule {}
