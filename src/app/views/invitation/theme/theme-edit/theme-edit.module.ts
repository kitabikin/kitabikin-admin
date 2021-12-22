import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@core/shared.module';

import { ThemeEditComponent } from './theme-edit.component';

export const routes: Routes = [
  {
    path: '',
    component: ThemeEditComponent,
  },
];

@NgModule({
  declarations: [ThemeEditComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, SharedModule],
})
export class ThemeEditModule {}
