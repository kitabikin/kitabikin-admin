import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@core/shared.module';

import { TestimonialEditComponent } from './testimonial-edit.component';

export const routes: Routes = [
  {
    path: '',
    component: TestimonialEditComponent,
  },
];

@NgModule({
  declarations: [TestimonialEditComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, SharedModule],
})
export class TestimonialEditModule {}
