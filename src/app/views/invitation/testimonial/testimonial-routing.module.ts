import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// RESOLVER
import { SidebarResolver } from '@resolvers/private';

// GUARD
import { StoreTestimonialDetailGuard } from '@guards';

const routes: Routes = [
  {
    path: '',
    resolve: {
      hero: SidebarResolver,
    },
    data: {
      sidebarCode: 'invitation',
    },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./testimonial-page/testimonial-page.module').then((m) => m.TestimonialPageModule),
      },
      {
        path: 'add',
        loadChildren: () =>
          import('./testimonial-add/testimonial-add.module').then((m) => m.TestimonialAddModule),
      },
      {
        path: 'edit/:id',
        canActivate: [StoreTestimonialDetailGuard],
        loadChildren: () =>
          import('./testimonial-edit/testimonial-edit.module').then((m) => m.TestimonialEditModule),
      },
      {
        path: 'detail/:id',
        canActivate: [StoreTestimonialDetailGuard],
        loadChildren: () =>
          import('./testimonial-detail/testimonial-detail.module').then((m) => m.TestimonialDetailModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestimonialRoutingModule {}
