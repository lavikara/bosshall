import {UiOption} from '../UiOption';
import {RecorderUI} from './RecorderUI';
import {RecordingUploader} from './RecordingUploader';
import {ApiProvider} from '../api.service';
import {Subscription} from 'rxjs';
declare var MediaRecorder: any;

export class Recorder implements RecorderListener, RecorderAction, RecordingUploader, PresentationRecorder {
    private mainTimeoutInstance: any;
    private mediaRecorder: any;
    private sideTimeout: any;
    private mainVideo: any;
    private mediaOption: any = {};
    private recordedFile: Blob;
    private ui: RecorderUI;
    private _spreadId = 0;
    private remoteFileUrl: string;
    private requestDownload = false;
    private canvasStream: MediaStream;
    private canvasContext: CanvasRenderingContext2D;
    private mediaListenerChunk: any = [];
    public offScreenVideo: HTMLVideoElement = {} as any;

    /**
     * Once the upload button is pressed
     * @param file
     * @param spreadId
     */
    public uploadRecorded: (file: Blob, spreadId: number) => void = (file: Blob, spreadId: number) => {};

    /**
     * Triggered when recording has completed
     * @param file
     * @param spreadId
     */
    public onComplete: (file: Blob, spreadId: number) => void = (file: Blob, spreadId: number) => {};

    /**
     * Upload failed
     * @param res
     */
    public onError: (res: string) => void = (res: string) => {};

    /**
     * called on start
     */
    public onStartPlaying: () => void = () => {};

    /**
     * Trigger after uploading as been finalized
     * @param event
     */
    onUploaded: (event) => void = (event: string) => {};

    /**
     *
     * @param spreadName
     * @param apiProvider
     */

