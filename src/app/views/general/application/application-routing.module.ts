import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// RESOLVER
import { SidebarResolver } from '@resolvers/private';

// GUARD
import { StoreApplicationDetailGuard } from '@guards';

const routes: Routes = [
  {
    path: '',
    resolve: {
      hero: SidebarResolver,
    },
    data: {
      sidebarCode: 'general',
    },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./application-page/application-page.module').then((m) => m.ApplicationPageModule),
      },
      // {
      //   path: 'add',
      //   loadChildren: () => import('./application-add/application-add.module').then((m) => m.ApplicationAddModule),
      // },
      // {
      //   path: 'edit/:id',
      //   canActivate: [StoreApplicationDetailGuard],
      //   loadChildren: () => import('./application-edit/application-edit.module').then((m) => m.ApplicationEditModule),
      // },,
      {
        path: 'detail/:id',
        canActivate: [StoreApplicationDetailGuard],
        loadChildren: () =>
          import('./application-detail/application-detail.module').then((m) => m.ApplicationDetailModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApplicationRoutingModule {}
