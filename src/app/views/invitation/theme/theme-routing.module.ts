import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// RESOLVER
import { SidebarResolver } from '@resolvers/private';

// GUARD
import { StoreThemeDetailGuard } from '@guards';

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
        loadChildren: () => import('./theme-page/theme-page.module').then((m) => m.ThemePageModule),
      },
      {
        path: 'add',
        loadChildren: () => import('./theme-add/theme-add.module').then((m) => m.ThemeAddModule),
      },
      {
        path: 'edit/:id',
        canActivate: [StoreThemeDetailGuard],
        loadChildren: () => import('./theme-edit/theme-edit.module').then((m) => m.ThemeEditModule),
      },
      {
        path: 'detail/:id',
        canActivate: [StoreThemeDetailGuard],
        loadChildren: () => import('./theme-detail/theme-detail.module').then((m) => m.ThemeDetailModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThemeRoutingModule {}
