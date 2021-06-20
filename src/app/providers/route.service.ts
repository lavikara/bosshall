import {Injectable} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {QueueService} from './queue.service';
import {AuthProvider} from './auth.provider';
import {LoadingService} from './loading.service';

@Injectable({
    providedIn: 'root'
})
export class RouteService {

    private currentUrl = '';
    private nextUrl = '';

    constructor(
        private route: Router,
        private activatedRouter: ActivatedRoute,
        private loading: LoadingService
    ) {
    }


    public startListening() {
        this.route.events.subscribe((r: any) => {
            if (r && r.url) {
                window.scrollTo({top: 0, behavior: 'smooth'});
                this.currentUrl = r.url;
                if (this.activatedRouter.snapshot.queryParamMap.get('join')) {
                    this.nextUrl = '/bl/brand/event/' + this.activatedRouter.snapshot.queryParamMap.get('join');
                    this.authListener();
                }
            }
        });
    }

    public authListener() {
        if (this.nextUrl && this.nextUrl.length > 4) {
            this.loading.startLoading(true);

            setTimeout(() => {
                if (this.nextUrl && this.nextUrl.length > 4) {
                    this.route.navigate([this.nextUrl]).then(r => this.nextUrl = null).catch(e => console.error(e));

                }
                this.loading.stopLoading();
        }, 10000);
        }

        return this.nextUrl.length > 4;
    }


    public isUrl(url: Array<string>) {
        return url.indexOf(this.currentUrl) > -1;
    }

}
