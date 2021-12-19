import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// RESOLVER
import { SidebarResolver } from '@resolvers/private';

// GUARD
import { StoreInvitationGuestBookDetailGuard } from '@guards';

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
          import('./invitation-guest-book-page/invitation-guest-book-page.module').then(
            (m) => m.InvitationGuestBookPageModule
          ),
      },
      {
        path: 'add',
        loadChildren: () =>
          import('./invitation-guest-book-add/invitation-guest-book-add.module').then(
            (m) => m.InvitationGuestBookAddModule
          ),
      },
      {
        path: 'edit/:id_invitation_guest_book',
        canActivate: [StoreInvitationGuestBookDetailGuard],
        loadChildren: () =>
          import('./invitation-guest-book-edit/invitation-guest-book-edit.module').then(
            (m) => m.InvitationGuestBookEditModule
          ),
      },
      {
        path: 'detail/:id_invitation_guest_book',
        canActivate: [StoreInvitationGuestBookDetailGuard],
        loadChildren: () =>
          import('./invitation-guest-book-detail/invitation-guest-book-detail.module').then(
            (m) => m.InvitationGuestBookDetailModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvitationGuestBookRoutingModule {}
