import {NgModule} from '@angular/core';
import {HelpComponent} from './Help/help.component';
import {PrivacyComponent} from './Privacy/privacy.component';
import {IncludeComponentModule} from '../components/include.component.module';
import {RouterModule, Routes} from '@angular/router';
import {TermsArticleComponent} from './Terms/terms.component';
import {FaqArticleComponent} from './faq/faq.component';
import {ArticleComponent} from "./article.component";
import {CommonModule} from "@angular/common";
import {ContactUsComponent} from "./contact-us/contact-us.component";

const routes: Routes = [
    {
        path: '',
        component: ArticleComponent,
        children: [
            {
                path: 'privacy',
                component: PrivacyComponent
            }, {
                path: 'help',
                component: HelpComponent
            }, {
                path: 'terms',
                component: TermsArticleComponent
            }, {
                path: 'faq',
                component: FaqArticleComponent
            }, {
                path: 'contact',
                component: ContactUsComponent
            }
        ]
    }];

@NgModule({
    declarations: [ArticleComponent, HelpComponent, PrivacyComponent, TermsArticleComponent, FaqArticleComponent, ContactUsComponent],
    imports: [IncludeComponentModule, RouterModule.forChild(routes), CommonModule],
    exports: []
})


export class ArticleModule {

}
