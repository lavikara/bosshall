export class FileBlobModel {
    private defaultImage: string = './assets/img/no_image.jpeg';

    constructor(file?: Blob) {

        try {
            this._file = file;

            this._url = URL.createObjectURL(file);
        } catch (e) {

        }
    }

    private _url: string;

    get url(): string {
        return this._url || this.defaultImage;
    }

    set url(value: string) {
        this._url = value;
    }

    static loading() {
        return './assets/img/loading.gif';
    }
    private _file: Blob;

    get file(): Blob {
        return this._file;
    }

    private _logo: string = './assets/img/logo.png';

    get logo(): string {
        return this._url || this._logo;
    }
}
