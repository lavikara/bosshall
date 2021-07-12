import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { appConfig } from '../../../app/app.config';
import { AuthService } from '../../../app/providers/user/auth.service';
import { ReCaptcha2Component } from 'ngx-captcha';
import { ActivatedRoute } from '@angular/router';
import { AuthProvider } from '../../../app/providers/auth.provider';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  loginForm: FormGroup;
  @ViewChild('captchaElem', { static: false }) captchaElem: ReCaptcha2Component;
  private _defaultButtonText = 'Sign In!';
  private token: string;

  constructor(
    private authProvider: AuthProvider,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)]),
      recaptcha: new FormControl('', [Validators.required])
    });
  }

  private _buttonText = this._defaultButtonText;

  get buttonText(): string {
    return this._buttonText;
  }

  private _captchaKey = appConfig.captcha;

  get captchaKey(): string {
    return this._captchaKey;
  }

  get loggedIn() {
    return this.authProvider.user && this.authProvider.user.id;
  }

  ngOnInit() {
    this.token = this.activatedRoute.snapshot.queryParamMap.get('t');
    if (this.token) {
      this.validateRegistration();

    }
  }

  ngAfterViewInit() {

  }

  public login() {
    this.authService.formGroup = this.loginForm;
    this._buttonText = 'Processing...';
    this.authService.login().then(r => {
      this._buttonText = this._defaultButtonText;
    }).catch(() => {
      this._buttonText = this._defaultButtonText;
    });
    setTimeout(() => {
      this.loginForm.reset();
      this.captchaElem.resetCaptcha();

    }, 2000);
  }

  public handleReset() {
    this.loginForm.controls['recaptcha'].reset();
  }

  public handleExpire() {
    this.loginForm.controls['recaptcha'].reset();
  }

  public handleSuccess(event) {
    this.loginForm.controls['recaptcha'].setValue(event);
  }

  public handleLoad() {
    this.loginForm.controls['recaptcha'].reset();
  }

  private validateRegistration() {
    this.authService.formGroup = new FormGroup({
      token: new FormControl(this.token)
    });
    this.authService.registerValidate().then(r => {
      // this.notificationService.message('Account validated successfully','close',()=>{},0);
    }).catch(e => {
      // this.notificationService.message('Account validated successfully','close',()=>{},0);
    });

  }

}
