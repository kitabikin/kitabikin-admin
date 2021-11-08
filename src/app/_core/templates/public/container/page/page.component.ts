import { Component } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// SERVICE
import { GlobalService } from '@services';

@Component({
  selector: 'app-public-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent {
  toggle!: boolean;
  toggleEmitter$ = new BehaviorSubject<boolean>(this.toggle);

  constructor(private globalService: GlobalService) {
    this.globalService.currentToggleSidebar.subscribe((current) => {
      this.toggle = current;
      this.toggleEmitter$.next(current);
    });
  }
}
