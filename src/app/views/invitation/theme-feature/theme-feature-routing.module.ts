import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// RESOLVER
import { SidebarResolver } from '@resolvers/private';

// GUARD
import { StoreThemeDetailGuard, StoreThemeFeatureDetailGuard } from '@guards';

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
        path: ':id',
        canActivate: [StoreThemeDetailGuard],
        loadChildren: () =>
          import('./theme-feature-page/theme-feature-page.module').then((m) => m.ThemeFeaturePageModule),
      },
      {
        path: ':id/add',
        canActivate: [StoreThemeDetailGuard],
        loadChildren: () =>
          import('./theme-feature-add/theme-feature-add.module').then((m) => m.ThemeFeatureAddModule),
      },
      {
        path: ':id/edit/:id_theme_feature',
        canActivate: [StoreThemeDetailGuard, StoreThemeFeatureDetailGuard],
        loadChildren: () =>
          import('./theme-feature-edit/theme-feature-edit.module').then((m) => m.ThemeFeatureEditModule),
      },
      {
        path: ':id/detail/:id_theme_feature',
        canActivate: [StoreThemeDetailGuard, StoreThemeFeatureDetailGuard],
        loadChildren: () =>
          import('./theme-feature-detail/theme-feature-detail.module').then(
            (m) => m.ThemeFeatureDetailModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThemeFeatureRoutingModule {}
