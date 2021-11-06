import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '@core/shared.module';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { LoginPageComponent } from './login-page.component';

export const routes: Routes = [
  {
    path: '',
    component: LoginPageComponent,
  },
];

@NgModule({
  declarations: [LoginPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    NgbAlertModule,
  ],
})
export class LoginPageModule {}
