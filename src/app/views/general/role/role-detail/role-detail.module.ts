import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@core/shared.module';

import { RoleDetailComponent } from './role-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: RoleDetailComponent,
  },
];

@NgModule({
  declarations: [RoleDetailComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, SharedModule],
})
export class RoleDetailModule {}
