import { NgModule } from '@angular/core';
import { HeaderIncComponent } from './header/header.component';
import { CommonModule } from '@angular/common';
import { VideoPlayerComponent } from './videoPlayer/videoPlayer.component';
import { CommentAddIncludeComponent } from './comment-add/comment.add.component';
import { CommentListIncludeComponent } from './comment-list/comment.list.component';
import { MomentModule } from 'ngx-moment';
import { LoadMoreIncludeComponent } from './load-more/load-more.component';
import { SpreadFlashIncludeComponent } from './spread-flash/spread-flash.component';
import { PlayerListIncludeComponent } from './player-list/player-list.component';
// import { FooterIncludeComponent as OldFooterIncludeComponent } from './footer/footer.component';
import { FooterComponent } from '../new-ui/footer/footer.component';
import { RouterModule } from '@angular/router';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { SpreadCreateIncludeComponent } from './spread-create/spread-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { HomeActivityIncludeComponent } from './home-activities/home-activities.component';
import { BrandContainerIncludeComponent } from './brand-containers/brand-container.component';
import { FilterPopupComponent } from './filter-popup/filter-popup.component';
import { VideoPlayerFilterComponent } from './video-player-filter/video-player-filter.component';
import { InterestContainer } from './interest-container/interest-container.component';
import { InterestContainerModalComponent } from './interest-container-modal/interest-container-modal.component';
import { ExternalWebsiteComponent } from './external-website/external-website.component';
import { BrandStoryComponent } from './brandStory/brandStory.component';
import { ConnectedAttendanceIncludeComponent } from './connected-attendance/connected-attendance.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
    MatBadgeModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatProgressBarModule,
    MatProgressSpinnerModule
} from '@angular/material';
import { LoadingInclComponent } from './loading-container/loading-container.include.component';
import { ArchwizardModule } from 'angular-archwizard';
import { PipeModule } from '../../app/pipe/pipe.module';
import { SearchUserComponent } from './search-user/search-user.component';
import { MatOptionModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ImageEditorComponent } from './image-editor/image-editor.component';
import { MatChipsModule } from '@angular/material/chips';
import { NotifierModule } from 'angular-notifier';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { PlayerSettingsComponent } from './player-settings/player-settings.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { PaginationContainerComponent } from './pagination-container/pagination-container.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { FlatpickrModule } from 'angularx-flatpickr';
import { TopNotificationComponent } from './top-notification/top-notification.component';
import { ArticleHeaderIncludeComponent } from './article-header/article-header.component';
import { AvatarUserIncludeComponent } from './avatar-user/avatar-user.component';
import { CloudThinSidebarIncludeComponent } from './cloud-thin-sidebar/cloud-thin-sidebar.component';
import { ParticipantsMessageIncludeComponent } from './participant-message/participants-message.component';
import { ParticipantListsComponent } from "./participant-lists/participant-lists.component";
import { SingleListAttendanceIncludeComponent } from "./single-list-attencance/single-list-attendance.component";
import { ComplexListAttendanceIncludeComponent } from "./complex-list-attendance.component/complex-list-attendance.component";
import { RepliesIncludeComponent } from "./replies/replies.component";
import { MultipleParticipantsIncludeComponent } from "./multple-participants/multiple-participants.component";
import { ScreenActionsIncludeComponent } from "./screen-actions/screen-actions.component";
import { UserVideoComponent } from './user-video/user-video.component';
import { BannerComponent } from './banner/banner.component';

@NgModule({
    declarations: [
        HeaderIncComponent,
        VideoPlayerComponent,
        PlayerSettingsComponent,
        CommentAddIncludeComponent,
        CommentListIncludeComponent,
        SpreadCreateIncludeComponent,
        VideoPlayerFilterComponent,
        SpreadFlashIncludeComponent,
        SearchUserComponent,
        PaginationContainerComponent,
        InterestContainer,
        InterestContainerModalComponent,
        ImageEditorComponent,
        HomeActivityIncludeComponent,
        BrandContainerIncludeComponent,
        FilterPopupComponent,
        TopNotificationComponent,
        BrandStoryComponent,
        ParticipantsMessageIncludeComponent,
        // OldFooterIncludeComponent,
        FooterComponent,
        LoadingInclComponent,
        SingleListAttendanceIncludeComponent,
        MultipleParticipantsIncludeComponent,
        ComplexListAttendanceIncludeComponent,
        PlayerListIncludeComponent,
        ArticleHeaderIncludeComponent,
        ScreenActionsIncludeComponent,
        AvatarUserIncludeComponent,
        CloudThinSidebarIncludeComponent,
        ParticipantListsComponent,
        ExternalWebsiteComponent,
        RepliesIncludeComponent,
        ConnectedAttendanceIncludeComponent,
        UserVideoComponent,
        LoadMoreIncludeComponent,
        BannerComponent],
    imports: [CommonModule, MomentModule,
        NgxSmartModalModule.forChild(),
        ArchwizardModule,
        HttpClientModule,
        MatFormFieldModule,
        MatSlideToggleModule,
        MatInputModule,
        MatOptionModule,
        MatIconModule,
        MatCardModule,
        MatBadgeModule,
        MatProgressSpinnerModule,
        PipeModule,
        MatProgressBarModule,
        MatAutocompleteModule,
        MatMenuModule,
        FlexLayoutModule,
        ReactiveFormsModule,
        FormsModule,
        SweetAlert2Module,
        HttpClientModule,
        RouterModule, MatChipsModule, PickerModule, NotifierModule, DragDropModule, MatExpansionModule, MatPaginatorModule, LazyLoadImageModule, FlatpickrModule],
    exports: [
        HeaderIncComponent,
        VideoPlayerComponent,
        CommentAddIncludeComponent,
        CommentListIncludeComponent,
        PaginationContainerComponent,
        BrandStoryComponent,
        SpreadCreateIncludeComponent,
        ParticipantListsComponent,
        FilterPopupComponent,
        ExternalWebsiteComponent,
        MultipleParticipantsIncludeComponent,
        TopNotificationComponent,
        ConnectedAttendanceIncludeComponent,
        InterestContainer,
        InterestContainerModalComponent,
        ComplexListAttendanceIncludeComponent,
        ParticipantsMessageIncludeComponent,
        // OldFooterIncludeComponent,
        FooterComponent,
        AvatarUserIncludeComponent,
        CloudThinSidebarIncludeComponent,
        VideoPlayerFilterComponent,
        LoadMoreIncludeComponent,
        ScreenActionsIncludeComponent,
        HomeActivityIncludeComponent,
        ImageEditorComponent,
        BrandContainerIncludeComponent,
        PlayerListIncludeComponent,
        ArticleHeaderIncludeComponent,
        SingleListAttendanceIncludeComponent,
        LoadingInclComponent,
        RepliesIncludeComponent,
        UserVideoComponent,
        SpreadFlashIncludeComponent,
        BannerComponent],
    entryComponents: [
        ImageEditorComponent,
        ArticleHeaderIncludeComponent,
        PlayerSettingsComponent,
        SpreadCreateIncludeComponent,
        SearchUserComponent,
        UserVideoComponent,
    ]
})


export class IncludeComponentModule {

}
