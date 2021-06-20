import {Injectable} from '@angular/core';
import makeWebSocketObservable, {GetWebSocketResponses, WebSocketOptions} from 'rxjs-websockets';
import {appConfig} from '../../app.config';
import {AuthProvider} from '../auth.provider';
import {Observable, Subject, Subscription} from 'rxjs';
import {delay, retryWhen, share, switchMap} from 'rxjs/operators';
import {QueueingSubject} from 'queueing-subject';
import {NotificationProvider} from '../notification.provider';


@Injectable({
    providedIn: 'root'
})

export class ConnectionSocketProvider {
    private connection: any = {} as any;
    private input$: QueueingSubject<any> = new QueueingSubject();
    private message: Observable<any> = new Observable<any>();
    private messageSubscription: Subscription;
    private externalListeners: Array<{name: string, listener: Subject<any>}> = [];
    constructor(private authProvider: AuthProvider, private notificationProvider: NotificationProvider) {
    }
    public connect() {
        const options: WebSocketOptions = {
            makeWebSocket: (url: string, protocols?: string | string[]) =>
                new WebSocket(url, protocols),
            protocols: [this.authProvider.token],
        };

        this.connection = makeWebSocketObservable(appConfig.socket, options);
        this.input$ = new QueueingSubject<string> ();


        this.message = this.connection.pipe(
            switchMap((getResponses: GetWebSocketResponses) => {
                return getResponses(this.input$);
            })
            ,
            share(),
            retryWhen(errors => errors.pipe(delay(1000))),
        );


        this.messageSubscription = this.message.subscribe({
            next: (response) => {
                try {
                    response = JSON.parse(response);
                    if (response.statusCode > 299 && response.statusCode < 599 && response.user === this.authProvider.user.id) {
                        this.notificationProvider.confirmSwal.options = {
                            title: 'Comment',
                            text: response.statusText,
                            showConfirmButton: true,
                            showCancelButton: false
                        };
                        this.notificationProvider.confirmSwal.show();
                    }

                    this.externalListeners.forEach((e) => {
                        if (response && response.event === e.name ) {
                            e.listener.next(response);
                        }

                    });
                } catch (e) {

                }

            },
            error: (error) => {

            }

        });
    }

    public close(connectionId) {
       if (!this.connection) {

       }
       this.messageSubscription.unsubscribe();
       this.connection.close();
    }

    public heartBeat(connectionId) {
        this.send( 'ping', '', {});
    }


    public send(parentEvent, event, message) {
        if (!this.connection) {
            return;
        }

        this.input$.next(JSON.stringify({
            event: parentEvent,
            data: {
                name: event,
                content: message
            }
        }));
    }

   public setObservable(name: string, observable: Subject<any>) {
        this.externalListeners.push({
            name, listener: observable
        });
   }

}
