import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { concat, Observable } from 'rxjs';
import { first, map, skip, take, tap } from 'rxjs/operators';

// MODEL
import { InvitationData } from '@models';

// PLUGIN
import { Store } from '@ngrx/store';

// STORE
import { selectInvitation } from '@store/invitation/invitation.selectors';
import { fromInvitationActions } from '@store/invitation/invitation.actions';

@Injectable({ providedIn: 'root' })
export class StoreInvitationDetailGuard implements CanActivate {
  // Variable
  id!: string;

  constructor(private router: Router, private store: Store<any>) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    this.id = route.params['id_invitation'];

    return concat(this.loadIfRequired(), this.hasDataInStore()).pipe(skip(1));
  }

  private get state$(): Observable<InvitationData | undefined> {
    return this.store.select(selectInvitation(this.id));
  }

  private loadIfRequired(): Observable<any> {
    return this.state$.pipe(
      map((state) => state !== undefined),
      take(1),
      tap((load) => {
        if (!load) {
          const params = {
            with: [
              { user: true },
              { event: true },
              { event_package: true },
              { theme_category: true },
              { theme: true },
              { invitation_feature_data: true },
            ],
          };

          this.store.dispatch(
            fromInvitationActions.loadInvitation({
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
