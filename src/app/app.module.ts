import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent as OlderLoginComponent } from '../pages/Authentication/login/login';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegistrationComponent } from '../pages/Authentication/registration/registration';
import { ConfirmregComponent } from '../pages/Authentication/confirmReg/confirmreg';
import { ConfirmResetComponent } from '../pages/Authentication/confirmReset/confirmReset';
import { SendCodeComponent } from '../pages/Authentication/sendCode/sendcode';
import { ForgotpasswordComponent } from '../pages/Authentication/forgotPassword/forgotpassword';
import { IncludeComponentModule } from '../pages/components/include.component.module';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { ValidatorHelper } from './providers/input.provider/validator.input.provider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MatCheckboxModule,
    MatDialogModule,
    MatGridListModule,
    MatProgressBarModule,
    MatSnackBarModule
} from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxCaptchaModule } from 'ngx-captcha';
import { WebStorageModule } from 'ngx-store';
import { AuthenticatedGuard } from './guard/authenticated.guard';
import { PipeModule } from './pipe/pipe.module';
import { MatMenuModule } from '@angular/material/menu';
import { NotifierModule } from 'angular-notifier';
import { intersectionObserverPreset, LazyLoadImageModule } from 'ng-lazyload-image';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CloudService } from './providers/cloud/cloud.provider';
import { MessageService } from './providers/cloud/message/message.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmojiBackgroundFn } from './providers/emoji-backgroundFn';
import { LandingComponent } from '../pages/landing/landing.component';
import { InlineSvgComponent } from './inline-svg/inline-svg.component';
import { FooterComponent } from '../pages/new-ui/footer/footer.component';
import { NavComponent } from '../pages/components/nav/nav.component';
import { FaqComponent } from '../pages/new-ui/faq/faq.component';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
    GoogleLoginProvider,
    FacebookLoginProvider
} from 'angularx-social-login';
import { PolicyComponent } from 'src/pages/new-ui/policy/policy.component';
import { TermsComponent } from './../pages/new-ui/terms/terms.component';
import { AboutComponent } from '../pages/new-ui/about/about.component';
import { HeroComponent } from '../pages/components/hero/hero.component';
import { LoginComponent } from './../pages/components/login/login.component';

const appRoutes: Routes = [
    {
        path: '', component: AppComponent,
        children: [
            { path: '', component: LandingComponent },
            { path: 'home', component: LandingComponent },
            { path: 'login', component: OlderLoginComponent, data: { title: 'Login - BossHall' } },
            { path: 'register', component: RegistrationComponent, data: { title: 'Register - Bosshall' } },
            { path: 'about', component: AboutComponent },
            { path: 'faq', component: FaqComponent },
            { path: 'terms', component: TermsComponent },
            { path: 'policy', component: PolicyComponent },
            {
                path: 'rConfirmation',
                component: ConfirmregComponent,
                data: { title: 'Thank you for registering with us! - Bosshall' }
            },
            {
                path: 'fConfirmation',
                component: ConfirmResetComponent,
                data: { title: 'Verification code sent to Email - Bosshall' }
            },
            {
                path: 'ResetPassword',
                component: ForgotpasswordComponent,
                data: { title: 'Reset your password - Bosshall' }
            },
            { path: 'SendCode', component: SendCodeComponent, data: { title: 'Send code - Bosshall' } },
            {
                path: 'bl',
                canActivate: [AuthenticatedGuard],
                loadChildren: '../pages/Authenticated/authenticatedComponent.component.module#AuthenticatedComponentModule'
            },
            {
                path: 'article',
                loadChildren: '../pages/Article/article.module#ArticleModule'
            },
            { path: '**', redirectTo: '/login' }
        ]
    }

];

@NgModule({
    declarations: [
        AppComponent,
        OlderLoginComponent,
        LoginComponent,
        RegistrationComponent,
        ConfirmregComponent,
        ConfirmResetComponent,
        SendCodeComponent,
        ForgotpasswordComponent,
        LandingComponent,
        InlineSvgComponent,
        FooterComponent,
        NavComponent,
        AboutComponent,
        FaqComponent,
        TermsComponent,
        PolicyComponent,
        HeroComponent
    ],
    imports: [
        BrowserModule,
        SweetAlert2Module.forRoot({
            buttonsStyling: false,
            customClass: 'modal-content',
            confirmButtonClass: 'btn btn-success',
            cancelButtonClass: 'btn btn-danger'
        }),
        BrowserAnimationsModule,
        MatProgressBarModule,
        IncludeComponentModule,
        ReactiveFormsModule,
        MatGridListModule,
        FlexLayoutModule,
        MatSnackBarModule,
        LayoutModule,
        MatMenuModule,
        MatCheckboxModule,
        NgxCaptchaModule,
        WebStorageModule,
        LazyLoadImageModule.forRoot({
            preset: intersectionObserverPreset
        }),
        FlatpickrModule.forRoot(),
        // AngularDateTimePickerModule,
        PipeModule,
        MatDialogModule,
        NgxSmartModalModule.forRoot(),
        RouterModule.forRoot(appRoutes),
        FormsModule,
        NotifierModule.withConfig(
            {
                position: {
                    horizontal: {
                        position: 'right',
                        distance: 12

                    },
                    vertical: {
                        position: 'top',
                        distance: 12,
                        gap: 10
                    }
                }
            }
        ),
        MatProgressSpinnerModule,
        SocialLoginModule
    ],
    // tslint:disable-next-line:max-line-length
    providers: [
        MessageService,
        EmojiBackgroundFn,
        CloudService,
        ValidatorHelper,
        FormBuilder,
        {
            provide: 'SocialAuthServiceConfig',
            useValue: {
                autoLogin: false,
                providers: [
                    {
                        id: GoogleLoginProvider.PROVIDER_ID,
                        provider: new GoogleLoginProvider(
                            'clientId'
                        )
                    },
                    {
                        id: FacebookLoginProvider.PROVIDER_ID,
                        provider: new FacebookLoginProvider('clientId')
                    }
                ],
                onError: (err) => {
                    console.error(err);
                }
            } as SocialAuthServiceConfig,
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
