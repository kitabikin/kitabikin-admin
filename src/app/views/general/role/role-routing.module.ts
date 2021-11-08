import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// RESOLVER
import { SidebarResolver } from '@resolvers/private';

// GUARD
// import { StoreRoleDetailGuard } from '@guards';

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
        loadChildren: () => import('./role-page/role-page.module').then((m) => m.RolePageModule),
      },
      // {
      //   path: 'add',
      //   loadChildren: () =>
      //     import('./role-add/role-add.module').then((m) => m.RoleAddModule),
      // },
      // {
      //   path: 'edit/:id',
      //   canActivate: [StoreRoleDetailGuard],
      //   loadChildren: () =>
      //     import('./role-edit/role-edit.module').then((m) => m.RoleEditModule),
      // },
      // {
      //   path: 'detail/:id',
      //   canActivate: [StoreRoleDetailGuard],
      //   loadChildren: () =>
      //     import('./role-detail/role-detail.module').then((m) => m.RoleDetailModule),
      // },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RoleRoutingModule {}
