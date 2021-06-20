import {OpenVidu, Publisher, PublisherSpeakingEvent, Session, StreamEvent, StreamManager} from 'openvidu-browser';
import {CloudCapabilities} from '../stream.service';


export abstract class StreamProvider {
    private OV: OpenVidu;
    private session: Session;
    private _publisher: Publisher;
    private _subscribers: StreamManager[] = [];
    protected capabilities: any = {};
    private _streamBroadcasting = false;
    private publishingAudio = false;
    private publishingVideo = false;
    protected role: string;
    protected _myCapabilities: CloudCapabilities = {} as any;



    private mySessionId: string;
    private _screenName: string;

    private _mainStream: StreamManager;
    public constructor() {
        this.setupConnection();
    }

    protected abstract redirect(route);
    private setupConnection() {
        this.OV = new OpenVidu();
        this.session = this.OV.initSession();
    }

    public onPublisherPublished() {
        console.log('publisher published');
    }


    protected init() {
        this.setupConnection();
        this.connectSession();

        this.enableListeners();
        this.redirect('broadcast');

    }

    private publisherConfig() {
        return {
            audioSource: true,
            videoSource: true,
            publishAudio: this._myCapabilities.canAudio,
            publishVideo: this._myCapabilities.canVideo,
            resolution: '720x680',
            frameRate: 30,
            insertMode: 'APPEND',
            mirror: false
        };
    }


    /**
     * Connect Session
     */
    private connectSession() {
        this.session.connect(
            this.getToken(),
            {
                clientData: this._screenName
            }
        ).then(() => {
            this.publishFromCam();

        })
            // tslint:disable-next-line:no-shadowed-variable
            .catch((error: any) => {
                console.log('StreamProvider:connectSession error ');
                console.log(error);
                this.onError(error);
            });
    }

    private publishFromCam(audio = false, video = false) {
        const configuration = this.publisherConfig();
        this.publishingVideo = video || configuration.publishVideo;
        this.publishingAudio = audio || configuration.publishAudio;
        console.log('publisher information');
        console.log(configuration);
        const publisher: Publisher = this.OV.initPublisher(undefined, configuration);
        this.createPublisher(publisher);
    }


    private createPublisher(publisher: Publisher) {
        console.log('StreamProvider::createPublisher  published for user with publisher');
        console.log(publisher);
        // publisher.subscribeToRemote(true);
        this.session.publish(publisher);
        this._subscribers.push(publisher);
        this.updateMainStream(publisher);
        this._publisher = publisher;
        this._streamBroadcasting = true;
        this.onPublisherPublished();
    }



    /**
     * Toggle Feed
     */
    public  toggleFeed(publish: boolean = true) {
        this.publishingAudio = publish;
        this.publishingVideo = publish;
        this.unPublishPublisher(this._publisher);
        this._myCapabilities.canVideo = this.publishingVideo;
        this._myCapabilities.canAudio = this.publishingAudio;

        console.log('StreamProvider:toggleFeed ',
            'Publishing Audio ' + this.publishingAudio,
            'Publishing Video ' + this.publishingVideo);

        this.publishFromCam(this.publishingAudio, this.publishingVideo);
    }


    /**
     * Toggle Video
     */
    public toggleVideo() {
        this.publishingVideo = !this.publishingVideo;
        this._publisher.publishAudio(this.publishingVideo);
    }

    public toggleAudio() {
        this.publishingAudio = !this.publishingAudio;
        this._publisher.publishAudio(this.publishingAudio);
    }

    /**
     * Publishing screen
     */
    public shareScreen( callback: (error: any, publisher: Publisher | null) => void) {
        if (!this.session || !this.session.sessionId) {
            callback('You ust be broadcasting before presentation', null);
            return this.notification('warning', 'You must be broadcasting before presentation');
        }
        this.session.unpublish(this._publisher);
        const configuration = this.publisherConfig() as any;
        configuration.videoSource = 'screen';
        // configuration.filter = {
        //     video: {
        //         cursor: 'never'
        //     }
        // }
        const publisher = this.OV.initPublisher(undefined, configuration, (error) => {
            // tslint:disable-next-line:triple-equals
            if (error && error.name == 'SCREEN_EXTENSION_NOT_INSTALLED') {
                this.notification('error', error.message);
                // tslint:disable-next-line:triple-equals
            } else if (error && error.name == 'SCREEN_SHARING_NOT_SUPPORTED') {
                this.notification('error', 'Your browser does not support screen sharing');
                // tslint:disable-next-line:triple-equals
            } else if (error && error.name == 'SCREEN_EXTENSION_DISABLED') {
                this.notification('error', 'You need to enable screen sharing extension');
                // tslint:disable-next-line:triple-equals
            } else if (error && error.name == 'SCREEN_CAPTURE_DENIED') {
                this.notification('error', 'You need to choose a window or application to share');
            }
    });

        publisher.once('accessAllowed', (event) => {
            publisher.stream.getMediaStream().addEventListener('inactive', () => {
                this.publishFromCam();
            });

            this.createPublisher(publisher);
            if (callback && typeof  callback === 'function') {
                callback(null, publisher);
            }
        });


        publisher.once('accessDenied', (event) => {
            if (callback && typeof callback === 'function') {
                callback(event, publisher);
            }
            this.notification('error', 'Permission to published declined by user');
        });
    }

