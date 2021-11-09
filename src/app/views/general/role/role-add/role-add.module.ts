import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@core/shared.module';

import { RoleAddComponent } from './role-add.component';

export const routes: Routes = [
  {
    path: '',
    component: RoleAddComponent,
  },
];

@NgModule({
  declarations: [RoleAddComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, SharedModule],
})
export class RoleAddModule {}
