import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// RESOLVER
import { SidebarResolver } from '@resolvers/private';

// GUARD
import { StoreInvitationDetailGuard } from '@guards';

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
        path: 'add',
        loadChildren: () =>
          import('./invitation-add/invitation-add.module').then((m) => m.InvitationAddModule),
      },
      {
        path: 'edit/:id_invitation',
        canActivate: [StoreInvitationDetailGuard],
        loadChildren: () =>
          import('./invitation-edit/invitation-edit.module').then((m) => m.InvitationEditModule),
      },
      {
        path: 'detail/:id_invitation',
        canActivate: [StoreInvitationDetailGuard],
        loadChildren: () =>
          import('./invitation-detail/invitation-detail.module').then((m) => m.InvitationDetailModule),
      },
      {
        path: 'data/:id_invitation',
        canActivate: [StoreInvitationDetailGuard],
        loadChildren: () =>
          import('./invitation-data/invitation-data.module').then((m) => m.InvitationDataModule),
      },
      {
        path: 'guest-book/:id_invitation',
        canActivate: [StoreInvitationDetailGuard],
        loadChildren: () =>
          import('./invitation-guest-book/invitation-guest-book.module').then(
            (m) => m.InvitationGuestBookModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvitationRoutingModule {}
