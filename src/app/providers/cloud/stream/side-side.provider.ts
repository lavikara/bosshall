import {StreamProvider} from './stream-provider';
import {StreamEvent} from 'openvidu-browser';

export class SideSideProvider extends StreamProvider {

    public onNotification: (type: string, text: string) => void = (type: string, text: string) => {};
    public onErrorReceived: (error: any) => void = (error: any) => {};
    public onRedirect:(route: any) => void = (route: any) => {};
    public onStreamCreated: (event: StreamEvent) => any = (event: StreamEvent) => {};
    public onStreamDestroyed: (event: StreamEvent) => any = (event: StreamEvent) => {};

    constructor(
        private token: string,
        private broadcaster: boolean) {
        super();
    }
    protected getToken(): string {
        return this.token;
    }

    public setup() {
        this.init();
    }

    protected isPublisher(): boolean {
        return this.broadcaster;
    }

    protected notification(type: string, text: string) { this.onNotification(type, text); }

    protected onError(error: any) { this.onErrorReceived(error); }

    protected redirect(route) { this.onRedirect(route); }

    protected streamCreated(event: StreamEvent) {this.onStreamCreated(event); }

    protected streamDestroyed(event: StreamEvent) {
        for (let i = 0; i < this.subscribers.length; i++) {
            if (event.stream.streamId === this.subscribers[i].stream.streamId) {
                this.subscribers.splice(i, 1);
            }
        }
        this.onStreamDestroyed(event); }

}
