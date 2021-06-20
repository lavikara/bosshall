import {AfterViewInit, Component, Input, OnInit, Output} from '@angular/core';
import {UserService} from '../../../app/providers/user/user.provider';
import {AuthProvider} from '../../../app/providers/auth.provider';
import {CloudService} from '../../../app/providers/cloud/cloud.provider';

@Component({
    selector: 'app-avatar-component-include',
    templateUrl: './avatar-user.component.html',
    styleUrls: ['./avatar-user.component.scss']
})


export class AvatarUserIncludeComponent implements OnInit, AfterViewInit {
    public profile = null;
    private _radius = '5px';
    private _width = '37px';
    private _paddingTop = '21px';
    private _right = false;
    private _id: number;

    constructor(
        private userService: UserService,
        private authProvider: AuthProvider,
        private cloudService: CloudService
    ) {
    }
    ngOnInit(): void {
    }

    @Input()
    set profileUrl(url: string) {
        this.profile = url;
    }

    get profileUrl(): string {
        return this.profile || this.authProvider.user.picture;
    }


    get radius(): string {
        return this._radius;
    }

    @Input()
    set radius(value: string) {
        this._radius = value;
    }


    get width(): string {
        return this._width;
    }

    @Input()
    set width(value: string) {
        this._width = value;
    }


    get paddingTop(): string {
        return this._paddingTop;
    }

    @Input()
    set paddingTop(value: string) {
        this._paddingTop = value;
    }

    get right(): boolean {
        return this._right;
    }

    @Input()
    set right(value: boolean) {
        this._right = value;
    }

    get id(): number {
        return this._id;
    }

    @Input()
    set id(value: number) {
        this._id = value;
    }

    ngAfterViewInit(): void {

    }

    /**
     * Get online
     */
    get isOnline(): boolean {
        return this.cloudService.isOnline(this._id);
    }
}
