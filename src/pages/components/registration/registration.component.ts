import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../app/providers/user/auth.service';
import { appConfig } from '../../../app/app.config';
import { ReCaptcha2Component } from 'ngx-captcha';
import { AuthProvider } from '../../../app/providers/auth.provider';
import { SocialAuthService, GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { AuthSignInFormType } from '../login/login.component';
import { NotificationService } from 'src/app/providers/user/notification.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class RegistrationComponent implements OnInit {
  public disablePasswordField = false;

  public registerForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(4)]),
    agree: new FormControl('', [Validators.requiredTrue]),
    recaptcha: new FormControl('', [Validators.required]),
    socialMediaIdToken: new FormControl, // needed for google
    socialMediaAuthToken: new FormControl, // needed for facebook
    socialMediaCompany: new FormControl
  });

  @ViewChild('captchaElem', { static: false }) captchaElem: ReCaptcha2Component;
  private defaultButtonText = 'Sign up!';

  constructor(private auth: AuthService,
    private authProvider: AuthProvider,
    private socialMediaAuthService: SocialAuthService,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.socialMediaAuthService.authState.subscribe(user => {
      if (user.email && user.email.length > 0) {
        this.disablePasswordField = true;
        this.registerForm.get('email').setValue(user.email);
        this.registerForm.get('password').setValue('     '); // TODO

        this.registerForm.get('socialMediaIdToken').setValue(user.idToken);
        this.registerForm.get('socialMediaAuthToken').setValue(user.authToken);
        this.register(AuthSignInFormType.SocialMediaLogin);
      } else {
        this.notificationService.notifierMessage('error',
          'Selected social media account doesn\'t have an associated email.');
        this.disablePasswordField = false;
      }
    });
  }

  private _date: Date = new Date();

  get date(): Date {
    return this._date;
  }

  set date(value: Date) {
    this._date = value;
  }

  private _buttonText = this.defaultButtonText;

  get buttonText(): string {
    return this._buttonText;
  }

  private _settings = {
    bigBanner: true,
    timePicker: false,
    format: 'dd-MM-yyyy',
    defaultOpen: false
  };

  get settings(): { bigBanner: boolean; timePicker: boolean; format: string; defaultOpen: boolean } {
    return this._settings;
  }

  set settings(value: { bigBanner: boolean; timePicker: boolean; format: string; defaultOpen: boolean }) {
    this._settings = value;
  }

  private _captchaKey = appConfig.captcha;

  get captchaKey(): string {
    return this._captchaKey;
  }

  get loggedIn() {
    return this.authProvider.user && this.authProvider.user.id;
  }

  public register(authType: AuthSignInFormType = AuthSignInFormType.RegularLogin) {
    this.auth.formGroup = this.registerForm;
    this._buttonText = 'Processing...';
    this.auth.register(authType).then(r => {
      this._buttonText = this.defaultButtonText;
    }).catch(() => {
      this._buttonText = this.defaultButtonText;
    });
    setTimeout(() => {
      this.captchaElem.resetCaptcha();
    }, 2000);
  }

  public handleReset() {
    this.registerForm.controls['recaptcha'].reset();
  }

  public handleExpire() {
    this.registerForm.controls['recaptcha'].reset();
  }

  public handleSuccess(event) {
    this.registerForm.controls['recaptcha'].setValue(event);
  }

  public handleLoad() {
    this.registerForm.controls['recaptcha'].reset();
  }

  registerWithGoogle(): void {
    this.registerForm.get('socialMediaCompany').setValue('Google');
    this.socialMediaAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  registerWithFacebook(): void {
    this.registerForm.get('socialMediaCompany').setValue('Facebook');
    this.socialMediaAuthService.signIn(FacebookLoginProvider.PROVIDER_ID)
  }

}
