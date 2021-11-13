import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// RESOLVER
import { SidebarResolver } from '@resolvers/private';

// GUARD
import { StoreEventPackageDetailGuard } from '@guards';

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
          import('./event-package-page/event-package-page.module').then((m) => m.EventPackagePageModule),
      },
      {
        path: 'add',
        loadChildren: () =>
          import('./event-package-add/event-package-add.module').then((m) => m.EventPackageAddModule),
      },
      {
        path: 'edit/:id',
        canActivate: [StoreEventPackageDetailGuard],
        loadChildren: () =>
          import('./event-package-edit/event-package-edit.module').then((m) => m.EventPackageEditModule),
      },
      {
        path: 'detail/:id',
        canActivate: [StoreEventPackageDetailGuard],
        loadChildren: () =>
          import('./event-package-detail/event-package-detail.module').then(
            (m) => m.EventPackageDetailModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventPackageRoutingModule {}
