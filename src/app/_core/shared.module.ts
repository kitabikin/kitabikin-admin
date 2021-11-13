import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// PACKAGE
import { TranslateModule } from '@ngx-translate/core';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ToastrModule } from 'ngx-toastr';
import { NgxLoadingModule, ngxLoadingAnimationTypes } from 'ngx-loading';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxAbstractControlAsModule } from 'ngx-abstract-control-as';

// PIPE
import { SafeHtmlPipe, SafeUrlPipe } from '@pipes';

// COMPONENT NG-BOOTSTRAP
import {
  NgbProgressbarModule,
  NgbTooltipModule,
  NgbModalModule,
  NgbDatepickerModule,
  NgbDropdownModule,
} from '@ng-bootstrap/ng-bootstrap';

// COMPONENT
import { AvatarComponent as CompAvatarComponent } from '@components/_components/avatar/avatar.component';
import { AvatarItemComponent as CompAvatarItemComponent } from '@components/_components/avatar-item/avatar-item.component';
// import { FormInputComponent as CompInputComponent } from '@components/_components/form-input/form-input.component';
import { BreadcrumbComponent as CompBreadcrumbComponent } from '@components/_components/breadcrumb/breadcrumb.component';
// import { IconComponent as CompIconComponent } from '@components/_components/icon/icon.component';
import { LabelComponent as CompLabelComponent } from '@components/_components/label/label.component';
// import { FormFileUploaderComponent as CompFormFileUploaderComponent } from '@components/_components/form/file-uploader/file-uploader.component';
import { TableHeadComponent as CompTableHeadComponent } from '@components/_components/table-head/table-head.component';
import { PaginationComponent as CompPaginationComponent } from '@components/_components/pagination/pagination.component';

import { FormAuthenticationLoginComponent } from '@components/form/authentication/login/login.component';
import { FormApplicationAddEditComponent } from '@components/form/application/add-edit/add-edit.component';
import { FormRoleAddEditComponent } from '@components/form/role/add-edit/add-edit.component';
import { FormUserAddEditComponent } from '@components/form/user/add-edit/add-edit.component';
import { FormEventAddEditComponent } from '@components/form/event/add-edit/add-edit.component';
import { FormEventPackageAddEditComponent } from '@components/form/event-package/add-edit/add-edit.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    // COMPONENT NG-BOOTSTRAP
    NgbProgressbarModule,
    NgbTooltipModule,
    NgbModalModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    // PACKAGE
    TranslateModule,
    LoadingBarRouterModule,
    NgSelectModule,
    NgxSkeletonLoaderModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-left',
      preventDuplicates: true,
      progressBar: true,
    }),
    NgxLoadingModule.forRoot({
      animationType: ngxLoadingAnimationTypes.wanderingCubes,
      backdropBackgroundColour: 'rgba(0,0,0,0.5)',
      backdropBorderRadius: '4px',
      fullScreenBackdrop: true,
      primaryColour: '#FDCC29',
      secondaryColour: '#289D56',
      tertiaryColour: '#28B8F0',
    }),
    SweetAlert2Module.forRoot(),
    // CKEditorModule,
    FontAwesomeModule,
    NgxAbstractControlAsModule,
  ],
  declarations: [
    // PIPE
    SafeHtmlPipe,
    SafeUrlPipe,
    // COMPONENT
    CompAvatarComponent,
    CompAvatarItemComponent,
    // CompInputComponent,
    CompBreadcrumbComponent,
    // CompIconComponent,
    CompLabelComponent,
    // CompFormFileUploaderComponent,
    CompTableHeadComponent,
    CompPaginationComponent,
    FormAuthenticationLoginComponent,
    FormApplicationAddEditComponent,
    FormRoleAddEditComponent,
    FormUserAddEditComponent,
    FormEventAddEditComponent,
    FormEventPackageAddEditComponent,
  ],
  exports: [
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    // PACKAGE
    TranslateModule,
    LoadingBarRouterModule,
    NgSelectModule,
    NgxSkeletonLoaderModule,
    ToastrModule,
    NgxLoadingModule,
    SweetAlert2Module,
    // CKEditorModule,
    FontAwesomeModule,
    NgxAbstractControlAsModule,
    // PIPE
    SafeHtmlPipe,
    SafeUrlPipe,
    // COMPONENT NG-BOOTSTRAP
    NgbProgressbarModule,
    NgbTooltipModule,
    NgbModalModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    // COMPONENT
    CompAvatarComponent,
    CompAvatarItemComponent,
    // CompInputComponent,
    CompBreadcrumbComponent,
    // CompIconComponent,
    CompLabelComponent,
    // CompFormFileUploaderComponent,
    CompTableHeadComponent,
    CompPaginationComponent,
    FormAuthenticationLoginComponent,
    FormApplicationAddEditComponent,
    FormRoleAddEditComponent,
    FormUserAddEditComponent,
    FormEventAddEditComponent,
    FormEventPackageAddEditComponent,
  ],
  providers: [],
  schemas: [],
})
export class SharedModule {}
