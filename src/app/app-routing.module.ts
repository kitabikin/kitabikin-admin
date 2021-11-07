import { Routes } from '@angular/router';

// GUARD
import { AuthenticationGuard } from '@guards';

// COMPONENT (PUBLIC)
import { LoginComponent as PublicLoginComponent } from '@templates/public/container/login/login.component';

// COMPONENT (PRIVATE)
import { AdminComponent as PrivateAdminComponent } from '@templates/private/container/admin/admin.component';

export const AppRoutingModule: Routes = [
  {
    path: '',
    component: PublicLoginComponent,
    data: {
      discriminantPathKey: 'AUTHPATH',
    },
    children: [
      {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full',
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./views/authentication/authentication.module').then((m) => m.AuthenticationModule),
      },
    ],
  },
  {
    path: '',
    component: PrivateAdminComponent,
    canActivate: [AuthenticationGuard],
    data: {
      discriminantPathKey: 'ADMINPATH',
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./views/dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'general',
        loadChildren: () => import('./views/general/general.module').then((m) => m.GeneralModule),
      },
    ],
  },
];
