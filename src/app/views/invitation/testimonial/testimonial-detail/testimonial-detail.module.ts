import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@core/shared.module';

import { TestimonialDetailComponent } from './testimonial-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: TestimonialDetailComponent,
  },
];

@NgModule({
  declarations: [TestimonialDetailComponent],
  imports: [CommonModule, RouterModule.forChild(routes), TranslateModule, SharedModule],
})
export class TestimonialDetailModule {}
