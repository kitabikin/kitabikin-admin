import {
  OnInit,
  Component,
  Input,
  Output,
  ChangeDetectionStrategy,
  ViewChild,
  EventEmitter,
} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';

// STORE
import { selectIsLoadingImport as selectIsLoadingImportInvitationGuestBook } from '@store/invitation-guest-book/invitation-guest-book.selectors';
import { fromInvitationGuestBookActions } from '@store/invitation-guest-book/invitation-guest-book.actions';

// PACKAGE
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { faFileDownload } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'kb-modal-import-guest-book',
  templateUrl: './import-guest-book.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalImportGuestBookComponent implements OnInit {
  faFileDownload = faFileDownload;

  @ViewChild('modalImportGuestBook') modalImportGuestBook: any;

  // Output
  @Input() id: any;
  @Output() reload = new EventEmitter<any>();

  // Variable
  private modalRef!: NgbModalRef;
  myForm!: FormGroup;

  // Data
  invitationGuestBookIsLoadingImport$!: Observable<boolean>;

  constructor(
    private modalService: NgbModal,
    private actions$: Actions,
    private store: Store<any>,
    private toastr: ToastrService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      id_invitation: [this.id],
      file: [null, [Validators.required]],
    });
  }

  openModal(): void {
    this.modalRef = this.modalService.open(this.modalImportGuestBook);
  }

  closeModal(): void {
    this.modalRef.close();
  }

  getFormValidation(control: AbstractControl | undefined): any {
    if (control?.invalid && (control?.dirty || control?.touched)) {
      let text: string | null = null;
      if (control?.errors?.['wrongType']) {
        text = 'Format tidak sesuai.';
      }

      return { invalid: true, text };
    }

    return { invalid: false, text: null };
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.myForm.patchValue({
        file,
      });
    }
  }

  onImport(): void {
    this.modalRef.close();

    const formData = new FormData();
    formData.append('id_invitation', this.myForm.get('id_invitation')?.value);
    formData.append('file', this.myForm.get('file')?.value);

    const bodyInvitationGuestBook = formData;

    this.invitationGuestBookIsLoadingImport$ = this.store.pipe(
      select(selectIsLoadingImportInvitationGuestBook)
    );

    this.store.dispatch(
      fromInvitationGuestBookActions.importInvitationGuestBook({
        import: bodyInvitationGuestBook,
      })
    );

    this.actions$
      .pipe(ofType(fromInvitationGuestBookActions.importInvitationGuestBookSuccess))
      .subscribe((result) => {
        Swal.fire({
          icon: 'success',
          text: `Buku Tamu berhasil ditambahkan.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.reload.emit();
        });
      });

    this.actions$
      .pipe(ofType(fromInvitationGuestBookActions.importInvitationGuestBookFailure))
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'Invitation Guest Book');
      });
  }
}
