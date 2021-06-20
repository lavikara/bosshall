import {Component, Input} from '@angular/core';
import {MessageService} from '../../../app/providers/cloud/message/message.service';
import {PresentationParent} from '../../../app/providers/cloud/presentation/PresentationParent';
import {PresentationProvider} from '../../../app/providers/cloud/presentation/presentation';
import {CloudService} from '../../../app/providers/cloud/cloud.provider';
import {ParticipantEnum} from '../../../app/configuration/audience.enum';

@Component({
    selector: 'app-selector-complex-list-attendance-component',
    templateUrl: './complex-list-attendance.component.html',
    styleUrls: ['./complex-list-attendance.component.scss']
})

export class ComplexListAttendanceIncludeComponent {
    private _content: string;
    private _id = 0;
    private _name: string;
    private _description: string;
    private _picture: string;
    private _type: string;

    constructor(private messageService: MessageService,
                private presentationProvider: PresentationProvider,
                private cloudService: CloudService) {

    }

    get selectedUserChannel(): boolean {
        if (this._type === 'presentation') {
            return this.presentationProvider.selectedParentContainer &&
                this.presentationProvider.selectedParentContainer.id &&
                this.presentationProvider.selectedParentContainer.id === this._id;
        }
        return this.messageService.currentUser === this._id;
    }

    get content(): string {
        return this._content;
    }

    @Input()
    set type(value: string) {
        this._type = value;
    }

    @Input()
    set content(value: string) {
        this._content = value;
    }

    get name(): string {
        return this._name;
    }

    @Input()
    set name(value: string) {
        this._name = value;
    }


    get picture(): string {
        return this._picture;
    }

    @Input()
    set picture(value: string) {
        this._picture = value;
    }

    get description(): string {
        return this._description;
    }

    @Input()
    set description(value: string) {
        this._description = value;
    }

    public selectUserChannel() {
        if (this.cloudService.spreadDetails.myPermission !== ParticipantEnum.AUDIENCE) {
            this.cloudService.presentationSlide = !this.cloudService.presentationSlide;
        }

        this.messageService.setCurrentUser({
            id: this._id,
            firstname: this._name
        } as any, this.cloudService.myCapabilities);
    }

    get selectedPresentation(): PresentationParent {
        return this.presentationProvider.selectedParentContainer;
    }

    @Input()
    set id(value: number) {
        this._id = value;
    }

    get id(): number {
        return this._id;
    }
}
