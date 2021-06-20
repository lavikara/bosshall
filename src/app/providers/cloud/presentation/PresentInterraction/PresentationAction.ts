import {ConnectionSocketProvider} from '../../../socket/connection.socket.provider';
import {PresentationEvent} from './PresentationEvent';
import {PresentationActionInterface} from './PresentationActionInterface';

export class PresentationAction implements PresentationActionInterface {

    /**
     * PresentationEVent
     */
    private presentationEventString = PresentationEvent.PARENT;
    constructor(
        private socketConnection: ConnectionSocketProvider,
        private presentationFile: FileInterface
        ) {
        this.initOptions();
        this.sendFile(this.presentationFile);
    }

    private initOptions() {
        this.presentationFile.duration = 0;
        this.presentationFile.volume = 1;
    }


    /**
     * pause
     */
    pause() {
        this.socketConnection.send(
            this.presentationEventString,
            PresentationEvent.PAUSE,
            this.presentationFile
        );
    }

    /**
     * play
     */
    play() {
        this.socketConnection.send(
            this.presentationEventString,
            PresentationEvent.PLAY,
            this.presentationFile
        );
    }

    /**
     * send file
     * @param fileInterface
     */
    sendFile(fileInterface: FileInterface) {

        console.log(fileInterface);
        this.socketConnection.send(
            this.presentationEventString,
            PresentationEvent.FILE,
            fileInterface
        );
    }

    /**
     * Stop
     */
    stop() {
        this.socketConnection.send(
            this.presentationEventString,
            PresentationEvent.STOP,
            this.presentationFile
        );
    }

    /**
     * @param duration
     */
    seek(duration: number) {
        this.presentationFile.duration = duration;
        this.socketConnection.send(
            this.presentationEventString,
            PresentationEvent.SEEK,
            this.presentationFile
        );
    }

    /**
     * @param volume
     */
    volumeChange(volume: number) {
        this.presentationFile.volume = volume;
        this.socketConnection.send(
            this.presentationEventString,
            PresentationEvent.VOLUME,
            this.presentationFile
        );
    }
}
