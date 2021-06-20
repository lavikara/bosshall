import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {appConfig} from '../../../app/app.config';
import {ReCaptcha2Component} from 'ngx-captcha';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../app/providers/user/auth.service';
import {Subscription} from 'rxjs/index';

@Component({
    selector: 'app-forgotpass-component',
    templateUrl: 'forgotpassword.html'
})

export class ForgotpasswordComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('captchaElem', {static: false}) captchaElem: ReCaptcha2Component;
    public forgotPasswordForm = new FormGroup({
        token: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required, Validators.minLength(4)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(4)]),
        recaptcha: new FormControl('', [Validators.required]),
        match: new FormControl('', [Validators.requiredTrue])
    });
    private _defaultButtonText = 'Change password';
    private formSub: Subscription;
    private token: string;

    constructor(private activatedRoute: ActivatedRoute, private router: Router, private authService: AuthService) {

    }

    private _buttonText = this._defaultButtonText;

    get buttonText(): string {
        return this._buttonText;
    }

    private _captchaKey = appConfig.captcha;

    get captchaKey(): string {
        return this._captchaKey;
    }

    ngOnInit() {
        this.token = this.activatedRoute.snapshot.queryParamMap.get('t');
        if (!this.token) {
            this.router.navigate(['/']);
        }

    }

    ngAfterViewInit() {
        this.forgotPasswordForm.controls['token'].setValue(this.token);
        this.formSub = this.forgotPasswordForm.valueChanges.subscribe(r => {
            if (this.forgotPasswordForm.controls['password'].value === this.forgotPasswordForm.controls['confirmPassword'].value) {
                this.forgotPasswordForm.controls['match'].setValue(true);
            } else {
                this.forgotPasswordForm.controls['match'].setValue(false);

            }
        });
    }

    public forgotPassword() {
        this.authService.formGroup = this.forgotPasswordForm;
        this._buttonText = 'Processing...';
        this.authService.changePassword().then(r => {
            this._buttonText = this._defaultButtonText;
        }).catch(() => {
            this._buttonText = this._defaultButtonText;
        });
        setTimeout(() => {
            this.forgotPasswordForm.controls['password'].reset();
            this.forgotPasswordForm.controls['confirmPassword'].reset();
            this.captchaElem.resetCaptcha();
            this.handleReset();
        }, 2000);
    }

    public handleReset() {
        this.forgotPasswordForm.controls['recaptcha'].reset();
    }

    public handleExpire() {
        this.forgotPasswordForm.controls['recaptcha'].reset();
    }

    public handleSuccess(event) {
        this.forgotPasswordForm.controls['recaptcha'].setValue(event);
    }

    public handleLoad() {
        this.forgotPasswordForm.controls['recaptcha'].reset();


    }

    ngOnDestroy() {
        this.formSub.unsubscribe();
    }
}
