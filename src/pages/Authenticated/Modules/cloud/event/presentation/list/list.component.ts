import {Component, OnInit} from '@angular/core';
import {PresentationProvider} from '../../../../../../../app/providers/cloud/presentation/presentation';
import {CloudService} from '../../../../../../../app/providers/cloud/cloud.provider';
import {PresentationParent} from '../../../../../../../app/providers/cloud/presentation/PresentationParent';
import {ParticipantEnum} from '../../../../../../../app/configuration/audience.enum';

@Component({
    selector: 'app-list-sub-presentation-component',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})

export class PresentationListSubComponent implements OnInit {
    private _toggled = true;
    private subscriptions = [];

    public constructor(
        private presentationProvider: PresentationProvider,
        private cloudService: CloudService
    ) {
    }
    get complexList(): boolean {
        return this._toggled;
    }

    public toggle() {
        this._toggled = !this._toggled;
    }

    get presentationContainers(): PresentationParent[] {
        return this.presentationProvider.presentationContainers as PresentationParent[];
    }

    public togglePresentationListSlide() {
        this.cloudService.presentationSlide = !this.cloudService.presentationSlide;
    }

    ngOnInit() {
        const subscription = this.presentationProvider.get(this.cloudService.spreadDetails.id);
        this.subscriptions.push(subscription);

        if (this.presentationProvider.selectedParentContainer &&
        this.presentationProvider.selectedParentContainer.id) {
            this.selectPresentation(this.presentationProvider.selectedParentContainer);
        }
    }


    public selectPresentation(spreadContainer: PresentationParent) {
        if (this.canAddPresentation) {
            this.presentationProvider.getChildren(spreadContainer);
        }
    }

    get canAddPresentation() {
        return (
            this.cloudService.spreadDetails.myPermission === ParticipantEnum.CHIEF_HOST ||
            this.cloudService.spreadDetails.myPermission === ParticipantEnum.MANAGER ||
            this.cloudService.spreadDetails.myPermission === ParticipantEnum.GUEST
        );
    }

    public addContainer() {
        this.presentationProvider.presentationContainers.push({
            name: 'Test Presentation'
        } as any);
    }

    get isChiefHost(): boolean {
        return this.cloudService.isChiefHost;
    }

    get spreadId(): number {
        return this.cloudService.spreadId();
    }
}
