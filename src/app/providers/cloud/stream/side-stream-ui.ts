import {StreamManager} from 'openvidu-browser';
import {SideStreamUiInterface} from './side-stream-ui-interface';
import {UInterface} from '../../UInterface';
import {UiOption} from '../../UiOption';

interface SideStreamUIConfiguration {
    disconnectIcon: string;
    minimizeIcon: string;
}

export class SideStreamUi implements SideStreamUiInterface, UInterface {

    private participantsStream: StreamManager[] = [];
    private streamClass = 'one_n_stream';
    private streamElement: HTMLElement;
    private disconnectBtn: HTMLButtonElement;
    private minimizeButton: HTMLButtonElement;
    private isMinimized: boolean;
    private isDisconnected: boolean;
    private configuration: any = {
        disconnectIcon: 'cancel',
        minimizeIcon: 'minimize'
    };
    private videoContainer: HTMLElement;

    private callDescription: HTMLElement;

    /**
     * @param event
     */
    public onDisconnect: (event: any) => void = (event) => {};

    /**
     * @param event
     */
    public onMinimize: (event: any) => void = (event) => {};


    /**
     * @param configuration
     */
    constructor(configuration?: SideStreamUIConfiguration) {
        Object.assign(this.configuration, configuration);
        this.createElement();
    }

    /**
     * Create the main element of the side stream
     */
    private createElement() {
        this.streamElement = document.createElement('div');
        this.streamElement.classList.add(this.streamClass);
        this.streamElement.classList.add('hidden');
        this.disconnectBtn = document.createElement('button');
        this.minimizeButton = document.createElement('button');

        const disconnectButtonIcon = document.createElement('i');
        disconnectButtonIcon.classList.add('material-icons');
        disconnectButtonIcon.innerText = this.configuration.disconnectIcon;
        this.disconnectBtn.innerHTML = disconnectButtonIcon.innerHTML;

        const minimizeButtonIcon = document.createElement('i');
        minimizeButtonIcon.classList.add('material-icons');
        minimizeButtonIcon.innerText = this.configuration.minimizeIcon;
        this.minimizeButton.innerHTML = minimizeButtonIcon.innerHTML;

        this.disconnectBtn.addEventListener('click', (event: any) => {
            this.isDisconnected = !this.isDisconnected;
            this.onDisconnect(event);

            if (this.isDisconnected) {
                this.streamElement.classList.add('call-disconnected');
            } else {
                this.streamElement.classList.remove('call-disconnected');
            }
        });

        this.minimizeButton.addEventListener('click', (event: any) => {
            this.isMinimized = !this.isMinimized;
            this.onMinimize(event);

            if (this.isMinimized) {
                this.streamElement.classList.add('call-minimized');
            } else {
                this.streamElement.classList.remove('call-minimized');
            }
        });

        this.videoContainer = document.createElement('div');
        this.videoContainer.classList.add('call-video-container');

        this.callDescription = document.createElement('p');
        this.callDescription.classList.add('call-description');
        this.streamElement.appendChild(this.minimizeButton);
        this.streamElement.appendChild(this.disconnectBtn);
        this.streamElement.appendChild(this.callDescription);
        this.streamElement.appendChild(this.videoContainer);
        this.videoContainer.classList.add('hidden');
    }

    open() {
        this.streamElement.classList.add('hidden');
    }

    remove() {
        this.streamElement.parentNode.removeChild(this.streamElement);
    }

    /**
     * @param stream
     */
    addStream(stream: StreamManager) {
        let added = false;
        this.participantsStream.forEach((participantStream) => {
            if (participantStream.id === stream.id) {
                added = true;
            }
        });
        if (!added) {
            this.participantsStream.push(stream);
            const videoElement = document.createElement('video');
            stream.disassociateVideo(videoElement);
            this.draw(videoElement, {append: true});
        }
    }

    /**
     * @return string
     */
    uiClass() {
        return this.streamClass;
    }

    /**
     * @param container
     * @param option
     */
    draw(container: HTMLElement, option?: UiOption) {
        if (option.append) {
            this.videoContainer.appendChild(container);
        } else {
            this.videoContainer.innerHTML = container.innerHTML;
        }
    }

    /**
     * @param data
     */
    update(data: string) {
        this.callDescription.innerText = `${data}`;
    }
}
