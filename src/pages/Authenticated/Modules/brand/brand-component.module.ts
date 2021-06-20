import {NgModule} from '@angular/core';
import {BrandComponent} from './brand-component';
import {IncludeComponentModule} from '../../../components/include.component.module';
import {RouterModule, Routes} from '@angular/router';
import {BrandProfileEditComponent} from './brand-profile-edit/brand-profile-edit-component';
import {BrandPageComponent} from './brandPage/brandPage.commponent';
import {BrandProfileComponent} from './brand-profile/brand-profile-component';
import {CommonModule} from '@angular/common';
import {MomentModule} from 'ngx-moment';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {
    MatBadgeModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSelectModule
} from '@angular/material';
import {FlexLayoutModule} from '@angular/flex-layout';
import {PipeModule} from '../../../../app/pipe/pipe.module';
import {PickerModule} from '@ctrl/ngx-emoji-mart';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatListModule} from '@angular/material/list';
import {AuthenticatedGuard} from '../../../../app/guard/authenticated.guard';

const routes: Routes = [{
    path: '',
    component: BrandComponent,
    children: [
        {
            path: '',
            canActivate: [AuthenticatedGuard],
            component: BrandPageComponent
        }, {
            path: 'create',
            canActivate: [AuthenticatedGuard],
            component: BrandProfileEditComponent
        }, {
            path: 'profile',
            canActivate: [AuthenticatedGuard],
            component: BrandProfileComponent
        }, {
            path: 'edit/:id',
            canActivate: [AuthenticatedGuard],
            component: BrandProfileEditComponent
        }]
}];

@NgModule({
    declarations: [BrandComponent, BrandPageComponent, BrandProfileComponent, BrandProfileEditComponent],
    imports: [FormsModule,
        MatMenuModule,
        PipeModule,
        MatIconModule,
        FlexLayoutModule,
        MatInputModule,
        MatSelectModule,
        MatFormFieldModule,
        MatBadgeModule,
        MatPaginatorModule,
        ReactiveFormsModule,
        IncludeComponentModule,
        SweetAlert2Module,
        RouterModule.forChild(routes), CommonModule, MomentModule, PickerModule, LazyLoadImageModule, DragDropModule, MatProgressSpinnerModule, MatListModule],
    exports: [BrandComponent, BrandPageComponent, BrandProfileComponent, BrandProfileEditComponent]
})


export class BrandComponentModule {

}
