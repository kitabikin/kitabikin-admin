import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// RESOLVER
import { SidebarResolver } from '@resolvers/private';

// GUARD
import { StoreEventDetailGuard } from '@guards';

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
        loadChildren: () => import('./event-page/event-page.module').then((m) => m.EventPageModule),
      },
      // {
      //   path: 'add',
      //   loadChildren: () =>
      //     import('./event-add/event-add.module').then((m) => m.EventAddModule),
      // },
      // {
      //   path: 'edit/:id',
      //   canActivate: [StoreEventDetailGuard],
      //   loadChildren: () =>
      //     import('./event-edit/event-edit.module').then((m) => m.EventEditModule),
      // },
      {
        path: 'detail/:id',
        canActivate: [StoreEventDetailGuard],
        loadChildren: () => import('./event-detail/event-detail.module').then((m) => m.EventDetailModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EventRoutingModule {}
