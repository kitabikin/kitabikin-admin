import { Component, Output, ChangeDetectionStrategy, ViewChild, EventEmitter } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'kb-modal-download-guest-book-qr-code',
  templateUrl: './download-guest-book-qr-code.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalDownloadGuestBookQRCodeComponent {
  @ViewChild('modalDownloadGuestBookQRCode') modalDownloadGuestBookQRCode: any;

  // Output
  @Output() dataOutput = new EventEmitter<any>();

  // Variable
  private modalRef!: NgbModalRef;

  size = 170;
  noTelp!: string;
  noTelpData = [
    { value: true, label: 'Ada No. Telepon' },
    { value: false, label: 'Tidak Ada No. Telepon' },
  ];

  constructor(private modalService: NgbModal) {}

  openModal(): void {
    this.modalRef = this.modalService.open(this.modalDownloadGuestBookQRCode);
  }

  closeModal(): void {
    this.modalRef.close();
  }

  onDownload(): void {
    this.dataOutput.emit({
      size: this.size,
      noTelp: this.noTelp,
    });
  }
}
