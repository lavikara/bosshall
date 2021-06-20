import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CloudEventComponent} from './event/event.component';
import {IncludeComponentModule} from '../../../components/include.component.module';
import {PresentationListSubComponent} from './event/presentation/list/list.component';
import {PresentationPreviewComponent} from './event/presentation/preview/preview.component';
import {CloudPresentationComponent} from './event/presentation/presentation.component';
import {CloudSubScreen1Component} from './event/screens/screen1/screen1.component';
import {ParticipantComponent} from './event/participants/participants.component';
import {ScreenComponent} from './event/screens/screen.component';
import {CommonModule} from '@angular/common';
import {MomentModule} from 'ngx-moment';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PipeModule} from '../../../../app/pipe/pipe.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
const routes: Routes = [
    {
        path: '',
        component: CloudEventComponent,
        children: [
            {
                path: '',
                component: ParticipantComponent
            },
            {
                path: 'participant',
                component: ParticipantComponent
            },
            {
                path: 'broadcast',
                component: ScreenComponent
            },
            {
                path: 'presentation',
                component: CloudPresentationComponent
            }
        ]
    }
];

@NgModule({
    declarations: [
        CloudEventComponent,
        PresentationPreviewComponent,
        PresentationListSubComponent,
        CloudSubScreen1Component,
        ScreenComponent,
        ParticipantComponent,
        CloudPresentationComponent],
    imports: [
        RouterModule.forChild(routes),
        IncludeComponentModule,
        CommonModule,
        MomentModule,
        ReactiveFormsModule,
        PipeModule,
        FormsModule,
        DragDropModule
    ],
    entryComponents: [],
    exports: [
        CloudEventComponent,
        PresentationListSubComponent,
        PresentationPreviewComponent,
        CloudSubScreen1Component,
        ScreenComponent,
        ParticipantComponent,
        CloudPresentationComponent
    ]
})

export class CloudModule {

}
