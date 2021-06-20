import {AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {ValidatorHelper} from '../../../app/providers/input.provider/validator.input.provider';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {SearchUserComponent} from '../search-user/search-user.component';
import {Subscription} from 'rxjs';
import {UserModel} from '../../../model/UserModel';
import {FileBlobModel} from '../../../model/FileBlobModel';
import {ExecutiveModel} from "../../../model/ExecutiveModel";
import {UserService} from "../../../app/providers/user/user.provider";
import {SpreadService} from "../../../app/providers/spread/spread.service";
declare var Jodit: any;

@Component({
    selector: 'app-player-settings-component',
    templateUrl: 'player-settings.component.html'
})

export class PlayerSettingsComponent implements OnInit, AfterViewInit {
    public invitationType: Array<string> = ['Public', 'Direct'];
    @ViewChild('fileEl', {static: false}) fileEl: ElementRef;
    @ViewChild('soundEl', {static: false}) soundEl: ElementRef;
    @ViewChild('editorEl', {static: false}) editorEl: ElementRef;

    public permissions: Array<string> = ['Attendance', 'Guests', 'Chief hosts'];
    private editor: any;
    private _users: Array<UserModel> = [];
    private _cover: FileBlobModel = new FileBlobModel();
    private _sound: FileBlobModel = new FileBlobModel();

    public playerEdit: FormGroup = new FormGroup({
        displayAction: new FormControl('', [Validators.required]),
        startTime: new FormControl('', [Validators.required]),
        endTime: new FormControl('', [Validators.required]),
        invitationType: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required]),
        cover: new FormControl('', [Validators.required]),
        audienceDuration: new FormControl(5, [Validators.required, Validators.minLength(2)]),
        backgroundSound: new FormControl('', [Validators.required]),
        users: new FormControl('', [Validators.required])

    });



    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                private userService: UserService,
                public validatorHelper: ValidatorHelper,
                private spreadService: SpreadService,
                private matDialog: MatDialog) {}


                private addFile(file, callback:(path:string) => any){
                    this.userService.uploadProfilePicture(file).then(r=> {
                        if(r && r.data && r.data.path) {
                            callback(r.data.path);
                        }
                    })
                }
    ngAfterViewInit(): void {
        this.editor = new Jodit(this.editorEl.nativeElement);
        this.fileEl.nativeElement.addEventListener('change', (event) => {
            if (event && event.target.files && event.target.files[0]) {
                this._cover = new FileBlobModel(event.target.files[0]);
                this.addFile(this._cover.file, (path) => {
                    this.playerEdit.controls['cover'].setValue(path);
                    this._cover.url = path;
                })
            }
        });

        this.soundEl.nativeElement.addEventListener('change', (event) => {
            if (event && event.target.files && event.target.files[0]) {
                this._sound = new FileBlobModel(event.target.files[0]);
                this.addFile(this._sound.file, (path) => {
                    this.playerEdit.controls['backgroundSound'].setValue(path);
                    this._sound.url = path;
                })
            }
        })

        if(this.data && this.data.id) {
            this.populateForm();
        }


    }

    private dateTransform(date: string) {
        const dateString = new Date(date).toISOString()
        return dateString.substring(0, dateString.length - 2);
    }

    private populateForm() {
        this.playerEdit.controls['displayAction'].setValue(this.data.displayAction);
        this.playerEdit.controls['startTime'].setValue(this.dateTransform(this.data.startTime));
        this.playerEdit.controls['endTime'].setValue(this.dateTransform(this.data.endTime));
        this.playerEdit.controls['invitationType'].setValue(this.data.invitationType);
        this.playerEdit.controls['description'].setValue(this.data.description);
        this.editor.value=this.data.description;
        this.playerEdit.controls['cover'].setValue(this.data.cover);
        this.playerEdit.controls['backgroundSound'].setValue(this.data.backgroundSound);
        this._users = this.data.Participants;
        this._cover.url = this.data.cover;
        this.playerEdit.controls['audienceDuration'].setValue(this.data.audienceGrantPeriod);
    }
    ngOnInit(): void {

    }


    get cover(): FileBlobModel {
        return this._cover;
    }

    get sound(): FileBlobModel {
        return this._sound;
    }



    public close() {
       this.matDialog.closeAll();
    }

    public searchUser() {
        const searchUserModal = this.matDialog.open(SearchUserComponent, {
            panelClass: 'search-user-modal',
            maxWidth: '500px'
        });

        searchUserModal.afterClosed().subscribe((r: UserModel) => {
            if (r && r.id) {
                this._users.push(r);
            }
        });
    }



    get loadingImg(): string {
        return FileBlobModel.loading();
    }

    public playerSubmit() {
        this.playerEdit.controls['description'].setValue(this.editor.value);
        this.playerEdit.controls['users'].setValue(this._users);
        this.playerEdit.controls['startTime'].setValue(new Date(this.playerEdit.controls['startTime'].value));
        this.playerEdit.controls['endTime'].setValue(new Date(this.playerEdit.controls['endTime'].value));
        this.spreadService.spreadForm = this.playerEdit;
       this.spreadService.updateSpread(this.data.id).add(() => {
            this.close();
        })
    }

    get users(): Array<UserModel> {
        return this._users;
    }
}
