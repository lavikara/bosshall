import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import {SpreadModel} from '../../../model/SpreadModel';
import {SpreadService} from '../../../app/providers/spread/spread.service';
import {NotificationProvider} from '../../../app/providers/notification.provider';
import {Subject, Subscription} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {PlayerSettingsComponent} from '../player-settings/player-settings.component';
import {AuthProvider} from '../../../app/providers/auth.provider';
import {Router} from '@angular/router';
import {BrandService} from '../../../app/providers/brand/brand.service';
import {FileBlobModel} from '../../../model/FileBlobModel';
import {ConnectionSocketProvider} from '../../../app/providers/socket/connection.socket.provider';
import {SpreadStatusEnum} from '../../../app/configuration/Spread.config';
import {RequestInterface} from '../../../app/providers/RequestInterface';

@Component({
    selector: 'app-player-list-include-component',
    templateUrl: './player-list.component.html'
})


export class PlayerListIncludeComponent implements OnInit, AfterViewInit, OnDestroy {
    private index = 0;
    private enableJumpTrigger = false;
    private trigger: any = {} as any;
    private subscription: Array<Subscription> = [];
    constructor(private spreadService: SpreadService,
                private matDialog: MatDialog,
                private router: Router,
                private brandService: BrandService,
                private connectionSocket: ConnectionSocketProvider,
                private authProvider: AuthProvider,
                private changeDetector: ChangeDetectorRef,
                private notificationProvider: NotificationProvider) {

    }

    get title(): string {
        return this._title;
    }

    @Input()
    set triggerReload(data) {
        this.ngOnInit();
    }

    @Input()
    set clickScroll(value: boolean) {
        this.enableJumpTrigger = value;
    }

    @Input()
    set title(value: string) {
        this._title = value;
    }

    get canFilter(): boolean {
        return this._canFilter;
    }

    @Input()
    set canFilter(value: boolean) {
        this._canFilter = value;
    }
    @Input()
    public heading = true;
    @Input()
    public colSize = 'col-md-4';
    @Output()
    public onMediaChange: EventEmitter<{ index: number, item: any }> = new EventEmitter();
    @Output()
    onMediaReceived: EventEmitter<any> = new EventEmitter<any>();
    private _brandId: number;
    @Input()
    public type = 'brand';

    private isGeneral = false;

    private tempHandler: RequestInterface;

    @Input()
    set isGeneralListing(value) {
        this.isGeneral = value;
    }

    get _spreadHandler(): RequestInterface {
        if (this.isGeneral) {
            return this.spreadService.spreadHandler;
        } else {
            return this.tempHandler;
        }
    }

    private _title = 'Recommended';

    private _canFilter = false;


    isMe(user) {
        return this.authProvider.user.id === user;
    }

    private reloadTrigger(data) {
        if (data && data.player && this._spreadHandler.data && Array.isArray(this._spreadHandler.data)) {
            for (let i = 0; i < this._spreadHandler.data.length; i++) {
                if (this._spreadHandler.data[i].id === data.player) {
                    this.index = i;
                }
            }
        }
    }

    ngOnInit() {
        this.tempHandler = this.spreadService.getAllBroadcastBrand(true, 1, '');
    }

    ngAfterViewInit(): void {
        const newSpread = new Subject<any>();
        this.connectionSocket.setObservable('Spread', newSpread);
        const newSpreadSubscription = newSpread.subscribe((r) => {
            if (r && r.data && r.data.name === 'Spread_list') {
                if (!this._spreadHandler.data || !this._spreadHandler.data.length) {
                    this._spreadHandler.data = [];
                }
                this._spreadHandler.data.unshift(r.data.content);
                this.index += 1;
                this.playerClicked((this.index), this._spreadHandler.data[this.index]);

            }
        });

        this.subscription.push(newSpreadSubscription);
    }

    playerLists(): Array<SpreadModel> {
        return this._spreadHandler.data;
    }

    get spreadHandler(): RequestInterface {
        return this._spreadHandler;
    }

