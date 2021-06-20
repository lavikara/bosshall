import {Injectable} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';

@Injectable({
    providedIn: 'root'
})
export class ScreenMonitorService {
    private isSmallScreen: boolean;

    constructor(private breakpointObservable: BreakpointObserver) {
    }

    get smallScreen(): boolean {
        return this.breakpointObservable.isMatched('(max-width: 1280px)');
    }

    public start() {
        this.breakpointObservable.observe([
            Breakpoints.Medium,
            Breakpoints.Small,
            Breakpoints.HandsetPortrait,
            Breakpoints.Tablet
        ]).subscribe(r => {
            if (r.matches) {

            }
        });
    }
}
