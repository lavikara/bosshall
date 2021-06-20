import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitationsComponent } from './invitations/invitations.component';
import {RouterModule, Routes} from '@angular/router';
import {IncludeComponentModule} from '../../../components/include.component.module';
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {PipeModule} from "../../../../app/pipe/pipe.module";
import {MomentModule} from "ngx-moment";
import {LazyLoadImageModule} from "ng-lazyload-image";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {FlexModule} from "@angular/flex-layout";
import {MatButtonModule} from "@angular/material/button";

const routes: Routes = [
  {
    path: ':id/invitations',
    component: InvitationsComponent
  }
];

@NgModule({
  declarations: [InvitationsComponent, InvitationsComponent],
    imports: [
        CommonModule, IncludeComponentModule,
        RouterModule.forChild(routes), MatTableModule, MatSortModule, PipeModule, MomentModule, LazyLoadImageModule, ReactiveFormsModule, MatInputModule, MatGridListModule, MatIconModule, FlexModule, MatButtonModule
    ]
})
export class SpreadModule { }