    public filterPlayer(event) {
        if (event === 0) {
            this._spreadHandler.data.sort((a, b) => {
                /**
                 * sort player by end date
                 */
                if (new Date(a.createdAt) > new Date(b.createdAt)) {
                    return -1;
                } else if (new Date(a.createdAt) < new Date(b.createdAt)) {
                    return 1;
                } else {
                    return 0;
                }
            });
        } else if (event === 1) {
            /** Sort player by name
             */
            this._spreadHandler.data.sort((a, b) => {
                if (a.name > b.name) {
                    return 1;
                } else if (a.name < b.name) {
                    return -1;
                } else {
                    return 0;
                }
            });
        } else if (event === 2) {
            /**
             * sort player by the comment count
             */
            this._spreadHandler.data.sort((a, b) => {
                if (a.comment_count > b.comment_count) {
                    return -1;
                } else if (a.comment_count < b.comment_count) {
                    return 1;
                } else {
                    return 0;
                }
            });
        } else if (event === 3) {
            /**
             * sort player by number of download
             */
            this._spreadHandler.data.sort((a, b) => {
                if (a.download > b.download) {
                    return -1;
                } else if (a.download < b.download) {
                    return 1;
                } else {
                    return 0;
                }
            });
        } else if (event === 4 ) {
            this._spreadHandler.data.sort((a, b) => {
                if (new Date(a.startTime) > new Date(b.startTime)) {
                    return -1;
                } else if (new Date(a.startTime) < new Date(b.startTime)) {
                    return 1;
                } else {
                    return 0;
                }
            });

        }
    }

    get brandId(): number {
        return this._brandId;
    }

    @Input()
    set brandId(value: number) {
        if (value && value > 0) {

            if (!this.tempHandler || !('request' in this.tempHandler)) {
                this.ngOnInit();
            }

            this._brandId = value;
            this._spreadHandler.select([this._brandId]);
            const spreadSubscription = this._spreadHandler.request();
            spreadSubscription.add(() => {
                if (this._spreadHandler.data && this._spreadHandler.data.length) {
                    this.onMediaReceived.emit(this._spreadHandler.data);
                }
                this.reloadTrigger(this.trigger);
                spreadSubscription.unsubscribe();
            });
        }
    }

    private spreadDelete(spreadId) {
        this.notificationProvider.confirmSwal.options = {
            title: 'Delete Spread',
            text: 'Do you really want to delete this spread?',
            type: 'question',
            showConfirmButton: true,
            confirmButtonText: 'Delete',
            cancelButtonText: 'Cancel',
            showCancelButton: true
        };
        this.notificationProvider.confirmSwal.show();
        this.notificationProvider.confirmSwal.confirm.subscribe(r => {
                if (r) {
                    const subscription: Subscription = this.spreadService.deleteSpread(spreadId).add(r => {}).add(() => {
                        subscription.unsubscribe();
                    });
                }
            }
        );
    }


    private playerOption(data) {
        window.scrollTo(0, 0);

        const spreadRef = this.matDialog.open(PlayerSettingsComponent, {data: data, panelClass: 'transparent-panel'});
        spreadRef.afterClosed().subscribe(r => {

        });
    }


    get loadingImg(): string {
        return FileBlobModel.loading();
    }


    public pageChanged(event, data) {
       if (event === 0 && data.id) {

           /**
            * open menu for player settings
            */

           this.playerOption(data);
       } else if ( event === 1 && data.id) {
           /**
            * delete a spread
            */
           this.spreadDelete(data.id);

       } else if (event === 2 && data.id) {
           this.router.navigate(['/bl/spread/' + data.id + '/invitations', {id: data.id}], {
               skipLocationChange: true
           });
       }

    }

    public isActive(status: number) {
        return status === SpreadStatusEnum.ACTIVE;
    }


    public playerClicked(index: number, item: any) {
        this.index = index;
        this.onMediaChange.emit({index, item});
        if (this.enableJumpTrigger) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }

    ngOnDestroy(): void {
        this.subscription.map(r => r.unsubscribe());
    }
}
