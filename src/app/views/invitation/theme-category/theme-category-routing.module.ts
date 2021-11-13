import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// RESOLVER
import { SidebarResolver } from '@resolvers/private';

// GUARD
import { StoreThemeCategoryDetailGuard } from '@guards';

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
          import('./theme-category-page/theme-category-page.module').then((m) => m.ThemeCategoryPageModule),
      },
      {
        path: 'add',
        loadChildren: () =>
          import('./theme-category-add/theme-category-add.module').then((m) => m.ThemeCategoryAddModule),
      },
      {
        path: 'edit/:id',
        canActivate: [StoreThemeCategoryDetailGuard],
        loadChildren: () =>
          import('./theme-category-edit/theme-category-edit.module').then((m) => m.ThemeCategoryEditModule),
      },
      {
        path: 'detail/:id',
        canActivate: [StoreThemeCategoryDetailGuard],
        loadChildren: () =>
          import('./theme-category-detail/theme-category-detail.module').then(
            (m) => m.ThemeCategoryDetailModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThemeCategoryRoutingModule {}
