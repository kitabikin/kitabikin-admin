import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { concat, Observable } from 'rxjs';
import { first, map, skip, take, tap } from 'rxjs/operators';

// MODEL
import { ThemeCategoryData } from '@models';

// PLUGIN
import { Store } from '@ngrx/store';

// STORE
import { selectThemeCategory } from '@store/theme-category/theme-category.selectors';
import { fromThemeCategoryActions } from '@store/theme-category/theme-category.actions';

@Injectable({ providedIn: 'root' })
export class StoreThemeCategoryDetailGuard implements CanActivate {
  // Variable
  id!: string;

  constructor(private router: Router, private store: Store<any>) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.id = route.params['id'];

    return concat(this.loadIfRequired(), this.hasDataInStore()).pipe(skip(1));
  }

  private get state$(): Observable<ThemeCategoryData | undefined> {
    return this.store.select(selectThemeCategory(this.id));
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
            fromThemeCategoryActions.loadThemeCategory({
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
