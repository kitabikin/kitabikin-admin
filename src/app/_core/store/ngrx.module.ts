import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { handleUndo } from 'ngrx-undo';

import { ApplicationReducer } from '@store/application/application.reducers';
import { ApplicationEffects } from '@store/application/application.effects';

import { RoleReducer } from '@store/role/role.reducers';
import { RoleEffects } from '@store/role/role.effects';

import { UserReducer } from '@store/user/user.reducers';
import { UserEffects } from '@store/user/user.effects';

import { EventReducer } from '@store/event/event.reducers';
import { EventEffects } from '@store/event/event.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot(
      {
        application: ApplicationReducer,
        role: RoleReducer,
        user: UserReducer,
        event: EventReducer,
      },
      {
        metaReducers: [handleUndo],
      }
    ),
    EffectsModule.forRoot([ApplicationEffects, RoleEffects, UserEffects, EventEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
      logOnly: environment.production,
    }),
  ],
  exports: [StoreModule, EffectsModule, StoreDevtoolsModule],
})
export class NgrxModule {}
