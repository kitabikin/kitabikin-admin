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
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
// import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

// PIPE
// import { SafeHtmlPipe, SafeUrlPipe } from '@pipes';

// COMPONENT NG-BOOTSTRAP
import {
  NgbProgressbarModule,
  NgbTooltipModule,
  NgbModalModule,
  NgbDatepickerModule,
  NgbDropdownModule,
} from '@ng-bootstrap/ng-bootstrap';

// COMPONENT
// import { AvatarComponent as CompAvatarComponent } from '@components/_components/avatar/avatar.component';
// import { AvatarItemComponent as CompAvatarItemComponent } from '@components/_components/avatar-item/avatar-item.component';
// import { FormInputComponent as CompInputComponent } from '@components/_components/form-input/form-input.component';
// import { BreadcrumbComponent as CompBreadcrumbComponent } from '@components/_components/breadcrumb/breadcrumb.component';
// import { IconComponent as CompIconComponent } from '@components/_components/icon/icon.component';
import { LabelComponent as CompLabelComponent } from '@components/_components/label/label.component';
// import { FormFileUploaderComponent as CompFormFileUploaderComponent } from '@components/_components/form/file-uploader/file-uploader.component';
// import { TableHeadComponent as CompTableHeadComponent } from '@components/_components/table-head/table-head.component';

// import { PageComponent as HeaderPageComponent } from '@components/header/page/page.component';
// import { PaginationComponent } from '@components/pagination/pagination.component';
// import { FormUserAddEditComponent } from '@components/form/user/add-edit/add-edit.component';
// import { FormTopicAddEditComponent } from '@components/form/topic/add-edit/add-edit.component';
// import { FormOrganizationAddEditComponent } from '@components/form/organization/add-edit/add-edit.component';
// import { FormUnitAddEditComponent } from '@components/form/unit/add-edit/add-edit.component';
// import { FormAgreementAddEditComponent } from '@components/form/agreement/add-edit/add-edit.component';
// import { FormArticleAddEditComponent } from '@components/form/article/add-edit/add-edit.component';
// import { FormHighlightAddEditComponent } from './components/form/highlight/add-edit/add-edit.component';
import { FormAuthenticationLoginComponent } from '@components/form/authentication/login/login.component';
// import { FormMapsetAddEditComponent } from '@components/form/mapset/add-edit/add-edit.component';
// import { ModalDownloadRequestDatasetComponent } from '@components/modal/download-request-dataset/download-request-dataset.component';
// import { ModalProgressComponent } from '@components/modal/progress/progress.component';

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
    SweetAlert2Module.forRoot(),
    // CKEditorModule,
  ],
  declarations: [
    // PIPE
    // SafeHtmlPipe,
    // SafeUrlPipe,
    // COMPONENT
    // CompAvatarComponent,
    // CompAvatarItemComponent,
    // CompInputComponent,
    // CompBreadcrumbComponent,
    // CompIconComponent,
    CompLabelComponent,
    // CompFormFileUploaderComponent,
    // CompTableHeadComponent,
    // HeaderPageComponent,
    // PaginationComponent,
    // FormUserAddEditComponent,
    // FormTopicAddEditComponent,
    // FormArticleAddEditComponent,
    // FormHighlightAddEditComponent,
    // FormOrganizationAddEditComponent,
    // FormUnitAddEditComponent,
    // FormAgreementAddEditComponent,
    FormAuthenticationLoginComponent,
    // FormMapsetAddEditComponent,
    // ModalDownloadRequestDatasetComponent,
    // ModalProgressComponent,
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
    SweetAlert2Module,
    // CKEditorModule,
    // PIPE
    // SafeHtmlPipe,
    // SafeUrlPipe,
    // COMPONENT NG-BOOTSTRAP
    NgbProgressbarModule,
    NgbTooltipModule,
    NgbModalModule,
    NgbDatepickerModule,
    NgbDropdownModule,
    // COMPONENT
    // CompAvatarComponent,
    // CompAvatarItemComponent,
    // CompBreadcrumbComponent,
    // CompIconComponent,
    CompLabelComponent,
    // CompFormFileUploaderComponent,
    // CompTableHeadComponent,
    // HeaderPageComponent,
    // PaginationComponent,
    // FormUserAddEditComponent,
    // FormTopicAddEditComponent,
    // FormArticleAddEditComponent,
    // FormHighlightAddEditComponent,
    // FormOrganizationAddEditComponent,
    // FormUnitAddEditComponent,
    // FormAgreementAddEditComponent,
    FormAuthenticationLoginComponent,
    // FormMapsetAddEditComponent,
    // ModalDownloadRequestDatasetComponent,
    // ModalProgressComponent,
  ],
  providers: [],
  schemas: [],
})
export class SharedModule {}
