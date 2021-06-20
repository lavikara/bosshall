import {Component, OnInit} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {UserModel} from '../../../model/UserModel';
import {Observable} from 'rxjs';
import {delay} from 'rxjs/operators';
import {UserService} from '../../../app/providers/user/user.provider';
import {MatDialogRef} from '@angular/material/dialog';
import {FileBlobModel} from '../../../model/FileBlobModel';

@Component({
    selector: 'app-search-user-component',
    templateUrl: './search-user.component.html'
})
export class SearchUserComponent implements OnInit {
    public searchUser: FormControl = new FormControl('', [Validators.required]);
    public options: Observable<UserModel[]>;
    public searched: boolean;
    private delayTimeOut = null;

    constructor(private userService: UserService,
                private dialogRef: MatDialogRef<UserModel>) {

    }

    private delay() {
        clearTimeout(this.delayTimeOut);
        this.delayTimeOut = setTimeout(() => {
            this.searched = true;
            this.options = this.userService.searchUser(
                this.searchUser.value
            );
        }, 2000);

    }

    ngOnInit(): void {
        this.searchUser.valueChanges.subscribe((r: any) => this.delay());
    }

    public selectItem(item) {
        item.name = item.firstname + ' ' + item.lastname;
        this.searchUser.setValue(item.name);
        this.dialogRef.close(item);
    }


    public add() {
        let option = {};
        if ((this.searchUser.value) > 1000) {
          option = {
                phone: this.searchUser.value
            };
        } else {
            option = {
                email: this.searchUser.value
            };
        }
        this.dialogRef.close(option);
    }

    get loadingImg(): string {
        return FileBlobModel.loading();
    }
}
