import {MusicInterface} from './MusicInterface';
import {MusicFile} from './MusicFile';
import {ConnectionSocketProvider} from '../socket/connection.socket.provider';

export abstract class MusicEventListener implements MusicInterface {
    protected musicElement: HTMLAudioElement;
    protected musicFile: MusicFile;
    private musicElementClass = 'cloud-music-player-audio';
    protected socketConnection: ConnectionSocketProvider;

    protected fileLoaderEl: HTMLInputElement;

    protected userId: number;
    protected spreadId: number;
    public currentTime = 0;


    constructor() {
        this.setup();
    }

    /**
     * Clear all previous music elements
     */
    private cleanPreviousMusic() {
        const musicElements = document.querySelectorAll(this.musicElementClass);
        if (musicElements && musicElements.length) {
            for (let i = 0; i < musicElements.length; i++) {
                musicElements[i].parentNode.removeChild(musicElements[i]);
            }
        }
    }

    /**
     * Call to setup the pre methods
     */
    private setup() {
        this.cleanPreviousMusic();
        this.musicElement = document.createElement('audio') as HTMLAudioElement;
        this.musicElement.classList.add(this.musicElementClass);
        this.fileLoaderEl = document.createElement('input') as HTMLInputElement;
        this.fileLoaderEl.type = 'file';
        this.fileLoaderEl.accept = 'audio/*';

        this.musicElement.autoplay = false;
        this.musicElement.addEventListener('playing', () => {
            this.updateMusicFile();
            this.onStart(this.musicFile);
            this.start();
        });
        this.musicElement.addEventListener('volumechange', (event: any) => {
            this.updateMusicFile();
            if ( event.target && event.target.volume) {
                this.volume(event.target.volume);
            }
        });

        this.musicElement.addEventListener('timeupdate', (event: any) => {
            if (event.target && event.target.currentTime && this.isChiefHost()) {
                this.musicFile.position = event.target.currentTime;
            }
        });

        this.musicElement.addEventListener('seeking', (event: any) => {
            if (event.target && event.target.currentTime && this.isChiefHost()) {
                this.musicFile.position = event.target.currentTime;
            }
            this.seek();
        });

        this.musicElement.addEventListener('ended', (event: any) => {
            this.stop();
        });

        this.musicElement.addEventListener('pause', (event: any) => {
            this.stop();
        });

        let timeoutInstance = null;
        this.musicElement.addEventListener('timeupdate', (event: any) => {
            clearTimeout(timeoutInstance);
          timeoutInstance = setTimeout(() => {
              if (!this.isChiefHost()) {
                  this.musicElement.currentTime = this.currentTime;
              }
          }, 2000);


        });
    }

    /**
     * Update the music file properties
     */
    private updateMusicFile() {
        if (this.musicFile && this.musicFile.path) {
            this.musicFile.setVolume(this.musicElement.volume);
            this.musicFile.setSkipPosition(this.musicElement.currentTime);
        }
    }

    /**
     * Start listener
     * @param musicFile
     */
    onStart(musicFile: MusicFile): void {}

    /**
     * Stop listener
     * @param musicFile
     */
    onStop(musicFile: MusicFile): void {}

    /**
     * Volume listener
     * @param musicFile
     */
    onVolume(musicFile: MusicFile): void {}


    /**
     * Verify if chief host
     */
    protected isChiefHost() {
        return this.musicFile && this.userId === this.musicFile.userId;
    }
    /**
     * Start method
     */
    abstract start(): void;

    /**
     * stop method
     */
    abstract stop(): void;

    /**
     * Volume method
     * @param volume
     */
    abstract volume(volume: number): void;


    abstract seek(): void;

    /**
     * load music files
     */
    public loadMusicFile() {
        this.fileLoaderEl.click();
    }
}

