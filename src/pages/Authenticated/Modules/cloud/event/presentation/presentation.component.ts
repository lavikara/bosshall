import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SpreadModel} from '../../../../../../model/SpreadModel';
import {CloudService} from '../../../../../../app/providers/cloud/cloud.provider';
import {PresentationGuide, PresentationProvider} from '../../../../../../app/providers/cloud/presentation/presentation';
import {FormControl, Validators} from '@angular/forms';
import {AuthProvider} from '../../../../../../app/providers/auth.provider';
import {DragNDropProvider} from '../../../../../../app/providers/dragNDropProvider';
import {PresentationParent} from '../../../../../../app/providers/cloud/presentation/PresentationParent';
import {NotificationService} from '../../../../../../app/providers/user/notification.service';
import {NotificationProvider} from '../../../../../../app/providers/notification.provider';
import {PresentationTransformParent} from '../../../../../../app/providers/cloud/presentation/PresentInterraction/PresentationTransformParent';
import {ApiProvider} from '../../../../../../app/providers/api.service';
import {Publisher} from 'openvidu-browser';
import {publish} from 'rxjs/operators';
import {ConnectionSocketProvider} from '../../../../../../app/providers/socket/connection.socket.provider';
import {PresentationTransform} from '../../../../../../app/providers/cloud/presentation/PresentationTransform';

@Component({
    selector: 'app-cloud-presentation-component',
    templateUrl: './presentation.component.html',
    styleUrls: ['../../../../../components/participant-message/participants-message.component.scss',
        './presentation.component.scss']
})

export class CloudPresentationComponent implements OnInit, AfterViewInit {
    private _paddingSize = '38px 38px 0 38px';
    private _bg = '#fbfbfb';
    private _files = [''];
    private sumDuration = 0;
    private dragAndDrop: DragNDropProvider;
    private createdContainerId: number;
    @ViewChild('fileEl', {static: true}) fileEl: ElementRef;

    constructor(
        private cloudService: CloudService,
        public presentationService: PresentationProvider,
        private notificationProvider: NotificationProvider,
        private authProvider: AuthProvider,
        private socketConnectionServer: ConnectionSocketProvider,
        private notificationService: NotificationService,
        private apiProvider: ApiProvider
    ) {
    }

    /**
     * return the mobile slide value
     */
    get isMobileSlide(): boolean {
        return this.cloudService.presentationSlide;
    }

    ngOnInit() {
       this.presentationService.presentationName = new FormControl(null, [Validators.required]);

       this.initDragDrop();

       this.presentationService.presentationName.valueChanges.subscribe( () => {
           if (
               this.presentationService && this.presentationService.presentationName.value &&
               this.presentationService.selectedParentContainer.name
           ) {
               this.presentationService.selectedParentContainer.name = this.presentationService.presentationName.value;
           }
       });
    }



    ngAfterViewInit() {
    }


    private initDragDrop() {
        this.dragAndDrop = new DragNDropProvider(this.fileEl.nativeElement, true, true);
        this.dragAndDrop.onFileDropped = (file: Blob) => {
        const fileType = file.type.split('/');
        if (fileType[0] === 'image' || fileType[0] === 'video') {
            this.presentationService.addPresentationFile((this.presentationService.presentations.length) , file);
        }
    };
        this.dragAndDrop.setup();
    }

    get paddingSize(): string {
        return this._paddingSize;
    }

    get bg(): string {
        return this._bg;
    }

    get files(): any[] {
        return this._files;
    }

    get spreadDetails(): SpreadModel {
        return this.cloudService.spreadDetails;
    }

    get presentations(): PresentationGuide[] {
        return this.presentationService.presentations;
    }

    private createParentPresentation() {
        this.presentationService.createParent({
            spread: this.spreadDetails.id,
            name: this.presentationService.presentationName.value,
            user: this.authProvider.user.id
        }).subscribe( r => {
            if (r.data && r.data.id) {
                this.createdContainerId = r.data.id;
                this.presentationService.presentationContainers.map((presentationContainer) => {
                    if (presentationContainer.name === this.presentationService.presentationName.value) {
                        presentationContainer.id = r.data.id;
                    }

                    return presentationContainer;
                });
                this.createChildPresentations();
            }
            if (r && r.statusText) {
                this.notificationService.notifierMessage('success', r.statusText);
            }
        }, error => {
            if (error && error.statusText) {
                this.notificationService.notifierMessage('error', error.statusText);
            }
        });
    }

