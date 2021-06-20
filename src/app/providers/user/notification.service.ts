import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {Subject, Subscription} from 'rxjs/index';
import {AuthProvider} from '../auth.provider';
import {NotifierService} from 'angular-notifier';
import {ConnectionSocketProvider} from '../socket/connection.socket.provider';
import {NotificationProvider} from '../notification.provider';
import {Router} from '@angular/router';

@Injectable({
    providedIn: 'root'
})


export class NotificationService {
    private notificationAudio: HTMLAudioElement;
    private statusInt = 0;
    private subscriptions: Subscription[] = [];

    constructor(private snackBar: MatSnackBar,
                private connectionSocket: ConnectionSocketProvider,
                private notifier: NotifierService,
                private router: Router,
                private notificationProvider: NotificationProvider,
                private authProvider: AuthProvider) {
    }


    public setup() {
        this.notificationAudio = new Audio('./assets/sound/notification.mp3');
        this.listeners();
    }

    public message(message: string, button, pressed: (value) => any, delay?: number) {

        const notify = this.snackBar.open(message, button, {
            duration: (delay ? delay : 0)
        });

        const subscription: Subscription = notify.onAction().subscribe(r => {
            if (pressed) {
                pressed(r);
            }
        }).add(r => {
            subscription.unsubscribe();
        });
    }


    public notifierMessage(type: string, message: string) {
        this.statusInt += 1;
        this.notifier.show({
            id: '__status_' + this.statusInt,
            type,
            message
        });
        return '__status_' + this.statusInt;
    }


    public triggerSound() {
        if (this.authProvider.user.receiveSound) {
            this.notificationAudio.play();
        }

    }

    public listeners() {
        const spreadNotifier = new Subject<any> ();
        this.connectionSocket.setObservable('Spread', spreadNotifier);
        const spreadNotifierSub = spreadNotifier.subscribe(r => {

            if (r.data && r.data.name === 'publisher') {
                console.log('subscription');
                this.notificationProvider.confirmSwal.options = {
                    title: 'Join Spread?',
                    type: 'question',
                    text: 'A spread you subscribed to ' + r.data.content.name + ' is cucrrently airing. Would you like to join?',
                    confirmButtonText: 'Join',
                    cancelButtonText: 'No. Thanks',
                    showCancelButton: true,
                    showConfirmButton: true
                };

                this.notificationProvider.confirmSwal.show();
                const sub = this.notificationProvider.confirmSwal.confirm.subscribe(e => {
                    if (e) {
                        this.router.navigate(['/bl/brand/event/' + r.data.content.id]);
                    }
                }).add(() => {
                    sub.unsubscribe();
                    this.notificationProvider.confirmSwal.nativeSwal.close();
                });
            }
        });

        this.subscriptions.push(spreadNotifierSub);
    }
}
