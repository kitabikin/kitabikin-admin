import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@core/shared.module';

import { UserEditComponent } from './user-edit.component';

export const routes: Routes = [
  {
    path: '',
    component: UserEditComponent,
  },
];

@NgModule({
  declarations: [UserEditComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, SharedModule],
})
export class UserEditModule {}
