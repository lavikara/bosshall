import {UInterface} from '../UInterface';
import {UiOption} from '../UiOption';
import {UIListener} from '../UIListener';
import {UIListenerOption} from '../UIListenerOption';

export class RecorderUI implements UInterface, UIListener {


    constructor() {
        this.started = true;
        this.ui = RecorderUI.createElement('div', 'js-record-container');

        this.leftContainer = RecorderUI.createElement('div', 'js-left-container');
        const rightContainer = RecorderUI.createElement('div', 'js-right-container');
        this.ui.appendChild(this.leftContainer);
        this.ui.appendChild(rightContainer);



        const projectName = RecorderUI.createElement('div', 'project-name');
        projectName.innerText = `${this.projectName}`;
        this.leftContainer.appendChild(projectName);

        const spinner = document.createElement('mat-spinner');
        rightContainer.appendChild(spinner);

        this.divCounter = RecorderUI.createElement('div', 'recorder-text');
        this.leftContainer.appendChild(this.divCounter);

        this.setupButtons();
    }

    private leftContainer: HTMLElement;
    private ui: HTMLElement;
    private divCounter: HTMLElement;
    private downloadButton: HTMLElement;
    private startRecordingButton: HTMLElement;
    private endRecordingButton: HTMLElement;
    private stopRecordingButton: HTMLElement;
    private publishFileButton: HTMLElement;
    private pauseButton: HTMLElement;
    private isRecording = false;
    private recordingPause = false;
    private recordingEnded = false;
    private projectName = 'Bosshall Media Recorder v0.01';
    private recordingDuration = 0;
    private timeoutCounterInstance: any;
    private closeButton: HTMLElement;
    public started = false;


    private allowedListeners = [
        'downloadFile',
        'startRecording',
        'stopRecording',
        'endRecording',
        'pushFile',
        'paused',
        'play'
    ];

    private listeners: Array<UIListenerOption> = [];

    /**
     * @param tag
     * @param cssClass
     */
    static createElement(tag: string, cssClass: string): HTMLElement {
        const el = document.createElement(tag);
        el.classList.add(cssClass);
        return el;
    }

    /**
     * @param duration
     */
    public static convertToSecMin(duration) {
        const minutes = Math.floor((duration % 3600) / 60) + '';
        const year = Math.floor(duration / 3600) + '';
        const secs = (duration % 60) + '';
        // tslint:disable-next-line:max-line-length
        return `${year.length > 1 ? year : '0' + year}:${minutes.length > 1 ? minutes : '0' + minutes}:${secs.length > 1 ? secs : '0' + secs}`;
    }

    private redraw() {

        /**
         * Update the startRecording
         */
        if (this.isRecording) {
            this.startRecordingButton.classList.add('hidden');
            this.endRecordingButton.classList.remove('hidden');
            this.pauseButton.classList.remove('hidden');
        } else {
            this.pauseButton.classList.add('hidden');
            this.startRecordingButton.classList.remove('hidden');
        }

        if (this.recordingPause) {
            this.startRecordingButton.classList.add('hidden');
        }

        if (!this.isRecording) {
            this.startRecordingButton.classList.remove('hidden');
            this.downloadButton.classList.add('hidden');
            this.stopRecordingButton.classList.add('hidden');
            this.endRecordingButton.classList.add('hidden');
        }

        if (this.recordingEnded) {
            this.startRecordingButton.classList.add('hidden');
            this.stopRecordingButton.classList.add('hidden');
            this.endRecordingButton.classList.add('hidden');
            this.pauseButton.classList.add('hidden');
        }

        if (!this.recordingEnded) {
            this.publishFileButton.classList.add('hidden');
        }

        if (this.recordingEnded && this.isRecording) {
            this.publishFileButton.classList.remove('hidden');
            this.downloadButton.classList.remove('hidden');
        }
    }

    /**
     * @param event
     */
    public onStartPlaying(event: any) {
        if (!this.recordingEnded) {
            this.isRecording = true;
            this.redraw();
            this.countingDuration();
            this.callListener('startRecording', event);
        }

    }

    /**
     * pause and play
     */
    public pause() {
        if (!this.recordingPause) {
            this.recordingPause = true;
            this.redraw();
            this.stopCounter();
            this.update('Paused...');
            this.callListener('paused', {});
        } else {
            this.recordingPause = false;
            this.redraw();
            this.countingDuration();
            this.callListener('play', {});

        }
    }


    /**
     * Counting duration
     */
    private countingDuration() {
        clearTimeout(this.recordingDuration);
        this.timeoutCounterInstance = setTimeout(() => this.countingDuration(), 1000);
        this.recordingDuration++;
        this.divCounter.innerText = `Recording ${RecorderUI.convertToSecMin(this.recordingDuration)}`;
    }

    /**
     * @param event
     */
    public onStopPlaying(event: any) {
        this.isRecording = false;
        this.stopCounter();
        this.redraw();
    }

    public endRecording(event) {
        this.recordingEnded = true;
        this.callListener('endRecording', event);
        this.stopCounter();
        this.redraw();
    }

    /**
     * Stop counter
     */
    private stopCounter() {
        clearTimeout(this.timeoutCounterInstance);
        this.started = false;
    }

