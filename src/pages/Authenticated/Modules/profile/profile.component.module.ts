import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserProfileComponent} from './edit-profile/user-profile.component';
import {RouterModule, Routes} from '@angular/router';
import {ProfileComponent} from './profile.component';
import {ProfileSettingsComponent} from './profile-settings/profile-settings.component';
import {IncludeComponentModule} from '../../../components/include.component.module';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PipeModule} from '../../../../app/pipe/pipe.module';
import {MatChipsModule} from '@angular/material/chips';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MyspreadComponent} from './myspread/myspread.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {LightboxModule} from "ngx-lightbox";

const routes: Routes = [{
    path: '',
    component: ProfileComponent,
    children: [{
        path: '',
        component: UserProfileComponent
    }, {
        path: 'edit',
        component: UserProfileComponent
    }, {
        path: 'settings',
        component: ProfileSettingsComponent
    }, {
        path: 'spread',
        component: MyspreadComponent
    }]
}
];

@NgModule({
    declarations: [UserProfileComponent, ProfileComponent, ProfileSettingsComponent, MyspreadComponent],
    imports: [CommonModule,LightboxModule, RouterModule.forChild(routes), IncludeComponentModule,
        SweetAlert2Module, MatFormFieldModule, MatInputModule, ReactiveFormsModule,
        PipeModule, FlexLayoutModule,
        FormsModule, MatSelectModule, MatOptionModule, MatChipsModule, MatPaginatorModule, DragDropModule],
    exports: [UserProfileComponent, ProfileComponent, ProfileSettingsComponent, MyspreadComponent]
})

export class ProfileComponentModule {

}
