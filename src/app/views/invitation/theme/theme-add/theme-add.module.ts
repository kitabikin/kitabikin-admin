import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@core/shared.module';

import { ThemeAddComponent } from './theme-add.component';

export const routes: Routes = [
  {
    path: '',
    component: ThemeAddComponent,
  },
];

@NgModule({
  declarations: [ThemeAddComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, SharedModule],
})
export class ThemeAddModule {}