    /**
     * Unpublish outside session
     * @param publisher
     */
    public unPublishPublisher(publisher: Publisher) {
        this.session.unpublish(publisher);
        this.deleteSubscriber(publisher);
    }

    protected abstract notification(type: string, text: string);

    /**
     * @return void
     */
    private enableListeners() {
        this.session.on('streamCreated', (event: StreamEvent) => {
            const subscribe = this.session.subscribe(event.stream, undefined);
            this._subscribers.push(
                subscribe
            );
            this.updateMainStream(subscribe);
            this._streamBroadcasting = true;
            console.log('stream created');
            this.streamCreated(event);
        });

        this.session.on('streamDestroyed', (event: StreamEvent) => {
            console.log('stream destroyed');
            this.deleteSubscriber(event.stream.streamManager);
        });

        this.session.on('sessionDisconnected', (event: StreamEvent) => {
            this.streamDestroyed(event);
        });
        //

        //
        this.session.on('publisherStartSpeaking', (event) => {
            const target = event as PublisherSpeakingEvent;
            console.warn('publisher is speaking');
            if (target && target.streamId) {
                if (target.streamId === this._mainStream.stream.streamId) {
                    return;
                }
                this.subscribers.forEach((r) => {
                    if (r.stream.videoActive && r.stream.streamId === target.streamId) {
                        this._mainStream = r;
                        console.log('switching video');
                    }
                });
            }
        });
    }

    /**
     * Call to delete subscriber
     * @param stream
     */
    private deleteSubscriber(stream: StreamManager) {
        for (let i = 0; i < this._subscribers.length; i++) {
            // tslint:disable-next-line:triple-equals
            if (this._subscribers[i] == stream) {
                this._subscribers.splice(i, 1);
            }
        }
    }

    /**
     * Call whenever a stresam is created
     * @return void
     * @param event
     */
    protected abstract streamCreated(event: StreamEvent);

    /**
     * Calls whenever stream destroyed
     * @param event
     */
    protected abstract streamDestroyed(event: StreamEvent);

    /**
     * Call to get the token for connection
     */
    protected abstract getToken(): string;

    /**
     * Update the main stresam
     * @param stream
     */
    public updateMainStream(stream: StreamManager) {
        if (stream.stream.videoActive) {
            this._mainStream = stream;
        }
    }

    /**
     * Call whenever an error occurs
     * @param error
     */
    protected abstract onError(error: any);

    /**
     * Set the screen name
     * @param value
     */
    set screenName(value: string) {
        this._screenName = value;
    }

    /**
     * Get Publisher
     */
    get publisher(): StreamManager {
        return this._publisher;

    }

    /**
     * Get Subscribers
     */
    get subscribers(): StreamManager[] {
        return this._subscribers;
    }

    /**
     * Get the main stream
     */
    get mainStream(): StreamManager {
        return this._mainStream;
    }

    /**
     * Check if is publisher
     */
    protected abstract isPublisher(): boolean;

    /**
     * Leave session
     */
    public leaveSession() {
        if (this._publisher && this._publisher.stream) {
            this.session.unpublish(this._publisher);
        }
        if (this.session) {
            this.session.disconnect();
        }


        this._subscribers = [];
        this._publisher = {} as any;
        this.OV = {} as any;
        this.session = {} as any;
        this._streamBroadcasting = false;
        this._mainStream = {} as any;
        this._publisher = {} as any;
    }


    get sessionId() {
        return this.session.sessionId;
    }



    get streamBroadcasting(): boolean {
        return this._streamBroadcasting;
    }
}
