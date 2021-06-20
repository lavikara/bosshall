import {MusicFile} from './MusicFile';

export interface MusicInterface {

    /**
     * Event on player start or skip
     * @param musicFile
     */
    onStart(musicFile: MusicFile): void;

    /**
     * Event on player stop
     * @param musicFile
     */
    onStop(musicFile: MusicFile): void;


    /**
     * Player on
     * @param musicFile
     */
    onVolume(musicFile: MusicFile): void;

    /**
     * On Start playing
     */
    start(): void;

    /**
     * On Stop playing
     */
    stop(): void;

    /**
     * Volume action
     */
    volume(volume: number): void;

    /**
     * Load the music file
     */
    loadMusicFile(): void;
}
