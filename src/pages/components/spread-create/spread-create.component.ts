import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {SwalComponent} from '@toverux/ngx-sweetalert2';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ImageEditorComponent} from '../image-editor/image-editor.component';
import {EntitiesService} from '../../../app/providers/user/entities.service';
import {KeyNameModel} from '../../../model/KeyNameModel';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {WizardComponent} from 'angular-archwizard';
import {FileBlobModel} from '../../../model/FileBlobModel';
import {SpreadService} from '../../../app/providers/spread/spread.service';
import {UserService} from '../../../app/providers/user/user.provider';
import {NotificationService} from '../../../app/providers/user/notification.service';
import {AuthProvider} from '../../../app/providers/auth.provider';
import {NotificationProvider} from '../../../app/providers/notification.provider';

declare var Jodit: any;


@Component({
    selector: 'app-include-spread-create-component',
    templateUrl: './spread-create.component.html'

})
export class SpreadCreateIncludeComponent implements OnInit, AfterViewInit {
    @ViewChild(WizardComponent, {static: true})
    public wizardComponent: WizardComponent;
    @ViewChild('editorEl', {static: false}) editorEl: ElementRef;
    public invitationType: Array<string> = ['Public', 'Direct'];
    public tagControl: FormControl = new FormControl('', []);
    public spreadForm: FormGroup = new FormGroup({
        name: new FormControl('', [Validators.required]),
        tag: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        startTime: new FormControl((new Date()), [Validators.required]),
        endTime: new FormControl((new Date()), [Validators.required]),
        cover: new FormControl('', [Validators.required]),
        brand: new FormControl(0, [Validators.required, Validators.min(1)]),
        displayAction: new FormControl('', [Validators.required]),
        invitationType: new FormControl('', [Validators.required])
    });
    private editor: any;

    constructor(private spreadService: SpreadService, private notificationProvider: NotificationProvider,
                private userService: UserService, private notificationService: NotificationService,
                private authProvider: AuthProvider, private matDialogRef: MatDialogRef<any>,
                private matDialog: MatDialog, private entityService: EntitiesService) {
    }

    private _start: number = new Date().getTime();

    get start(): number {
        return this._start;
    }


    get loadingImg(): string {
        return FileBlobModel.loading();
    }

    set start(value: number) {
        this._start = value;
    }

    private _end: number = new Date().getTime();

    get end(): number {
        return this._end;
    }

    set end(value: number) {
        this._end = value;
    }

    private _settings = {
        bigBanner: true,
        timePicker: false,
        format: 'dd-MM-yyyy',
        defaultOpen: false
    };

    get settings(): { bigBanner: boolean; timePicker: boolean; format: string; defaultOpen: boolean } {
        return this._settings;
    }

    private _spreadCover: FileBlobModel = new FileBlobModel();

    get spreadCover(): FileBlobModel {
        return this._spreadCover;
    }

    private _tags: Array<string> = [];

    get tags(): Array<string> {
        return this._tags;
    }

    get interests(): Array<KeyNameModel> {
        return this.entityService.interests;
    }

    ngOnInit() {


    }

    ngAfterViewInit(): void {

        this.spreadForm.controls['startTime'].valueChanges.subscribe(r => {

        });
        this.editor = new Jodit(this.editorEl.nativeElement);
        this.editorEl.nativeElement.addEventListener('change', () => {
            this.spreadForm.controls['description'].setValue(this.editor.value);
        }, false);

        if (this.authProvider.user && this.authProvider.user.brandSelected) {
            this.spreadForm.controls['brand'].setValue(this.authProvider.user.brandSelected);
        }
        if (!this.spreadForm.controls['brand'].valid) {
            this.matDialogRef.close();
            this.notificationService.message(
                'let your audience know about your program by creating spread. Please change to a brand profile to explore',
                'Close', (r) => {
                });
        }
    }

    public createSpread() {
        this.notificationProvider.confirmSwal.options = {
            title: 'Create Spread',
            text: 'Please note that this will be available publicly. Really want to proceed?',
            showCancelButton: true,
            showConfirmButton: true
        };
        const subscription = this.notificationProvider.confirmSwal.confirm.subscribe((r) => {
            subscription.unsubscribe();
            this._createSpread();
        });
        this.notificationProvider.confirmSwal.show();
    }

    public status() {

    }

    public store(name, value) {
        this.spreadForm.controls[name].setValue(value);
    }

    public continueDesign() {
        this.notificationProvider.confirmSwal.options = {
            title: 'Continue to design',
            text: 'Do you want to make a custom design for your spread?',
            type: 'question',
            showCancelButton: true,
            showConfirmButton: true
        };

        const subs = this.notificationProvider.confirmSwal.confirm.subscribe(r => {
            if (r) {
                const dialogRef = this.matDialog.open(ImageEditorComponent, {
                    panelClass: 'full-panel',
                    maxWidth: '100vw'
                });

                const subscription = dialogRef.afterClosed().subscribe(r => {
                    if (r && r.size) {
                        this._spreadCover = new FileBlobModel(r);
                        subscription.unsubscribe();

                        this.wizardComponent.goToNextStep();
                    }

                }).add(() => {
                });
            }


        }).add(() => {
            subs.unsubscribe();

        });
        this.notificationProvider.confirmSwal.show();
    }

    public addTag() {
        const tag = this.interests.find(a => a.id == this.tagControl.value).name;
        if (!this.tags.find(a => a == tag)) { this.tags.push(tag); }

        this.spreadForm.controls['tag'].setValue(this._tags.toString());
    }

    public removeTag(index) {
        if (this._tags[index]) {
            this._tags.splice(index, 1);
            this.spreadForm.controls['tag'].setValue(this._tags.toString());
        }
    }

    private _createSpread() {
        this.spreadForm.controls['startTime'].setValue(new Date(this.spreadForm.controls['startTime'].value));
        this.spreadForm.controls['endTime'].setValue(new Date(this.spreadForm.controls['endTime'].value));
        this.spreadService.spreadForm = this.spreadForm;
        this.matDialog.closeAll();
        this.userService.uploadProfilePicture(this._spreadCover.file).then(r => {
            if (r && r.data) {
                this.spreadForm.controls['cover'].setValue(r.data.path);
                this._spreadCover.url = r.data.path;

                const subscription = this.spreadService.createBroadcast().add(r => {
                    subscription.unsubscribe();
                });
            }
        });

    }
}
