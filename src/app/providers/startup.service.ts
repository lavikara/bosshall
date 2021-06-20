import {Injectable} from '@angular/core';
import {RouteService} from './route.service';
import {ScreenMonitorService} from './screen-monitor.service';
import {AuthProvider} from './auth.provider';
import {EntitiesService} from './user/entities.service';
import {BrandService} from './brand/brand.service';
import {SpreadService} from './spread/spread.service';
import {NotificationService} from './user/notification.service';
import {Router} from '@angular/router';
import {ConnectionSocketProvider} from './socket/connection.socket.provider';
import {QueueService} from './queue.service';

@Injectable({
    providedIn: 'root'
})
export class StartupService {

    constructor(private routeService: RouteService,
                private entities: EntitiesService,
                private brandService: BrandService,
                private spreadService: SpreadService,
                private websocketService: ConnectionSocketProvider,
                private router: Router,
                private delayProvider: QueueService,
                private notificationService: NotificationService,
                private screenMonitorService: ScreenMonitorService,
                private authService: AuthProvider) {
    }

    public afterAuthentication() {
        this.entities.setup().then(r => {
            this.enableListeners();
            if (!this.routeService.authListener()) {
                this.router.navigate(['/bl/brand']);
            }
        });
    }

    public setup() {
        this.beforeAuthentication();
        this.authService.verify().then(r => {
            this.afterAuthentication();

        }).catch(error => {
            this.authService.signOut();
        });
    }

    private beforeAuthentication() {
        this.routeService.startListening();
        this.screenMonitorService.start();
    }

    private enableListeners() {
        /**
         * listeners here
         */
        this.spreadService.listeners();

        /**
         * setup here
         */
        this.brandService.setup();


        /**
         * enable websocket listeners
         */

        this.delayProvider.delay(() => {
            this.websocketService.connect();
            this.notificationService.setup();
        }, 2000);


        /**
         * enable HTML 5 audio notification sound
         */


    }
}
