/**
 * Music file model
 */
import {UploadModel} from '../../../model/UploadModel';

export class MusicFile {

    /**
     * The URL of the music file, created using blob
     */
    public path: string;

    /**
     * The name of this music file, returned by blob
     */
    public name: string;

    /**
     * The size of this file
     */
    public size: number;

    /**
     * The type of file, returned by blob
     */
    public type: string;

    /**
     * Volume of this file
     */
    public volume: number;

    /**
     * Current position of the playing music
     */
    public position: number;

    /**
     * Number of times this particular music has played
     */
    public playedTimes: number;

    /**
     * Step for volume increment
     */
    private volumeIncreaseStep = 0.1;


    /**
     * Status of the music file
     */
    public status: 'seek' | 'playing' | 'stopped' | 'volume' | 'clear';

    /**
     * UserID of the person that is playing this music
     */
    public userId: number;

    /**
     * Current spread id
     */
    public spread: number;

    /**
     * Preventing direct initalization
     */
    private constructor() {
    }


    /**
     * Initialize the music player
     * @throws Error
     * @param fileModel
     * @param size
     * @param spreadId
     * @param userId
     */
    public static createMusic(fileModel: UploadModel,
                              size: number = 0,
                              spreadId: number,
                              userId: number): MusicFile {

        if (!fileModel.path) {
            throw new Error('Invalid blob or file');
        }

        const musicFile = new MusicFile();
        musicFile.path = fileModel.path;
        musicFile.name = fileModel.name;
        musicFile.spread = spreadId;
        musicFile.userId = userId;
        musicFile.size = size;
        musicFile.type = fileModel.type;
        musicFile.volume = 1;
        musicFile.position = 0;
        musicFile.playedTimes = 0;

        return musicFile;
    }

    /**
     * Set Volume
     * @param volume
     */
    public setVolume(volume: number): void {
        if (volume >= 0 && volume <= 1) {
            this.volume = volume;
        }
    }

    /**
     * Increase the play times
     */
    public incrementPlayedTimes() {
        this.playedTimes += 1;
    }

    /**
     * Increase volume
     */
    public increaseVolume() {
        if (this.volume < 1) {
            this.volume += this.volumeIncreaseStep;
        }
    }

    /**
     * Decrease volume
     */
    public decreaseVolume() {
        if (this.volume > 0) {
            this.volume -= this.volumeIncreaseStep;
        }
    }

    /**
     * Set the position
     * @param position
     */
    public setSkipPosition(position: number) {
        this.position = position;
    }

    protected clear() {
        this.status = 'clear';
    }
}