    private createChildPresentations() {
        const presentations = [];
        const updatePresentations = [];

        this.presentationService.presentations.forEach((presentation, index) => {
            if (!presentation.id) {
                presentation.order = index;
                presentation.container = this.presentationContainerId;
                presentations.push(presentation);
            } else {
                updatePresentations.push(presentation);
            }
        });
        if (presentations.length) {
            this.presentationService.create(this.presentationService.selectedParentContainer.id, presentations);
        }

        if (updatePresentations.length) {
            updatePresentations.forEach((pres) => {
                this.presentationService.updateChild(this.presentationContainerId, pres);
            });
        }

    }

    get presentationContainerId(): number {
        return this.presentationService.selectedParentContainer.id || this.createdContainerId;
    }

    private updateParentPresentation() {
        this.presentationService.updateParent(this.presentationContainerId,
            this.presentationService.selectedParentContainer.name).add( r => {
                this.createChildPresentations();
        });
    }


    public createPresentation() {
        if (!this.presentationService.selectedParentContainer || !this.presentationService.selectedParentContainer.id) {
            this.createParentPresentation();
        } else if (this.presentationService.selectedParentContainer.id) {
            this.updateParentPresentation();
        } else {
            this.createChildPresentations();
        }
    }

    get selectedContainer(): PresentationParent {
        return this.presentationService.selectedParentContainer;
    }

    public deletePresentationParent() {

        if (!this.presentationContainerId) {
            for (let i = 0; i < this.presentationService.presentationContainers.length; i++) {
                if (this.presentationService.presentationContainers[i].name === this.presentationService.selectedParentContainer.name) {
                    this.presentationService.presentationContainers.splice(i, 1);
                    this.presentationService.selectedParentContainer = {} as PresentationParent;
                }
            }
            return;
        }
        this.notificationProvider.confirmSwal.options = {
            title: 'Delete Presentation',
            text: `Do you want to delete presentation container ${this.presentationService.selectedParentContainer.name}?`,
            type: 'question',
            cancelButtonText: 'cancel',
            showCancelButton: true
        };
        this.notificationProvider.confirmSwal.show().then(r => {
            if (r && r.value == true) {
                this.presentationService.deleteParent(this.presentationContainerId);
            }
        });
    }

    public deleteChildPresentation(presentationId: number) {

        this.notificationProvider.confirmSwal.options = {
            title: 'Delete Presentation',
            text: `Do you want to delete presentation selected?`,
            type: 'question',
            confirmButtonText: 'Delete',
            cancelButtonText: 'cancel',
            showCancelButton: true
        };
        this.notificationProvider.confirmSwal.show().then(r => {
                if (r && r.value == true) {
                    this.presentationService.deleteChild(this.presentationContainerId, presentationId);
                }
            }
        );
    }

    public playPresentation() {
        const presentTransform = new PresentationTransform(
            this.socketConnectionServer,
            this.authProvider,
            this.presentations,
            this.apiProvider,
            this.cloudService.recordInstance,
            false,
            this.presentationService.selectedParentContainer.spread
        );

        presentTransform.start();
        presentTransform.onPresentationStart = (event: any) => {
            // this.cloudService.recordInstance.start();
        };
        presentTransform.onPresentationDone = (event: any) => {
            this.cloudService.recordInstance.stopPresentation();
            this.cloudService.recordInstance.resumeVideo();
        };
    }


    whichType(tag: string): 'AUDIO' | 'VIDEO' | 'IMAGE' | 'OTHER' {
        if (!tag) {
            return 'OTHER';
        }

        if (tag.indexOf('audio') > -1) {
            return 'AUDIO';
        } else if (tag.indexOf('image') > -1) {
            return 'IMAGE';
        } else if (tag.indexOf('video') > -1) {
            return 'VIDEO';
        } else {
            return 'OTHER';
        }
    }
}

