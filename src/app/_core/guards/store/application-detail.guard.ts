import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { concat, Observable } from 'rxjs';
import { first, map, skip, take, tap } from 'rxjs/operators';

// MODEL
import { ApplicationData } from '@models';

// PLUGIN
import { Store } from '@ngrx/store';

// STORE
import { selectApplication } from '@store/application/application.selectors';
import { fromApplicationActions } from '@store/application/application.actions';

@Injectable({ providedIn: 'root' })
export class StoreApplicationDetailGuard implements CanActivate {
  // Variable
  id!: string;

  constructor(private router: Router, private store: Store<any>) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.id = route.params['id'];

    return concat(this.loadIfRequired(), this.hasDataInStore()).pipe(skip(1));
  }

  private get state$(): Observable<ApplicationData | undefined> {
    return this.store.select(selectApplication(this.id));
  }

  private loadIfRequired(): Observable<any> {
    return this.state$.pipe(
      map((state) => state !== undefined),
      take(1),
      tap((load) => {
        if (!load) {
          const params = {};

          this.store.dispatch(
            fromApplicationActions.loadApplication({
              id: this.id,
              params,
            })
          );
        }
      })
    );
  }

  private hasDataInStore(): Observable<boolean> {
    return this.state$.pipe(
      first((state) => state !== undefined),
      map((result) => {
        if (!!result) {
          return true;
        }

        this.router.navigate(['/404']);
        return false;
      })
    );
  }
}
