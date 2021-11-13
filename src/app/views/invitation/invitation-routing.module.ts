import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// RESOLVER
import { SidebarResolver } from '@resolvers/private';

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
          import('./invitation-page/invitation-page.module').then((m) => m.InvitationPageModule),
      },
      {
        path: 'event',
        loadChildren: () => import('./event/event.module').then((m) => m.EventModule),
      },
      {
        path: 'event-package',
        loadChildren: () => import('./event-package/event-package.module').then((m) => m.EventPackageModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvitationRoutingModule {}
