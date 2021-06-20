import {ApiProvider} from '../api.service';
import {MusicFile} from './MusicFile';
import {MusicPlayer} from './MusicPlayer';
import {UInterface} from '../UInterface';
import {ConnectionSocketProvider} from '../socket/connection.socket.provider';
import {Subject} from 'rxjs';
import {UploadModel} from '../../../model/UploadModel';

export class MusicService extends MusicPlayer implements UInterface {

    private musicLoadBtn: HTMLButtonElement;
    private uiContainer: HTMLDivElement;
    private musicText: HTMLParagraphElement;
    private backgroundSound: string;

    /**
     * @param api
     * @param socketConnection
     * @param userId
     * @param spreadId
     */
    constructor(private api: ApiProvider,
                socketConnection: ConnectionSocketProvider,
                userId: number,
                spreadId: number
    ) {
        super();
        this.socketConnection = socketConnection;
        this.userId = userId;
        this.spreadId = spreadId;
        this.uiSetup();
    }


    public setBackgroundSound(backgroundSound: string) {
        this.backgroundSound = backgroundSound;
        this.createMusicFile({
            path: backgroundSound,
            name: '',
            type: 'audio/mp3'
        }, 1024);
    }

    uiSetup() {
        this.uiContainer = document.createElement('div');
        const closeButton = document.createElement('button');
        closeButton.classList.add('close-button');
        const closeIcon = document.createElement('i');
        closeIcon.innerText = 'minimize';
        closeIcon.classList.add('material-icons');
        closeButton.appendChild(closeIcon);

        closeButton.addEventListener('click', (event) => {
            if (this.uiContainer.classList.contains('small-ui')) {
                closeButton.innerText = 'minimize';
            } else {
                closeButton.innerText = 'save';
            }
            this.uiContainer.classList.toggle('small-ui');
        });

        this.fileLoaderEl.addEventListener('change', (event: any) => {
            if (
                event.target &&
                event.target.files &&
                event.target.files.length
            ) {
                this.uploadMusic(event.target.files[0]);
            }
        });

        const musicEvent = new Subject<any>();

        musicEvent.subscribe((res) => {
            if (
                (!res.data || !res.data.content) ||
                (this.musicFile && this.userId === this.musicFile.userId) ||
                (this.musicFile && this.spreadId !== this.musicFile.spread)
            ) {
                return;
            }

            const musicFile: MusicFile = res.data.content;

            switch (res.data.name) {
                case 'playing':
                    this.play(musicFile);
                    break;
                case 'seek':
                    this.updateMusic(musicFile);
                    break;
                case 'stopped':
                    this.updateMusic(musicFile);
                    break;
                case 'clear':
                    this.updateMusic(musicFile);
                    break;
                case 'volume':
                    this.updateMusic(musicFile);
                    break;

            }
        });

        this.socketConnection.setObservable('Music', musicEvent);
    }


    private play(musicFile: MusicFile) {
        if (musicFile && musicFile.path !== this.musicElement.src) {
            this.musicElement.src = musicFile.path;
        }

        this.musicElement.classList.add('hidden');
        this.musicElement.play().then(r => {
            this.musicElement.currentTime = this.currentTime;
        });
        document.body.appendChild(this.musicElement);
    }

    private updateMusic(musicFile: MusicFile) {
        if (this.musicElement && this.musicElement.src) {

            if (musicFile.status === 'volume') {
                if (musicFile.volume >= 0 && musicFile.volume <= 1) {
                    this.musicElement.volume = musicFile.volume;
                }
            } else if (musicFile.status === 'clear') {
                this.musicElement.pause();
                this.musicElement.src = null;
            } else if (musicFile.status === 'seek') {
            } else if (musicFile.status === 'stopped') {
                this.musicElement.pause();
            }
            this.currentTime = musicFile.position;

        }
    }

    draw(container: HTMLElement, option?: import('../UiOption').UiOption) {
        container.innerHTML = '';
        this.musicLoadBtn = document.createElement('button');
        this.musicText = document.createElement('p');
        this.musicText.classList.add('updateable-text');
        this.musicText.innerHTML = `Please load a music file to start playing`;
        this.musicLoadBtn.innerHTML = `Load Music`;
        this.musicLoadBtn.addEventListener('click', () => this.loadMusicFile());
        this.uiContainer.classList.add(this.uiClass());
        this.uiContainer.appendChild(this.musicElement);
        this.uiContainer.appendChild(this.musicLoadBtn);
        this.uiContainer.appendChild(this.musicText);
        container.appendChild(this.uiContainer);
    }

    /**
     * @param data
     */
    update(data: string) {
        this.musicText.innerHTML = data;
    }

    /**
     * @return string
     */
    uiClass() {
       return 'music-player-container';
    }

    private createMusicFile(musicFile: UploadModel, blobSize: number) {
        this.musicFile = MusicFile.createMusic(
            musicFile,
            blobSize / 1024,
            this.spreadId,
            this.userId
        );
        this.musicElement.src = this.musicFile.path;
        this.musicElement.controls = true;
        this.uiContainer.classList.add('music-loaded');
        this.update('You can now play to your audience');
        this.updateSpread(this.musicFile.path);
    }

    /**
     * Upload Music file
     * @param blob
     */
    private uploadMusic(blob: Blob) {
        this.api.shouldAuthenticate = true;
        this.api.url = '/static/file';
        this.api.requestType = 'post';
        const file = new FormData();
        file.append('file', blob);
        file.append('cors', 'enabled');

        const subscription = this.api.getUrl(file).subscribe(r => {
            if (r && r.data) {
                this.createMusicFile(r.data, blob.size);
            }
        });

        subscription.add(() => {
            subscription.unsubscribe();
        });
    }

    onStart(musicFile: MusicFile) {
        if (musicFile) {
            musicFile.status = 'playing';
        }
    }


    private updateSpread(musicPath: string) {
        if (!musicPath) {
            return;
        }

        this.api.shouldAuthenticate = true;
        this.api.requestType = 'put';
        this.api.url = 'spread/' + this.spreadId;
        const subscription = this.api.getUrl({backgroundSound: musicPath}).subscribe(() => {});
        subscription.add(() => {
            subscription.unsubscribe();
        });
    }
}
