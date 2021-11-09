import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// RESOLVER
import { SidebarResolver } from '@resolvers/private';

// GUARD
import { StoreUserDetailGuard } from '@guards';

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
        loadChildren: () => import('./user-page/user-page.module').then((m) => m.UserPageModule),
      },
      // {
      //   path: 'add',
      //   loadChildren: () => import('./user-add/user-add.module').then((m) => m.UserAddModule),
      // },
      // {
      //   path: 'edit/:id',
      //   canActivate: [StoreUserDetailGuard],
      //   loadChildren: () => import('./user-edit/user-edit.module').then((m) => m.UserEditModule),
      // },
      {
        path: 'detail/:id',
        canActivate: [StoreUserDetailGuard],
        loadChildren: () => import('./user-detail/user-detail.module').then((m) => m.UserDetailModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
