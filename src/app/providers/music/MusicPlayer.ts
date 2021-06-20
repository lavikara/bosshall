import {MusicInterface} from './MusicInterface';
import {MusicEventListener} from './MusicEventListener';

export class MusicPlayer extends MusicEventListener {
    public static eventName = 'Music';

    public constructor() {
        super();
    }

    start(): void {
        if (this.isChiefHost()) {
            this.socketConnection.send(
                MusicPlayer.eventName,
                'playing',
                this.musicFile);
        }
    }

    stop(): void {
        if (this.isChiefHost()) {
            this.musicFile.status = 'stopped';
            this.socketConnection.send(
                MusicPlayer.eventName,
                'stopped',
                this.musicFile
            );
        }
    }

    seek() {
        if (this.isChiefHost()) {
            this.musicFile.status = 'seek';
            this.socketConnection.send(
                MusicPlayer.eventName,
                'seek',
                this.musicFile
            );
        }
    }

    volume(volume: number): void {
        if (this.isChiefHost()) {
            this.musicFile.volume = volume;
            this.musicFile.status = 'volume';
            this.socketConnection.send(
                MusicPlayer.eventName,
                'volume',
                this.musicFile
            );
        }
    }

}
