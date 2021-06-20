import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {AuthenticatedComponent} from './authenticatedComponent.component';
import {IncludeComponentModule} from '../components/include.component.module';
import {MomentModule} from 'ngx-moment';
import {FirstLoginGuard} from '../../app/guard/first-login.guard';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule, MatInputModule} from '@angular/material';
import {MatBadgeModule} from '@angular/material/badge';
import {PickerModule} from '@ctrl/ngx-emoji-mart';
import {PipeModule} from '../../app/pipe/pipe.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {DragDropModule} from '@angular/cdk/drag-drop';


const routes: Routes = [{
    path: '',
    component: AuthenticatedComponent,
    children: [{
        path: 'cloud/:id',
        loadChildren: './Modules/cloud/cloud.module#CloudModule',
        canLoad: [FirstLoginGuard]
    }, {
        path: 'brand',
        loadChildren: './Modules/brand/brand-component.module#BrandComponentModule',
        canLoad: [FirstLoginGuard]
    }, {
        path: 'profile',
        loadChildren: './Modules/profile/profile.component.module#ProfileComponentModule'
    }, {
        path: 'spread',
        loadChildren: './Modules/spread/spread.module#SpreadModule'
    }]
}];

@NgModule({
    declarations: [AuthenticatedComponent],
    imports: [CommonModule, RouterModule.forChild(routes), IncludeComponentModule,
        MomentModule, FormsModule, ReactiveFormsModule, MatFormFieldModule,
        FlexLayoutModule,
        MatInputModule, MatBadgeModule, PickerModule, PipeModule, DragDropModule],
    exports: [AuthenticatedComponent]
})

export class AuthenticatedComponentModule {

}
