import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { StartupService } from "./providers/startup.service";
import { NotificationProvider } from "./providers/notification.provider";
import { SwalComponent } from "@toverux/ngx-sweetalert2";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit {
    title = 'app';
    @ViewChild('mainSwal', { static: false }) private mainSwal: SwalComponent;
    @ViewChild('inputSwal', { static: false }) private inputSwal: SwalComponent;

    constructor(private startupService: StartupService,
        private notificationProvider: NotificationProvider) { }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.startupService.setup();
        this.notificationProvider.confirmSwal = this.mainSwal;
        this.notificationProvider.inputSwal = this.inputSwal;
    }
}
