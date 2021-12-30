import {
  Component,
  OnInit,
  OnChanges,
  OnDestroy,
  AfterViewInit,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil, filter, map } from 'rxjs/operators';
import { HttpEventType } from '@angular/common/http';
import { environment } from 'src/environments/environment';

// MODEL
import { Pagination, InvitationData, InvitationGuestBookData } from '@models';

// SERVICE
import { GlobalService } from '@services/private';
import { FunctionService, HttpService, WhatsappService, InvitationService } from '@services';

// STORE
import { selectInvitation } from '@store/invitation/invitation.selectors';

import {
  selectAllInvitationGuestBook,
  selectIsLoadingList as selectIsLoadingListInvitationGuestBook,
  selectIsLoadingUpdate as selectIsLoadingUpdateInvitationGuestBook,
  selectIsLoadingDelete as selectIsLoadingDeleteInvitationGuestBook,
  selectError as selectErrorInvitationGuestBook,
  selectPagination as selectPaginationInvitationGuestBook,
} from '@store/invitation-guest-book/invitation-guest-book.selectors';
import { fromInvitationGuestBookActions } from '@store/invitation-guest-book/invitation-guest-book.actions';

// COMPONENT
import { ModalImportGuestBookComponent } from '@components/modal/import-guest-book/import-guest-book.component';
import { ModalDownloadGuestBookQRCodeComponent } from '@components/modal/download-guest-book-qr-code/download-guest-book-qr-code.component';
import { ModalProgressComponent } from '@components/modal/progress/progress.component';

