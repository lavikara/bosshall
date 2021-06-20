import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ValidatorHelper} from '../../../../../app/providers/input.provider/validator.input.provider';
import {Router} from '@angular/router';
import {FileBlobModel} from '../../../../../model/FileBlobModel';
import {AuthProvider} from '../../../../../app/providers/auth.provider';
import {EntitiesService} from '../../../../../app/providers/user/entities.service';
import {UserService} from '../../../../../app/providers/user/user.provider';
import {MatDialog} from '@angular/material';
import {Lightbox} from 'ngx-lightbox';
import {NotificationService} from '../../../../../app/providers/user/notification.service';

@Component({
    selector: 'app-user-profile-component',
    templateUrl: './user-profile.component.html'
})


export class UserProfileComponent implements OnInit, AfterViewInit {

    constructor(public validatorHelper: ValidatorHelper,
                private entities: EntitiesService,
                private router: Router,
                private lightBox: Lightbox,
                private notification: NotificationService,
                private userService: UserService,
                private matDialog: MatDialog,
                private authService: AuthProvider) {
    }

    get tags(): Array<string> {
        return this._tags;
    }

    get backgroundImage(): FileBlobModel {
        return this._backgroundImage;
    }

    get picture(): FileBlobModel {
        return this._picture;
    }

    get countries() {
        return this.entities.countries;
    }
    @ViewChild('coverImage', {static: false}) coverImage: ElementRef;
    @ViewChild('profileImage', {static: false}) profileImage: ElementRef;
    public editProfile: FormGroup = new FormGroup({
        firstname: new FormControl('', [Validators.required]),
        lastname: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        mobile: new FormControl('', [Validators.required]),
        background: new FormControl(''),
        picture: new FormControl(''),
        country: new FormControl('', [Validators.required]),
        interests: new FormControl([], [Validators.required]),
        headline: new FormControl('', []),
        bio: new FormControl('', []),
        tags: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        address: new FormControl('')
    });
    public tagControl: FormControl = new FormControl('', []);

    private _tags: Array<string> = [];

    private _backgroundImage: FileBlobModel = new FileBlobModel();

    private _picture: FileBlobModel = new FileBlobModel();

    public openLightbox(image) {
        this.lightBox.open([{
            src: image
        }] as any, 0);
    }

    ngOnInit() {
        this.populateUser();
    }

    ngAfterViewInit(): void {

    }

    public addTag(event) {

        if (event.key === ',' || event.key.toLowerCase() === 'enter' || event.key === ' ') {
            event.preventDefault();
            if (!this.tags.find(a => a == this.tagControl.value)) { this._tags.push(this.tagControl.value); }
            this.editProfile.controls['tags'].setValue(this._tags.toString());
            setTimeout(() => {
                this.tagControl.reset();
            }, 1000);
        }

    }

    public changeImage(type) {
        if (type === 'cover') {
            this.coverImage.nativeElement.click();
            return;
        }
        this.profileImage.nativeElement.click();
    }

    public fileChanged(type, event) {
        if (event.target.files && event.target.files.length) {
            if (type === 'cover') {
                this._backgroundImage = new FileBlobModel(event.target.files[0]);

            } else if (type === 'profile') {
                this._picture = new FileBlobModel(event.target.files[0]);
            }
        }
    }

    public receivedInterest(event) {
        this.editProfile.controls['interests'].setValue(event);
    }

    public updateProfile() {
        this._requestUpload();
    }

    public confirmAction() {
        if (!this.authService.requiredMet()) {
            if (
                !this.editProfile.controls['interests'].value ||
                !this.editProfile.controls['interests'].value.length
            ) {
                return this.notification.notifierMessage('warning', 'Interest is required to complete profile');
            }
           return  this.notification.notifierMessage('warning', 'Input with * are required');
        }

        this.router.navigate(['/bl/brand']).then(r => {});
    }

    public removeTag(index) {
        if (this._tags[index]) {
            this._tags.splice(index, 1);
            this.editProfile.controls['tags'].setValue(this._tags.toString());
        }
    }

    private populateUser() {
        this.editProfile.controls['firstname'].setValue(this.authService.user.firstname);
        this.editProfile.controls['lastname'].setValue(this.authService.user.lastname);
        this.editProfile.controls['email'].setValue(this.authService.user.email);
        this.editProfile.controls['mobile'].setValue(this.authService.user.mobile);
        this.editProfile.controls['country'].setValue(this.authService.user.country);
        this.editProfile.controls['headline'].setValue(this.authService.user.headline);
        this.editProfile.controls['bio'].setValue(this.authService.user.bio);
        this.editProfile.controls['state'].setValue(this.authService.user.state);
        this.editProfile.controls['address'].setValue(this.authService.user.address);
        this.editProfile.controls['background'].setValue(this.authService.user.background);
        this.editProfile.controls['picture'].setValue(this.authService.user.picture);
        if (this.authService.user && this.authService.user.tags) {
            this.editProfile.controls['tags'].setValue(this.authService.user.tags);
            this._tags = this.authService.user.tags.split(',');
        }

        this._backgroundImage.url = this.authService.user.background;
        this._picture.url = this.authService.user.picture;
        this.userService.getMyInterest().then(r => {
            this.editProfile.controls['interests'].setValue(this.userService.userInterests);
        });
    }

    private _updateNreload() {
        this.userService.userForm = this.editProfile;
        this.userService.updateProfile().then(r => {
            this.populateUser();
            this.confirmAction();
        });
    }

    private _requestUpload() {
        // if user has added background image
        if (this.backgroundImage.file && this.backgroundImage.file.size && this.picture.file &&
            this.picture.file.size) {
            this.userService.uploadProfilePicture(this.backgroundImage.file).then(r => {
                this.editProfile.controls['background'].setValue(r.data.path);
                this.userService.uploadProfilePicture(this.picture.file).then(r => {
                    this.editProfile.controls['picture'].setValue(r.data.path);
                    this._updateNreload();
                });
            });
            // if only background image exists
        } else if (this.backgroundImage.file && this.backgroundImage.file.size) {
            this.userService.uploadProfilePicture(this.backgroundImage.file).then(r => {
                this.editProfile.controls['background'].setValue(r.data.path);
                this._updateNreload();
            });
            // upload picture only and update
        } else if (this.picture.file && this.picture.file.size) {
            this.userService.uploadProfilePicture(this.picture.file).then(r => {
                this.editProfile.controls['picture'].setValue(r.data.path);
                this._updateNreload();
            });
        } else {
            this._updateNreload();
        }
    }
}
