import { NotificationService } from './../../../app/providers/user/notification.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { appConfig } from '../../../app/app.config';
import { AuthService } from '../../../app/providers/user/auth.service';
import { ReCaptcha2Component } from 'ngx-captcha';
import { ActivatedRoute } from '@angular/router';
import { AuthProvider } from '../../../app/providers/auth.provider';
import { SocialAuthService } from "angularx-social-login";
import { FacebookLoginProvider, GoogleLoginProvider } from "angularx-social-login";

export enum AuthSignInFormType {
  RegularLogin,
  SocialMediaLogin
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  public disablePasswordField = false;
  private _defaultButtonText = 'Sign In!';
  private token: string;

  @ViewChild('captchaElem', { static: false }) captchaElem: ReCaptcha2Component;

  constructor(
    private authProvider: AuthProvider,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private socialMediaAuthService: SocialAuthService,
    private notificationService: NotificationService) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.minLength(3)]),
      password: new FormControl('', [Validators.required, Validators.minLength(5)]),
      recaptcha: new FormControl('', [Validators.required]),
      socialMediaIdToken: new FormControl, // needed for google
      socialMediaAuthToken: new FormControl, // needed for facebook
      socialMediaCompany: new FormControl
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

    this.socialMediaAuthService.authState.subscribe(user => {
      if (user.email.length > 0) {
        this.disablePasswordField = true;
        this.loginForm.get('email').setValue(user.email);
        this.loginForm.get('password').setValue('     '); //TODO

        this.loginForm.get('socialMediaIdToken').setValue(user.idToken);
        this.loginForm.get('socialMediaAuthToken').setValue(user.authToken);
        this.login(AuthSignInFormType.SocialMediaLogin);
      } else {
        this.notificationService.notifierMessage('error',
          'Selected social media account is ineligible.');
        this.disablePasswordField = false;
      }
    });
  }

  public login(authType: AuthSignInFormType = AuthSignInFormType.RegularLogin) {
    this.authService.formGroup = this.loginForm;
    this._buttonText = 'Processing...';
    this.authService.login(authType).then(r => {
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

  signInWithGoogle(): void {
    this.loginForm.get('socialMediaCompany').setValue('Google');
    this.socialMediaAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signInWithFacebook(): void {
    this.loginForm.get('socialMediaCompany').setValue('Facebook');
    this.socialMediaAuthService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authProvider.signOut();
  }


}
