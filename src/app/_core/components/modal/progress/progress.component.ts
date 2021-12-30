import { Component, Input, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { ProgressStore } from '@components/modal/progress/progress.store';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'kb-modal-progress',
  templateUrl: './progress.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProgressStore],
})
export class ModalProgressComponent {
  @ViewChild('modalProgress') modalProgress: any;

  // Input
  @Input() set title(value: string) {
    this.progressStore.setTitle(value);
  }
  @Input() set label(value: string) {
    this.progressStore.setLabel(value);
  }
  @Input() set progress(value: number) {
    this.progressStore.setProgress(value);
  }

  // Variable
  private modalRef!: NgbModalRef;

  readonly vm$ = this.progressStore.vm$;

  constructor(private readonly progressStore: ProgressStore, private modalService: NgbModal) {}

  openModal(): void {
    this.modalRef = this.modalService.open(this.modalProgress, {
      centered: true,
      backdrop: 'static',
    });
  }

  closeModal(): void {
    this.modalRef.close();
  }
}