    private onDownloadFile(event) {
        this.callListener('downloadFile', event);
    }

    /**
     * Setup all button and the Event listeners for all registered event
     */
    private setupButtons() {
        const buttonContainer = RecorderUI.createElement('div', 'main-button-container');

        this.pauseButton = RecorderUI.createElement('button', 'js-pause-button');
        let isPaused = false;
        this.pauseButton.addEventListener('click', (event) => {
            if (!isPaused) {
                pauseIcon.innerText = 'play_arrow';
            } else {
                pauseIcon.innerText = 'pause';
            }
            isPaused = !isPaused;
            this.pause();
        });
        const pauseIcon = RecorderUI.createElement('span', 'material-icons');
        pauseIcon.innerText = 'pause';
        this.pauseButton.appendChild(pauseIcon);

        this.downloadButton = RecorderUI.createElement('button', 'js-download-button');
        this.downloadButton.addEventListener('click', (event) => this.onDownloadFile(event));
        const downloadText = RecorderUI.createElement('span', 'material-icons');
        downloadText.textContent = 'cloud_download';
        this.downloadButton.appendChild(downloadText);

        this.startRecordingButton = RecorderUI.createElement('button', 'js-start-recording-button');
        this.startRecordingButton.addEventListener('click',
            (event: MouseEvent) => {
            this.onStartPlaying(event);
        });

        const closeButton = RecorderUI.createElement('span', 'material-icons');
        closeButton.innerText = `minimize`;

        this.closeButton = RecorderUI.createElement('button', 'close-recording-button');
        this.closeButton.appendChild(closeButton);
        this.ui.appendChild(this.closeButton);
        this.closeButton.addEventListener('click', (event) => {
            if (this.ui.parentElement.classList.contains('small-ui')) {
                closeButton.innerText = 'minimize';
            } else {
                closeButton.innerText = 'save';
            }
            this.ui.parentElement.classList.toggle('small-ui');
        });

        const startRecordingButtonText = RecorderUI.createElement('span', 'material-icons');
        startRecordingButtonText.innerText = 'play_circle_outline';
        this.startRecordingButton.appendChild(startRecordingButtonText);

        this.endRecordingButton = RecorderUI.createElement('button', 'js-end-recording-button');
        this.endRecordingButton.addEventListener('click',
            (event: MouseEvent) => {
                    this.endRecording(event);
            }
        );

        const endRecordingText = RecorderUI.createElement('span', 'material-icons');
        endRecordingText.textContent = 'stop';
        this.endRecordingButton.appendChild(endRecordingText);


        this.stopRecordingButton = RecorderUI.createElement('button', 'js-stop-recording-button');
        this.stopRecordingButton.addEventListener('click',
            (event: MouseEvent) => {
                this.onStopPlaying(event);
                this.callListener('stopRecording', event);
            }
        );
        const stopRecordingButtonText = RecorderUI.createElement('span', 'material-icons');
        stopRecordingButtonText.textContent = 'cancel';
        this.stopRecordingButton.appendChild(stopRecordingButtonText);

        const publishIcon = RecorderUI.createElement('span', 'material-icons');
        publishIcon.innerText = 'cloud_upload';
        this.publishFileButton = RecorderUI.createElement('button', 'js-recorder-publish');
        this.publishFileButton.addEventListener('click', (event: MouseEvent) => this.publishRecording(event));
        this.publishFileButton.appendChild(publishIcon);

        buttonContainer.appendChild(this.publishFileButton);
        buttonContainer.appendChild(this.startRecordingButton);
        buttonContainer.appendChild(this.pauseButton);

        buttonContainer.appendChild(this.downloadButton);
        buttonContainer.appendChild(this.endRecordingButton);
        buttonContainer.appendChild(this.stopRecordingButton);
        this.leftContainer.appendChild(buttonContainer);
        this.redraw();

    }

    /**
     * @param event
     */
    private publishRecording(event: MouseEvent) {
        this.callListener('pushFile', event);
    }

    /**
     * @param type
     * @param fnc
     */
    public addListener(type: string, fnc: (event) => void) {
        const listener: UIListenerOption = {
            type,
            fn: fnc
        };
        this.listeners.push(listener);
        return {
            destroy: () => {
                for (let i = 0; i < this.listeners.length; i++) {
                    if (this.listeners[i] === listener) {
                        this.listeners.splice(i, 1);
                    }
                }
            }
        };
    }


    /**
     * Call the event listeners for the class registered listeners
     * @param type
     * @param event
     */
    private callListener(type: string, event: any) {
        this.listeners.forEach((listener: UIListenerOption) => {
            if (listener.type === type) {
                listener.fn(event);
            }
        });
    }

    /**
     * Update to the Recording the UI
     * @param data
     */
    public update(data: string) {
        this.divCounter.innerText = data;
        this.redraw();
    }

    /**
     * @param container
     * @param option
     */
    draw(container: HTMLElement, option?: UiOption) {
        if (!option.append) {
            container.innerHTML = '';
        }
        container.classList.add(this.uiClass());
        container.appendChild(this.ui);
      //  this.ui.parentElement.classList.toggle('small-ui');

    }

    uiClass() {
        return 'js-main-recorder';
    }


}
