// import { Component, ViewChild } from '@angular/core';
// import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { AuthService } from '../../../app/providers/user/auth.service';
// import { appConfig } from '../../../app/app.config';
// import { ReCaptcha2Component } from 'ngx-captcha';
// import { Title } from '@angular/platform-browser';

// @Component({
//     selector: '#app-sendcode-component',
//     templateUrl: 'sendcode.html'
// })

// export class SendCodeComponent {
//     public sendCodeForm = new FormGroup({
//         recaptcha: new FormControl('', [Validators.required]),
//         email: new FormControl('', [Validators.required, Validators.email])
//     });
//     @ViewChild('captchaElem', { static: false }) captchaElem: ReCaptcha2Component;

//     constructor(private authService: AuthService, private titleService: Title) {
//         titleService.setTitle('Send verifcation code');
//     }

//     ngOnInit(): void {
//         throw new Error('Method not implemented.');
//     }

//     private _defaultButtonText = 'Send Verification';

//     get defaultButtonText(): string {
//         return this._defaultButtonText;
//     }

//     private _buttonText: string = this._defaultButtonText;

//     get buttonText(): string {
//         return this._buttonText;
//     }

//     private _captchaKey = appConfig.captcha;

//     get captchaKey(): string {
//         return this._captchaKey;
//     }

//     public sendCode() {
//         this.authService.formGroup = this.sendCodeForm;
//         this._buttonText = 'Processing...';
//         this.authService.resetPassword().then(r => {
//             this._buttonText = this._defaultButtonText;
//         }).catch(() => {
//             this._buttonText = this._defaultButtonText;
//         });
//         setTimeout(() => {
//             this.sendCodeForm.reset();
//             this.captchaElem.resetCaptcha();
//         }, 2000);
//     }

//     public handleReset() {
//         this.sendCodeForm.controls['recaptcha'].reset();
//     }

//     public handleExpire() {
//         this.sendCodeForm.controls['recaptcha'].reset();
//     }

//     public handleSuccess(event) {
//         this.sendCodeForm.controls['recaptcha'].setValue(event);
//     }

//     public handleLoad() {
//         this.sendCodeForm.controls['recaptcha'].reset();
//     }

// }
