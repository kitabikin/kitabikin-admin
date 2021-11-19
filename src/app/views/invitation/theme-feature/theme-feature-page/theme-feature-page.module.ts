import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@core/shared.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { ThemeFeaturePageComponent } from './theme-feature-page.component';

export const routes: Routes = [
  {
    path: '',
    component: ThemeFeaturePageComponent,
  },
];

@NgModule({
  declarations: [ThemeFeaturePageComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, SharedModule, NgbDropdownModule],
})
export class ThemeFeaturePageModule {}
