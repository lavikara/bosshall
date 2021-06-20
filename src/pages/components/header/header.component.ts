import {AfterViewInit, Component, Input, OnInit} from "@angular/core";
import {NgxSmartModalService} from "ngx-smart-modal";
import {Router} from "@angular/router";
import {FileBlobModel} from "../../../model/FileBlobModel";
import {AuthProvider} from "../../../app/providers/auth.provider";
import {UserModel} from "../../../model/UserModel";
import {delay} from "rxjs/operators";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";
import {UserService} from "../../../app/providers/user/user.provider";
import {BrandModel} from "../../../model/BrandModel";
import {BrandService} from "../../../app/providers/brand/brand.service";
import {MatDialog} from "@angular/material/dialog";
import {SpreadCreateIncludeComponent} from "../spread-create/spread-create.component";
import {NotificationProvider} from "../../../app/providers/notification.provider";
import {NotificationModel} from "../../../model/NotificationModel";
import {RouteService} from '../../../app/providers/route.service';

@Component({
    selector: 'app-header-inc-component',
    templateUrl: './header.component.html'
})

export class HeaderIncComponent implements OnInit, AfterViewInit {

    public searchUser: FormControl = new FormControl('', [Validators.required]);
    public options: Observable<BrandModel[]>;
    public profile = new FileBlobModel();
    public myBrandEntry: any = {} as any;
    private notificationEntry: any = {} as any;
    private _badgeCount: number = 0;
    private _constraintPage = true;

    private _isBrandPage: boolean = false;
    public navigation: Array<boolean> = [];
    @Input()
    title: string = 'Brand Profile';
    @Input() showStory: boolean = false;
    @Input() editStory: boolean = false;

    constructor(public ngxSmartModalService: NgxSmartModalService,
                private router: Router,
                private brandService: BrandService,
                private notificationService: NotificationProvider,
                private matModal: MatDialog,
                private authProvider: AuthProvider,
                public routeService: RouteService,
                private userService: UserService) {

    }

    get badgeCount(): number{
        return this._badgeCount;
    }


    get constraintPage(): boolean {
        return this._constraintPage;
    }

    @Input()
    set constraintPage(value: boolean) {
        this._constraintPage = value;
    }

    get isBrandPage(): boolean {
        return this._isBrandPage;
    }

    @Input()
    set isBrandPage(value: boolean) {
        this._isBrandPage = value;
    }

    private _clearSearch: boolean;

    get clearSearch(): boolean {
        return this._clearSearch;
    }

    get loadingImg(): string {
        return FileBlobModel.loading();
    }

    @Input()
    set clearSearch(value: boolean) {
        this._clearSearch = value;
    }

    get notifications(): Array<NotificationModel> {
        return this.notificationEntry.data;
    }

    get myBrands(): Array<BrandModel> {
        return this.myBrandEntry.data;
    }

    get user(): UserModel {
        return this.authProvider.user;
    }

    get brands(): Array<BrandModel> {
        return this.brandService.allBrands.data;
    }

    private fetchNotification() {
        this.notificationEntry.request().add(() => {
            this._badgeCount = 0;
            this.notificationEntry.data.forEach((e: NotificationModel) => {
                if(!e.read) {
                    this._badgeCount++;
                }
            })
        })

    }
    ngOnInit() {
        if (!this.authProvider.user || !this.authProvider.user.id) {
            return;
        }
        this.profile.url = this.authProvider.user.picture;
        this.searchUser.valueChanges.pipe(
            delay(2000)
        ).subscribe((r: any) => {
            this.options = this.brandService.searchBrand(r);
        });
        this.notificationEntry = this.notificationService.listNotification(true, 1);
        this.myBrandEntry = this.brandService.getCreatedBrand(1, true);
    }

    showMore() {
        this.notificationEntry.request();
    }

    ngAfterViewInit(): void {
        if (!this.authProvider.user || !this.authProvider.user.id) {
            return;
        }
        this.myBrandEntry.request();
        this.fetchNotification()
    }

    public selectUser(brand: BrandModel) {
        this.router.navigate(['/bl/brand/profile', {id: brand.id}], {
            skipLocationChange: true
        })
        this.searchUser.setValue('');
    }

    public selectBrand(brand: BrandModel) {
        this.user.brandSelected = brand.id;
        this.userService.userForm = new FormGroup({
            brandSelected: new FormControl(brand.id)
        });
        this.userService.updateProfile(false).finally(() => {});
    }



    public openModal() {
        const spreadRef = this.matModal.open(SpreadCreateIncludeComponent, {panelClass: 'transparent-panel'});
        spreadRef.afterClosed().subscribe(r => {
        })
    }

    public handleResultSelected(event) {

    }

    public deleteAccount() {

    }


    get loggedIn() {
        return this.authProvider.user && this.authProvider.user.id;
    }

    public clearNotification() {
        this._badgeCount = 0;
    }

    public sendClearCommand() {
        this.notificationService.readNotification(this.notificationEntry.data.map(r => r.id)).add(() => {
            this.fetchNotification();
        })
    }

    public signOut() {
        this.authProvider.signOut();
    }

    public createBrand(multiBrand: boolean) {
        this.router.navigate(['/bl/brand/create', {multiBrand: multiBrand}]);
    }
}
