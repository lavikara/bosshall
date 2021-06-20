import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class QueueService {
    private delayInstance: any = false;

    delay = (callback: () => any, seconds: number): any => {
        if (!this.delayInstance) {
            this.delayInstance = setTimeout(() => {
                callback();
                clearTimeout(this.delayInstance);
                this.delayInstance = false;
            }, seconds);
        }
    };
}
