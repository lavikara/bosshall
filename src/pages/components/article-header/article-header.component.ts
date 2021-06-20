import {Component, Input} from "@angular/core";
import {AuthProvider} from "../../../app/providers/auth.provider";

@Component({
    selector: 'app-article-header-component',
    templateUrl: './article-header.component.html',
    styleUrls: ['./article-header.component.scss']
})
export class ArticleHeaderIncludeComponent {
    private _subTitle: string = 'Lorem ipsum';
    constructor(private authProvider: AuthProvider) {
    }

    get logged() {
        return this.authProvider.user && this.authProvider.user.id;
    }

    get subTitle(): string {
        return this._subTitle;
    }

    @Input()
    set subTitle(value: string) {
        this._subTitle = value;
    }
}