import {Component} from '@angular/core';
import {Participants} from '../../../model/Participants';
import {CloudService} from '../../../app/providers/cloud/cloud.provider';

@Component({
    selector: 'app-participant-lists-component',
    templateUrl: './participant-lists.component.html',
    styleUrls: ['./participant-lists.component.scss']
})

export class ParticipantListsComponent {
    private _singleList = true;
    private _complexList = true;
    private _searchModel: string = '';

    constructor(private cloudService: CloudService) {
    }

    get participants(): Array<Participants> {
        return this.cloudService.participants;
    }

    participantText(permission) {
        return this.cloudService.participantText(permission);
    }

    get singleList(): boolean {
        return this._singleList;
    }

    get complexList(): boolean {
        return this._complexList;
    }

    public toggle(type) {
        if (type === 'single') {
            this._singleList = !this._singleList;
        } else {
            this._complexList = !this._complexList;
        }
    }


    set searchModel(value: string) {
        this._searchModel = value;
    }

    get searchModel(): string {
        return this._searchModel;
    }

    get spreadId(): number {
        return this.cloudService.spreadDetails.id;
    }

    get isChiefHost(): boolean {
        return this.cloudService.isChiefHost;
    }

}
