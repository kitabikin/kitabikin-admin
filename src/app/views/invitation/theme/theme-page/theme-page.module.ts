import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@core/shared.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { ThemePageComponent } from './theme-page.component';

export const routes: Routes = [
  {
    path: '',
    component: ThemePageComponent,
  },
];

@NgModule({
  declarations: [ThemePageComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, SharedModule, NgbDropdownModule],
})
export class ThemePageModule {}
