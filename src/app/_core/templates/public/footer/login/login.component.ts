import { Component, ChangeDetectionStrategy } from '@angular/core';

// PACKAGE
import moment from 'moment';

@Component({
  selector: 'kb-public-footer-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  moment: any = moment;
}
