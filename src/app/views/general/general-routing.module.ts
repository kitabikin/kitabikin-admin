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
      sidebarCode: 'general',
    },
    children: [
      {
        path: '',
        loadChildren: () => import('./general-page/general-page.module').then((m) => m.GeneralPageModule),
      },
      {
        path: 'application',
        loadChildren: () => import('./application/application.module').then((m) => m.ApplicationModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralRoutingModule {}
