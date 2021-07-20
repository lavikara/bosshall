import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs/index';
import {catchError, filter, map} from 'rxjs/internal/operators';
import {appConfig} from '../app.config';
import {LoadingService} from './loading.service';
import {AuthProvider} from './auth.provider';

@Injectable({
    providedIn: 'root'
})


export class ApiProvider {
    constructor(private http: HttpClient, private loadingService: LoadingService, private authProvider: AuthProvider) {
    }

    private _header: any = {};

    set header(value: any) {
        this._header = value;
    }

    private _requestType: 'get' | 'post' | 'delete' | 'update';

    set requestType(value) {
        this._requestType = value;
    }

    private _url: string;

    set url(value: string) {
        this._url = value;
    }

    private _progress = 0;

    get progress(): number {
        return this._progress;
    }

    private _loading: boolean;

    get loading(): boolean {
        return this._loading;
    }

    private _responseType: 'text' | 'blob' | 'arraybuffer' | 'json' = 'json';

    set responseType(value: 'text' | 'blob' | 'arraybuffer' | 'json') {
        this._responseType = value;
    }

    private _shouldAuthenticate: boolean;

    set shouldAuthenticate(value: boolean) {
        this._shouldAuthenticate = value;
    }

    public getUrl(body: any, shouldAuthenticate?: boolean): Observable<any> {
        this._progress = 0;

        if (!this._url || !this._url) {
            return throwError({});
        }
        if (this._shouldAuthenticate || shouldAuthenticate) {
            this.addAuthorization();
        }
        this._url = this._url.replace(/^\//g, '');

        const option = {headers: new HttpHeaders(this._header), responseType: this._responseType, reportProgress: true};
        // console.log('body ', body);
        // console.log('url ', this._url);
        // console.log('Should authenticate ', this._shouldAuthenticate);
        // console.log('options ', option);
        // console.log('token ', JSON.stringify(this._header));
        if (this._requestType === 'delete' || this._requestType === 'get') {
            body = option;
        }
        this._loading = true;
        this._progress = 0;
        this.loadingService.startLoading(false);
        const req = new HttpRequest(this._requestType.toUpperCase(), this.buildUrl(), body, option);

        return this.http.request(req).pipe(
            filter((event: HttpEvent<any>, index: number) => {
                return this.getEventMessage(event);
            }),
            map((res: any) => {
                this._loading = false;
                this.loadingService.stopLoading();
/*
                console.log(res);
*/
                return res.body;
            }),
            catchError((error: any, caught: Observable<any>) => {
                this._loading = false;
                this.loadingService.stopLoading();
                console.log('error from ', this._url, error);
                let dat = error;
                if (dat && dat.error) {
                    dat = error.error;
                }
                return throwError(dat);
            })
        );
    }

    public appendHeader(type: string, value: string | undefined) {
        if (type && type.length && value && value.length) {
            this._header[type] = value;
        }
    }

    private buildUrl() {
        return this._url.startsWith('http') ? this._url : (appConfig.host + this._url);
    }

    private addAuthorization() {
        this.appendHeader('Authorization', this.authProvider.token);
    }

    private getEventMessage(event: HttpEvent<any>): boolean {
        if (event.type === HttpEventType.Sent) {
            this._progress = 0;
        } else if (event.type === HttpEventType.UploadProgress) {
            this._progress = Math.round((100 * event.loaded) / event.total);
        } else if (event.type === HttpEventType.Response) {
            this._progress = 100;
        }

        if (event.type === HttpEventType.Response) {
            return true;
        }


    }
}
