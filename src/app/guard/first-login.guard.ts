import {Injectable} from '@angular/core';
import {CanLoad, Route, Router, UrlSegment} from '@angular/router';
import {Observable} from 'rxjs';
import {AuthProvider} from '../providers/auth.provider';

@Injectable({
    providedIn: 'root'
})
export class FirstLoginGuard implements CanLoad {
    constructor(private authProvider: AuthProvider, private router: Router) {

    }

    canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        if (this.authProvider.recorded) {
            return true;
        } else {
            // this.router.navigate(['/bl/profile']); // TODO
            this.router.navigate(['/bl/profile']);
        }
    }

}