// PACKAGE
import { isEmpty, isEqual, assign, isArray } from 'lodash';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { Store, select } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { saveAs } from 'file-saver';
import { faSearchPlus, faPlus, faPen, faTrash, faEllipsisH } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'kb-invitation-guest-book-page',
  templateUrl: './invitation-guest-book-page.component.html',
  styleUrls: ['./invitation-guest-book-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitationGuestBookPageComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  faSearchPlus = faSearchPlus;
  faPlus = faPlus;
  faPen = faPen;
  faTrash = faTrash;
  faEllipsisH = faEllipsisH;

  env: any = environment;
  moment: any = moment;

  @ViewChild(ModalImportGuestBookComponent)
  modalImportGuestBookComponent!: ModalImportGuestBookComponent;
  @ViewChild(ModalDownloadGuestBookQRCodeComponent)
  modalDownloadGuestBookQRCodeComponent!: ModalDownloadGuestBookQRCodeComponent;
  @ViewChild(ModalProgressComponent) modalProgressComponent!: ModalProgressComponent;

  // Settings
  title!: string;
  label!: string;
  description!: string;
  breadcrumb: any[] = [
    { label: 'Undangan', link: '/invitation' },
    { label: 'Undangan ', link: '/invitation/invitation' },
    { label: 'Buku Tamu ', link: '/invitation/invitation/guest-book/id' },
  ];
  totalColumn = new Array(7);

  // Variable
  idInvitation!: string;

  perPageItems = [
    { value: 10, label: '10' },
    { value: 25, label: '25' },
  ];
  pageItems: any[] = [];

  filter = {
    sort: '',
    direction: '',
    perPage: 10,
    currentPage: 1,
    search: '',
    confirmation: [],
    type: [],
    status_is_send: [],
    status_is_checkin: [],
    status_is_active: [],
  };

  // Data
  invitationData!: InvitationData | undefined;
  invitationData$!: Observable<InvitationData | undefined>;

  invitationGuestBookData$!: Observable<InvitationGuestBookData[]>;
  invitationGuestBookIsLoadingList$!: Observable<boolean>;
  invitationGuestBookIsLoadingUpdate$!: Observable<boolean>;
  invitationGuestBookIsLoadingDelete$!: Observable<boolean>;
  invitationGuestBookIsError$!: Observable<boolean>;
  invitationGuestBookIsError = false;
  invitationGuestBookErrorMessage!: string;
  invitationGuestBookPagination$!: Observable<Pagination>;
  invitationGuestBookPages: any;

  downloadQRCodeIsLoading = false;
  downloadQRCodeName!: string;
  downloadQRCodeProgress = 0;

  sendLoading = false;

  confirmationData = [
    { value: 'notyet', label: 'Belum', checked: false },
    { value: 'yes', label: 'Hadir', checked: false },
    { value: 'no', label: 'Tidak Hadir', checked: false },
  ];
  typeData = [
    { value: 'biasa', label: 'Biasa', checked: false },
    { value: 'vip', label: 'VIP', checked: false },
  ];
  statusSendData = [
    { value: true, label: 'Sudah', checked: false },
    { value: false, label: 'Belum', checked: false },
  ];
  statusCheckinData = [
    { value: true, label: 'Hadir', checked: false },
    { value: false, label: 'Tidak Hadir', checked: false },
  ];
  statusActiveData = [
    { value: true, label: 'Aktif', checked: false },
    { value: false, label: 'Arsip', checked: false },
  ];

  private unsubscribeInvitation$ = new Subject<void>();
  private unsubscribeInvitationGuestBook$ = new Subject<void>();

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private globalService: GlobalService,
    private functionService: FunctionService,
    private httpService: HttpService,
    private whatsappService: WhatsappService,
    private invitationService: InvitationService,
    private translateService: TranslateService,
    private actions$: Actions,
    private store: Store<any>,
    private toastr: ToastrService
  ) {
    this.settingsAll();

    this.translateService.onLangChange.subscribe((event) => {
      this.settingsAll();
    });

    this.idInvitation = this.route.snapshot.params['id_invitation'];
  }

  settingsAll(): void {
    const word = ['invitation', 'guest-book', 'list'];
    this.translateService.get(word).subscribe((trans) => {
      this.label = `${trans['guest-book']} ${trans['invitation']}`;
      this.description = `${trans.list} ${trans['guest-book']} ${trans['invitation']}`;

      // Title & Description
      this.title = this.globalService.title;
      this.titleService.setTitle(`${this.label} | ${this.title}`);
      this.globalService.changeLabel(this.label);
      this.globalService.changeDescription(this.description);
    });
  }

  ngOnInit(): void {
    this.getInvitation();
    this.getAllInvitationGuestBook();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  ngOnDestroy(): void {
    this.unsubscribeInvitationGuestBook$.next();
    this.unsubscribeInvitationGuestBook$.complete();
  }

  ngAfterViewInit(): void {}

  get checkFilter(): boolean {
    if (this.filter.search) {
      return true;
    }
    return false;
  }

  getInvitation(): void {
    const params = {
      with: [
        { user: true },
        { event: true },
        { event_package: true },
        { theme_category: true },
        { theme: true },
        { theme: true },
        { invitation_feature_data: true },
      ],
    };

    this.invitationService.getSingle(this.idInvitation, params).subscribe((result) => {
      this.invitationData$ = of(result.data);
      this.cdRef.detectChanges();
    });
  }

  getAllInvitationGuestBook(): void {
    const pCurrent =
      Number(this.filter.perPage) * Number(this.filter.currentPage) - Number(this.filter.perPage);

    const pWhere: any[] = [
      {
        id_invitation: this.idInvitation,
      },
      {
        is_delete: false,
      },
      {
        from: 'admin',
      },
    ];

    if (this.filter.confirmation) {
      pWhere.push({
        confirmation: this.filter.confirmation,
      });
    }

    if (this.filter.type) {
      pWhere.push({
        type: this.filter.type,
      });
    }

    if (this.filter.status_is_send) {
      pWhere.push({
        is_send: this.filter.status_is_send,
      });
    }

    if (this.filter.status_is_checkin) {
      pWhere.push({
        is_checkin: this.filter.status_is_checkin,
      });
    }

    if (this.filter.status_is_active) {
      pWhere.push({
        is_active: this.filter.status_is_active,
      });
    }

    const params = {
      search: this.filter.search,
      limit: this.filter.perPage,
      start: pCurrent,
      where: pWhere,
    };

    if (this.filter.sort) {
      assign(params, { sort: `${this.filter.sort}:${this.filter.direction}` });
    } else {
      assign(params, { sort: 'modified_at:desc' });
    }

    this.store.dispatch(
      fromInvitationGuestBookActions.loadAllInvitationGuestBook({
        params,
        pagination: true,
        infinite: false,
      })
    );

    this.store
      .pipe(
        select(selectErrorInvitationGuestBook),
        filter((val) => val !== null && val.error)
      )
      .subscribe((result) => {
        if (result.error) {
          this.toastr.error(result.message, 'Invitation Guest Book');
        }
      });

    this.invitationGuestBookIsLoadingList$ = this.store.pipe(select(selectIsLoadingListInvitationGuestBook));
    this.invitationGuestBookPagination$ = this.store.pipe(select(selectPaginationInvitationGuestBook));

    this.invitationGuestBookData$ = this.store.pipe(
      select(selectAllInvitationGuestBook),
      map((data: InvitationGuestBookData[]) => {
        return data.map((result: any) => new InvitationGuestBookData().deserialize(result));
      })
    );
  }

  filterSort(event: string): void {
    let dir = '';
    if (this.filter.sort === event) {
      if (this.filter.direction === 'desc') {
        dir = 'asc';
      } else if (this.filter.direction === 'asc') {
        dir = 'desc';
      }
    } else {
      dir = 'desc';
    }

    this.filter.sort = event;
    this.filter.direction = dir;
    this.filter.currentPage = 1;
    this.getAllInvitationGuestBook();
  }

  filterSearch(event: string): void {
    const value = isEmpty(event) === false ? event : '';
    if (this.filter.search !== value) {
      this.filter.search = value;
      this.filter.currentPage = 1;
      this.getAllInvitationGuestBook();
    }
  }

  filterPagination(event: any): void {
    const prev = [this.filter.perPage, this.filter.currentPage];
    const curr = [event.perPage, event.currentPage];

    if (isEqual(prev, curr)) {
      return;
    }

    this.filter.perPage = event.perPage;
    this.filter.currentPage = event.currentPage;
    this.getAllInvitationGuestBook();
  }

  filterConfirmation(event: any): void {
    this.filter.confirmation = event;
    this.filter.currentPage = 1;
    this.getAllInvitationGuestBook();
  }

  filterType(event: any): void {
    this.filter.type = event;
    this.filter.currentPage = 1;
    this.getAllInvitationGuestBook();
  }

  filterStatusSend(event: any): void {
    this.filter.status_is_send = event;
    this.filter.currentPage = 1;
    this.getAllInvitationGuestBook();
  }

  filterStatusCheckin(event: any): void {
    this.filter.status_is_checkin = event;
    this.filter.currentPage = 1;
    this.getAllInvitationGuestBook();
  }

  filterStatusActive(event: any): void {
    this.filter.status_is_active = event;
    this.filter.currentPage = 1;
    this.getAllInvitationGuestBook();
  }

  onDelete(id: string | undefined, isDelete: boolean = true): void {
    const bodyInvitationGuestBook = {
      id_invitation_guest_book: id,
      is_delete: isDelete,
    };

    this.invitationGuestBookIsLoadingDelete$ = this.store.pipe(
      select(selectIsLoadingDeleteInvitationGuestBook)
    );

    this.store.dispatch(
      fromInvitationGuestBookActions.deleteInvitationGuestBook({
        delete: bodyInvitationGuestBook,
      })
    );

    this.actions$
      .pipe(
        ofType(fromInvitationGuestBookActions.deleteInvitationGuestBookSuccess),
        takeUntil(this.unsubscribeInvitationGuestBook$)
      )
      .subscribe((result) => {
        const text = result.data.is_delete ? 'dihapus' : 'dipulihkan';

        Swal.fire({
          icon: 'success',
          text: `Buku Tamu ${result.data.name} berhasil ${text}.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.filter.currentPage = 1;
          this.getAllInvitationGuestBook();
        });
      });

    this.actions$
      .pipe(
        ofType(fromInvitationGuestBookActions.deleteInvitationGuestBookFailure),
        takeUntil(this.unsubscribeInvitationGuestBook$)
      )
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'Invitation Guest Book');
      });
  }

  openModalImportGuestBookComponent(): void {
    this.modalImportGuestBookComponent.openModal();
  }

  openModalDownloadGuestBookQRCode(): void {
    this.modalDownloadGuestBookQRCodeComponent.openModal();
  }

  onDownloadQRCode(event: any): void {
    this.downloadQRCodeProgress = 0;
    this.modalDownloadGuestBookQRCodeComponent.closeModal();
    this.modalProgressComponent.openModal();

    const pWhere: any[] = [
      {
        id_invitation: this.idInvitation,
      },
      {
        is_delete: false,
      },
    ];

    if (event.noTelp) {
      pWhere.push({
        no_telp__null: !event.noTelp,
      });
    }

    const params = {
      download: 'pdf-qrcode',
      size: event.size,
      where: pWhere,
    };

    this.httpService
      .getFile('api-core/v1/invitation-guest-book/download', params)
      .subscribe(async (response) => {
        if (response.type === HttpEventType.DownloadProgress) {
          this.downloadQRCodeIsLoading = true;
          this.downloadQRCodeProgress = Math.round((100 * response.loaded) / response.total);
          this.cdRef.markForCheck();
        } else if (response.type === HttpEventType.Response) {
          await this.functionService.delay(1000);
          this.modalProgressComponent.closeModal();
          this.downloadQRCodeIsLoading = false;

          const newBlob = new Blob([response.body], { type: 'application/pdf' });

          await this.functionService.delay(1000);
          saveAs(newBlob, `qr-code.pdf`);

          Swal.fire({
            icon: 'success',
            title: 'Unduh',
            text: 'Unduh QR Code berhasil.',
            allowOutsideClick: false,
            confirmButtonColor: '#069550',
          });
        }
      });
  }

  onUpdateSend(id: string | undefined, isSend: boolean = true): void {
    const bodyInvitationGuestBook = {
      id_invitation_guest_book: id,
      is_send: isSend,
    };

    this.invitationGuestBookIsLoadingUpdate$ = this.store.pipe(
      select(selectIsLoadingUpdateInvitationGuestBook)
    );

    this.store.dispatch(
      fromInvitationGuestBookActions.updateInvitationGuestBook({
        update: bodyInvitationGuestBook,
      })
    );

    this.actions$
      .pipe(
        ofType(fromInvitationGuestBookActions.updateInvitationGuestBookSuccess),
        takeUntil(this.unsubscribeInvitationGuestBook$)
      )
      .subscribe((result) => {
        Swal.fire({
          icon: 'success',
          text: `Undangan berhasil terkirim kepada ${result.data.name}.`,
          allowOutsideClick: false,
          confirmButtonColor: '#069550',
        }).then(() => {
          this.filter.currentPage = 1;
          this.getAllInvitationGuestBook();
        });
      });

    this.actions$
      .pipe(
        ofType(fromInvitationGuestBookActions.updateInvitationGuestBookFailure),
        takeUntil(this.unsubscribeInvitationGuestBook$)
      )
      .subscribe((result) => {
        this.toastr.error(result.error.message, 'Invitation Guest Book');
      });
  }

  onSend(invitation: any, guestBook: InvitationGuestBookData): void {
    const url = environment.production
      ? 'https://invitation.kitabikin.com/'
      : 'https://invitation-dev.kitabikin.com/';
    const link = `${url}${invitation.event.code}/${invitation.code}?to=${guestBook.name}`;

    const feature = this.modifyData(invitation);
    const message = this.getMessage(invitation, feature, link);

    const bodyInvitationGuestBook = {
      number: guestBook.no_telp,
      message: message,
    };

    this.sendLoading = true;
    this.whatsappService.sendInvitation(bodyInvitationGuestBook).subscribe((result) => {
      this.sendLoading = false;
      this.onUpdateSend(guestBook.id_invitation_guest_book);
    });
  }

  modifyData(invitation: any): any {
    let modify = invitation;

    const feature = modify.feature.map(({ is_active, theme_feature, column }: any) => {
      column = column.map(({ is_active, theme_feature_column, value }: any) => {
        return { is_active, ...theme_feature_column, value };
      });
      return { is_active, ...theme_feature, column };
    });

    modify = { ...modify, feature };

    return modify.feature.reduce((obj: any, item: any) => Object.assign(obj, { [item.code]: item }), {});
  }

  getMessage(invitation: any, feature: any, link: string): any {
    let message = '';

    if (invitation.event.code === 'wedding') {
      switch (invitation.theme.code) {
        case 'golden-gold':
          console.log('golden-gold');
          break;
        case 'nashville':
          message = this.getMessageThemeNashville(feature, link);
          break;
        case 'savannah':
          console.log('savannah');
          break;
        default:
          break;
      }
    }

    return message;
  }

  getMessageThemeNashville(feature: any, link: string): any {
    const code = 'nashville';

    // Sampul
    const codeSampul = `${code}-sampul`;
    const sampul = feature[codeSampul].column.reduce(
      (obj: any, item: any) => Object.assign(obj, { [item.code]: item }),
      {}
    );
    const {
      [`${codeSampul}-nicknameBridge`]: sampulNicknameBride,
      [`${codeSampul}-nicknameGroom`]: sampulNicknameGroom,
    } = sampul;

    // Pembukaan
    const codePembukaan = `${code}-pembukaan`;
    const pembukaan = feature[codePembukaan].column.reduce(
      (obj: any, item: any) => Object.assign(obj, { [item.code]: item }),
      {}
    );
    const {
      [`${codePembukaan}-brideFullname`]: pembukaanBrideFullname,
      [`${codePembukaan}-groomFullname`]: pembukaanGroomFullname,
    } = pembukaan;

    // Detail Resepsi
    const codeDetailResepsi = `${code}-detailResepsi`;
    const detailResepsi = feature[codeDetailResepsi].column.reduce(
      (obj: any, item: any) => Object.assign(obj, { [item.code]: item }),
      {}
    );
    const {
      [`${codeDetailResepsi}-date`]: detailResepsiDate,
      [`${codeDetailResepsi}-time`]: detailResepsiTime,
      [`${codeDetailResepsi}-location`]: detailResepsiLocation,
      [`${codeDetailResepsi}-address`]: detailResepsiAddress,
    } = detailResepsi;

    let time = '';
    if (JSON.parse(detailResepsiTime.value).length > 1) {
      JSON.parse(detailResepsiTime.value).map((res: any, i: number) => {
        if (i === 0) {
          time += `Resepsi : ${res.time} (Sesi ${i + 1})\n`;
        } else {
          time += `                ${res.time} (Sesi ${i + 1})\n`;
        }
      });
    } else {
      time = `Resepsi  : ${JSON.parse(detailResepsiTime.value)[0].time}\n`;
    }

    let message = `Bismillahirrahmanirrahim,\n\n`;
    message += `Turut mengundang teman-teman, sahabat, dan keluarga untuk hadir dalam acara pernikahan Kami:\n`;
    message += `${pembukaanBrideFullname.value}\n     &     \n${pembukaanGroomFullname.value}\n\n`;
    message += `Yang akan diselenggarakan pada:\n`;
    message += `Hari        : ${moment(detailResepsiDate.value).locale('id').format('dddd, DD MMMM YYYY')}\n`;
    message += time;
    message += `Tempat  : ${detailResepsiLocation.value}\n`;
    message += `${detailResepsiAddress.value}\n\n`;
    message += `Kehadiran dan doa restu dari keluarga, sahabat, dan teman-teman akan semakin melengkapi hari kebahagiaan kami\n\n`;
    message += `Mohon mengisi reservasi undangan online dibawah ini dan menunjukan QR Barcode di meja penerima tamu:\n\n`;
    message += `${link}\n\n`;
    message += `Kami yang berbahagia,\n`;
    message += `${sampulNicknameBride.value} & ${sampulNicknameGroom.value}\n\n`;
    message += `**WHATSAPP OTOMATIS TIDAK UNTUK DI BALAS**`;

    return message;
  }
}
