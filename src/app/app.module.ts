import { NgModule, Inject, LOCALE_ID, PLATFORM_ID, APP_ID, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../environments/environment';

// LOCATION
import { registerLocaleData } from '@angular/common';
import localeId from '@angular/common/locales/id';

// STORE
import { NgrxModule } from '@store/ngrx.module';

// SERVICE
import { GlobalService, FunctionService } from '@services';
import {
  GlobalService as PrivateGlobalService,
  SidebarService as PrivateSidebarService,
} from '@services/private';

// INTERCEPTOR
import { TransferStateInterceptor } from '@interceptors';

// MODULE
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from '@core/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// COMPONENT
import { AppComponent } from './app.component';

// COMPONENT (PUBLIC)
import { LoginComponent as PublicLoginComponent } from '@templates/public/container/login/login.component';
import { LoginComponent as PublicNavbarLoginComponent } from '@templates/public/navbar/login/login.component';
import { LoginComponent as PublicFooterLoginComponent } from '@templates/public/footer/login/login.component';

// COMPONENT (PRIVATE)
import { AdminComponent as PrivateAdminComponent } from '@templates/private/container/admin/admin.component';
import { NavbarComponent as PrivateNavbarComponent } from '@templates/private/navbar/navbar.component';
import { MainComponent as PrivateSidebarMainComponent } from '@templates/private/sidebar/main/main.component';

// LOCALIZE
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

// PLUGIN
import { JwtModule } from '@auth0/angular-jwt';

registerLocaleData(localeId);

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, `${environment.locales}assets/locales/`, '.json');
}

export function tokenGetter(): any {
  return localStorage.getItem('admin-token');
}

@NgModule({
  declarations: [
    AppComponent,
    PublicLoginComponent,
    PublicNavbarLoginComponent,
    PublicFooterLoginComponent,
    PrivateAdminComponent,
    PrivateNavbarComponent,
    PrivateSidebarMainComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'kitabikin-admin' }),
    BrowserAnimationsModule,
    BrowserTransferStateModule,
    RouterModule.forRoot(AppRoutingModule, {
      scrollPositionRestoration: 'top',
    }),
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['localhost:4200'],
        disallowedRoutes: ['localhost:4200/api-core/v1/auth/login'],
      },
    }),
    TranslateModule.forRoot({
      defaultLanguage: 'id',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    NgrxModule,
    SharedModule,
    NgbModule,
  ],
  providers: [
    {
      provide: LOCALE_ID,
      useValue: 'id',
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TransferStateInterceptor,
      multi: true,
    },
    Title,
    GlobalService,
    FunctionService,
    PrivateGlobalService,
    PrivateSidebarService,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
  constructor(@Inject(PLATFORM_ID) private platformId: object, @Inject(APP_ID) private appId: string) {
    const platform = isPlatformBrowser(platformId) ? 'in the browser' : 'on the server';
    console.log(`Running ${platform} with appId=${appId}`);
  }
}
