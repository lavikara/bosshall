import {Component, OnInit} from "@angular/core";
import {AuthProvider} from "../../../app/providers/auth.provider";
import {UserModel} from "../../../model/UserModel";

@Component({
    selector: 'app-include-footer-component',
    templateUrl: './footer.component.html'
})

export class FooterIncludeComponent implements OnInit {
    constructor(private authProvider: AuthProvider) {

    }

    get user(): UserModel {
        return this.authProvider.user;
    }

    get date(): number {
        return (new Date()).getFullYear();
    }

    ngOnInit() {

    }

    public signOut() {
        this.authProvider.signOut();
    }

}
