import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { concat, Observable } from 'rxjs';
import { first, map, skip, take, tap } from 'rxjs/operators';

// MODEL
import { EventPackageData } from '@models';

// PLUGIN
import { Store } from '@ngrx/store';

// STORE
import { selectEventPackage } from '@store/event-package/event-package.selectors';
import { fromEventPackageActions } from '@store/event-package/event-package.actions';

@Injectable({ providedIn: 'root' })
export class StoreEventPackageDetailGuard implements CanActivate {
  // Variable
  id!: string;

  constructor(private router: Router, private store: Store<any>) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.id = route.params['id'];

    return concat(this.loadIfRequired(), this.hasDataInStore()).pipe(skip(1));
  }

  private get state$(): Observable<EventPackageData | undefined> {
    return this.store.select(selectEventPackage(this.id));
  }

  private loadIfRequired(): Observable<any> {
    return this.state$.pipe(
      map((state) => state !== undefined),
      take(1),
      tap((load) => {
        if (!load) {
          const params = {
            with: [{ event: true }],
          };

          this.store.dispatch(
            fromEventPackageActions.loadEventPackage({
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