    constructor( private apiProvider: ApiProvider, private spreadName?: string) {
        if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
            this.mediaOption = {mimeType: 'video/webm; codecs=vp9'};
        } else if (MediaRecorder.isTypeSupported('video/mp4')) {
            this.mediaOption = { mimeType : 'video/mp4' };
        } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
            this.mediaOption = { mimeType: 'video/webm;codecs=vp8'};
        }
        this.ui = new RecorderUI();
    }

    /**
     * @param value
     */
    set spreadId(value: number) {
        this._spreadId = value;
    }


    /**
     * Pause
     */
    pause() {
       this.mediaRecorder.pause();
    }

    /**
     * InitMediaRecorder
     */
    private initMediaRecorder() {
        this.mediaRecorder = new MediaRecorder(this.canvasStream, this.mediaOption);
    }

    /**
     * Setup the class
     * @param resource
     * @param audioTracks
     */
    setup(resource: HTMLVideoElement, audioTracks: any) {
        if (this.canvasStream && this.canvasStream.active) {
            return;
        }
        clearTimeout(this.mainTimeoutInstance);
        const canvas: HTMLCanvasElement  = document.querySelector('.js-canvas');
        this.canvasContext = (canvas as any).getContext('2d');
        this.canvasStream = (this.canvasContext.canvas as any).captureStream();

        if (audioTracks && audioTracks.length) {
            audioTracks.forEach((audioTrack) => {
                this.canvasStream.addTrack(audioTrack);
            });
        }


        this.initMediaRecorder();
        this.setupListeners();
        this.onStartPlaying();


        canvas.height = resource.videoHeight;
        canvas.width = resource.videoWidth;

        this.mainVideo = resource;
        this.videoLoop();
         this.mainVideo.addEventListener('ended', (event) => {
                this.ui.endRecording(event);
                this.mediaRecorder.stop();
            });

            this.ui.addListener('startRecording', (event) => this.mediaRecorder.start());
            this.ui.addListener('pushFile', (event) => this.uploadRecorded(this.recordedFile, this._spreadId));
            this.ui.addListener('downloadFile', (event) => this.downloadFile(this.recordedFile));
            this.ui.addListener('endRecording', (event) => this.mediaRecorder.stop());


        return this;
    }

    private videoLoop() {
        this.mainTimeoutInstance = setTimeout(() => {
            if (!this.mainVideo.paused && !this.mainVideo.ended) {
                this.canvasDraw(this.mainVideo, this.mainVideo.videoWidth, this.mainVideo.videoHeight);
                this.videoLoop();
            }
        }, 1000 / 30);
    }

    /**
     * Trigger download dialog
     */
    private triggerDownloadDialog() {
        this.onUploaded(this.remoteFileUrl);
        const link = document.createElement('a');
        link.setAttribute('href', 'javascript:void(0)');
        link.setAttribute('onclick', `window.open('${this.remoteFileUrl}')`);
        link.setAttribute('download', (this.spreadName ? `${this.spreadName}.mp4` : 'Recording.mp4'));
        link.click();
        this.requestDownload = false;
        this.ui.update('');
    }

    /**
     * @param file
     */
    private downloadFile(file: Blob) {
        this.ui.update(`Saving in progress. Wait...`);
        if (this.remoteFileUrl && this.remoteFileUrl.length) {
            return this.triggerDownloadDialog();
        }
        this.uploadStaticFile(file).then((r: any) => {
                if (r && r.length) {
                    this.remoteFileUrl = r;
                    this.triggerDownloadDialog();
                }
            }).catch((error) => {
                if (error && error.statusText) {
                    this.onError(error.statusText);
                }
            });
    }


    /**
     * Upload file
     * @param blob
     */
    public uploadStaticFile(blob: Blob) {
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.url = '/static/file';
        this.apiProvider.requestType = 'post';
        const file = new FormData();
        file.append('file', blob);
        return new Promise((resolve, reject) => {
            const subscription: Subscription = this.apiProvider.getUrl(file).subscribe(r => {
                if (r && r.data && r.data.path) {
                    return resolve(r.data.path);
                } else {
                    reject('');
                }
            }).add(() => {
                subscription.unsubscribe();
            });
        });
    }

    /**
     * Setup listeners
     */
    setupListeners() {
        this.mediaRecorder.addEventListener('dataavailable', (e) => {
            this.mediaListenerChunk.push(e.data);
            console.log(this.mediaListenerChunk);
        });

        this.mediaRecorder.addEventListener('stop', (e) => {
            this.recordedFile = new Blob(this.mediaListenerChunk, {type: 'video/mp4'});
            this.onComplete(this.recordedFile, this._spreadId);
            console.log(this.recordedFile);
        });

        this.mediaRecorder.addEventListener('error', (e) => {
            console.log('media recorder error');
            console.log(e);
        });
    }


    /**
     * Loop through the recording
     */
    private canvasDraw(resourceVideo: HTMLVideoElement | HTMLImageElement, width: number, height: number) {
        const imageData = this.getImageData(resourceVideo, width, height);
        if (imageData) {
            this.canvasContext.putImageData(imageData, 0, 0);
        }
    }


    /**
     *
     * @param resourceEl
     * @param width
     * @param height
     */
    private getImageData(resourceEl: HTMLVideoElement | HTMLImageElement, width: number, height: number) {
        const canvas = document.createElement('canvas');
        const prevWidth = width || (resourceEl as any).videoWidth;
        const prevHeight = height || (resourceEl as any).videoWidth;

        width = this.canvasContext.canvas.width;
        height = (prevHeight * this.canvasContext.canvas.width) / prevWidth;


        canvas.width = width;
        canvas.height = height;
        const offScreenCanvas = canvas.getContext('2d');
        resourceEl.setAttribute('crossOrigin', 'Anonymous');
        offScreenCanvas.drawImage(resourceEl, 0, 0, width, height);
        if (canvas.width > 0) {
            return offScreenCanvas.getImageData(0, 0, width, height);
        }

        return false;
    }

    /**
     * Stop the recording and the video
     */
    stop() {
        this.mediaRecorder.stop();
    }

    /**
     * @param container
     * @param drawOption
     */
    draw(container: HTMLElement, drawOption?: UiOption) {
        this.ui.draw(container, drawOption);
    }

    start() {
       this.mediaRecorder.resume();
    }

    stopVideo() {
      //  this.addAudioTrack(this.mainVideo.audioTracks);
      //   if (!this.offScreenVideo.classList) {
      //       this.offScreenVideo = document.createElement('video');
      //       this.offScreenVideo.muted = false;
      //       this.offScreenVideo.classList.add('hidden');
      //       document.body.appendChild(this.offScreenVideo);
      //   }
      //   this.offScreenVideo.src = this.mainVideo.src;
      //   this.offScreenVideo.volume = 1;
      //   this.offScreenVideo.play().then(() => {});
        clearTimeout(this.mainTimeoutInstance);
    }

    resumeVideo() {
        this.videoLoop();
        // this.offScreenVideo.pause();
        // this.offScreenVideo.src = null;
        // this.offScreenVideo.parentNode.removeChild(this.offScreenVideo);
       // this.removeAudioTracks(this.mainVideo.audioTracks);
    }

    /**
     * @param audioTracks
     */
    addAudioTrack(audioTracks: MediaStreamTrack[]) {
        for ( let i = 0; i < audioTracks.length; i++) {
            audioTracks[i].enabled = true;
            this.canvasStream.addTrack(audioTracks[i]);
        }
    }

    drawPresentation(element: HTMLImageElement|HTMLVideoElement) {
        clearTimeout(this.mainTimeoutInstance);
        clearInterval(this.sideTimeout);
        if (element.tagName === 'IMG') {
            this.canvasContext.clearRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
            this.sideTimeout = setInterval(
                () => {
                    this.canvasDraw(element, element.width, element.height);
                },
                1000 / 30);
        } else  if (element.tagName === 'VIDEO') {
            this.canvasContext.clearRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height);
            this.sideTimeout = setInterval(
                () => {
                    this.canvasDraw(element, element.width, element.height);
                },
                1000 / 30);
            element.addEventListener('ended', () => {
                clearInterval(this.sideTimeout);
            });
        }
    }

    removeAudioTracks(tracks: MediaStreamTrack[]) {
        for (let i = 0; i < tracks.length; i++) {
            this.canvasStream.removeTrack(tracks[i]);
        }
    }

    stopPresentation() {
        clearInterval(this.sideTimeout);
    }

}
