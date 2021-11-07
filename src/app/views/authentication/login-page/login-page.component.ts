import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

// SERVICES
import { AuthenticationService, GlobalService } from '@services';

// PLUGINS
import moment from 'moment';

@Component({
  selector: 'app-authentication-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent implements OnInit {
  satudataToken!: string;
  moment: any = moment;

  // Setting
  title!: string;
  label = 'Login';
  breadcrumb: any[] = [{ label: 'Login', link: '/auth' }];

  // Variable
  isLoading = false;
  submitted = false;
  returnUrl!: string;
  error = '';

  fieldTextType!: boolean;
  isRememberMe = false;
  getDataRememberMe!: string;

  // Form
  loginForm!: FormGroup;

  constructor(
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private globalService: GlobalService,
    private authenticationService: AuthenticationService
  ) {
    if (this.authenticationService.adminUserValue) {
      this.router.navigate(['/dashboard']);
    }
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  ngOnInit(): void {
    this.settingsAll();

    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.maxLength(240)]),
      password: new FormControl('', [Validators.required, Validators.maxLength(240)]),
    });
  }

  settingsAll(): void {
    this.title = this.globalService.title;
    this.titleService.setTitle(this.label + ' | ' + this.title);
    this.globalService.changeLabel(this.label);
    this.globalService.changeBreadcrumb(this.breadcrumb);
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.authenticationService
      .login(
        this.loginForm.controls['username'].value,
        this.loginForm.controls['password'].value,
        this.isRememberMe
      )
      .pipe(first())
      .subscribe({
        next: (result) => {
          if (result.error === 0) {
            this.isLoading = false;
            this.authenticationService.setSession(result.data);
            this.router.navigate([this.returnUrl]);
          } else {
            this.isLoading = false;
            this.error = 'Username dan Kata Sandi tidak ditemukan.';
            this.cdRef.markForCheck();
          }
        },
        error: (error) => {
          this.error = error.message;
          this.isLoading = false;
        },
      });
  }
}
