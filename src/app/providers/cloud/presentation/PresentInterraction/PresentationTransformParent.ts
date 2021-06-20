import {PresentationGuide} from '../presentation';
import {ApiProvider} from '../../../api.service';
import {Subscription} from 'rxjs';
import {PresentationAction} from './PresentationAction';
import {ConnectionSocketProvider} from '../../../socket/connection.socket.provider';
import {AuthProvider} from '../../../auth.provider';
import {appConfig} from '../../../../app.config';

export abstract class PresentationTransformParent {

    protected abstract presentationItems: PresentationGuide[];

    protected playingElement: HTMLVideoElement | HTMLAudioElement;

    /**
     * @param socketConnection
     * @param authProvider
     * @param apiProvider
     * @param autoStart
     * @param spreadId
     * @param isPresenter
     */
    constructor(
        protected socketConnection: ConnectionSocketProvider,
        protected authProvider: AuthProvider,
        protected apiProvider: ApiProvider,
        public autoStart = true,
        protected spreadId: number,
        protected isPresenter: boolean = true
    ) {
    }

    private presentId = 'present-1234';
    protected presentationEl: HTMLElement;
    private iframeContainerClass = 'media-frame';
    private started = false;
    protected timeoutInstance: any = null;
    protected presentationAction: PresentationAction;

    private static presentationStyle() {
        return {
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 2000,
            background: '#f5f5f5'
        };
    }

    protected static getFromTag(tag) {
        return tag.split('/')[0];
    }

    public onPresentationNext: any = (index) => {};
    public onPresentationDone: any = () => {};
    public onPresentationStart: any = () => {};
    public onPresentationReady: any = (autoStart: boolean) => {};

    /**
     * Attach presentation
     */
    private attachParentElement() {
        let presentationParent = document.querySelector('.presentation-parent');
        if (!presentationParent) {
            presentationParent = document.createElement('div');
            presentationParent.classList.add('presentation-parent');
        }

        this.presentationEl = document.createElement('div');
        this.presentationEl.id = this.presentId;
        presentationParent.appendChild(this.presentationEl);
        document.body.appendChild(presentationParent);
    }

    protected buildParentElement() {
        this.presentationEl = document.body.querySelector(`#${this.presentId}`);
        if (!this.presentationEl) {
            this.attachParentElement();
        }
        return this;
    }

    /**
     * public setup
     */
    public setup() {
        this.buildParentElement();
        this.expandContainer();
        return this;
    }

    /**
     * Expand Container
     */
    protected expandContainer() {
        if (!this.presentationEl) {
            throw new Error('Presentation container not found or has not been attached.');
        }

        Object.assign(this.presentationEl.style, PresentationTransformParent.presentationStyle());

        this.onPresentationReady(this.autoStart);
        if (this.autoStart) {
            this.startCycling(0);
            this.onPresentationStart();
        }
    }

    public start() {
        if (!this.autoStart && !this.started) {
            this.startCycling(0);
            this.onPresentationStart();
        }
    }

    protected fetchHead(url: string) {
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.requestType = 'post';
        this.apiProvider.url = '/presentation/head/inspect/url';
        return this.apiProvider.getUrl({url});
    }

    protected abstract startCycling(index: number);

    /**
     * End Presentation
     */
    protected endPresentation() {
        if (this.presentationEl && this.presentationEl.parentNode) {
            this.presentationEl.parentNode.removeChild(this.presentationEl);
        }
        this.presentationItems = {} as any;
        this.onPresentationDone();
        this.onStop();
    }

    public stop() {
        this.endPresentation();
    }

    protected abstract sendPresentationFiles(presentationGuide: PresentationGuide, tag: 'video' | 'image' | 'audio');

    /**
     * @param presentationGuide
     * @param tag
     */
    protected attachElement(presentationGuide: PresentationGuide, tag: 'video' | 'image' | 'audio' = 'image') {

        /**
         * Send Presentation File
         */
        this.sendPresentationFiles(presentationGuide, tag);

        /**
         * Container class
         */
        const frameContainer = document.createElement('div');
        frameContainer.classList.add(this.iframeContainerClass);

        /**
         * element name for the iframe container
         */
        const elementName = document.createElement('h2');
        elementName.innerHTML = presentationGuide.name;


        /**
         * Create depending on type
         */

        let mediaContent: any = {} as any;
        switch (tag) {
            case 'audio':
                mediaContent = document.createElement('audio');
                mediaContent.preload = 'metadata';
                this.playingElement = mediaContent;
                mediaContent.setAttribute('autoplay', true);
                if (this.isPresenter) {
                    this.addMediaListeners(mediaContent);
                }
                break;
            case 'image':
                mediaContent = document.createElement('img');
                break;
            case 'video':
                mediaContent = document.createElement('video');
                if (this.isPresenter) {
                    mediaContent.controls = true;
                }
                mediaContent.setAttribute('autoplay', true);
                this.playingElement = mediaContent;
                if (this.isPresenter) {
                    this.addMediaListeners(mediaContent);
                }
                break;
        }
        mediaContent.classList.add('media-player');
        if (!presentationGuide.media.startsWith('http')) {
            presentationGuide.media = `${appConfig.host}${presentationGuide.media}`;
        }
        mediaContent.src = presentationGuide.media;
        frameContainer.appendChild(mediaContent);
        frameContainer.appendChild(elementName);
        return frameContainer;
    }

    private addMediaListeners(el: Element) {
        el.addEventListener('seeking', (event: any) => {
            this.onSeek(event);
        });

        el.addEventListener('pause', (event: any) => {
            this.onMediaPause(event);
        });

        el.addEventListener('volumechange', (event: Event) => {
            this.onVolumeChange(event);
        });

        el.addEventListener('play', (event: Event) => {
            this.presentationAction.play();
        });
    }

    /**
     * @param event
     */
    private onMediaPause(event: any) {
        this.presentationAction.pause();
    }

    protected abstract onVolumeChange(event: any);

    protected abstract onStop();


    protected abstract onSeek(event: any);

}
