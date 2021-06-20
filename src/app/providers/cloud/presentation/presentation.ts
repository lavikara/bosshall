import {Injectable} from '@angular/core';
import {ApiProvider} from '../../api.service';
import {PresentationParent} from './PresentationParent';
import {FormControl} from '@angular/forms';
import {NotificationService} from '../../user/notification.service';


export class PresentationGuide {
    id?: number;
    name?: string;
    media?: string;
    tag?: string;
    duration?: number;
    spread?: number;
    order?: number;
    container: number;
}

@Injectable({
    providedIn: 'root'
})

export class PresentationProvider {


    /**
     * @param {ApiProvider} apiProvider
     * @param notificationService
     */
    constructor(private apiProvider: ApiProvider, private notificationService: NotificationService) {
    }
    public presentations: PresentationGuide[] = [];

    public presentationContainers: PresentationParent[] = [];

    private spreadId: number;
    private containerId: number;

    public selectedParentContainer: PresentationParent = {} as any;

    public presentationName: FormControl;


    public static renderIframe(selector: string) {
        setTimeout(() => {
            const iframes: any = document.querySelectorAll(selector);
            for (let i = 0; i < iframes.length; i++) {
                if (iframes[i]) {
                    const item = iframes[i].contentWindow.document.querySelector('body>*');
                    item.style.height = '100%';
                    item.style.width = '100%';
                    item.style.objectFit = 'contain';
                }
            }
        }, 2000);

    }

    /**
     * @param spreadId
     */
    get(spreadId: number) {
        this.spreadId = spreadId;
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.requestType = 'get';
        this.apiProvider.url = `/presentation/${spreadId}`;
        return this.apiProvider.getUrl({}).subscribe( presentationContainers => {
            if (presentationContainers && presentationContainers.data) {
                this.presentationContainers = presentationContainers.data;
            }
        });
    }

    /**
     * @param presentationContainer
     */
    getChildren(presentationContainer: PresentationParent) {
        this.selectedParentContainer = presentationContainer;
        this.spreadId = presentationContainer.spread;
        this.containerId = presentationContainer.id;
        this.presentationName.setValue(presentationContainer.name);
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.requestType = 'get';
        this.apiProvider.url = `/presentation/${presentationContainer.spread}/${presentationContainer.id}`;
        return this.apiProvider.getUrl({}).subscribe(presentation => {
            if (presentation && presentation.data) {
                this.presentations = presentation.data;
            }
        });
    }

    /**
     * @param data
     * @param containerId
     */
    create(containerId: number, data: PresentationGuide[]) {

        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.url = `/presentation/${containerId}`;
        this.apiProvider.requestType = 'post';

        data.forEach((datum) => {
            this.apiProvider.getUrl(datum).subscribe(da => {
                this.notificationService.notifierMessage('success', 'Presentation ' + datum.name + ' created');
            }, error => {
                if ( error && error.statusText) {
                    this.notificationService.notifierMessage('error', error.statusText);
                }
            });
        });
    }

    /**
     * @param data
     */
    createParent(data: PresentationParent) {
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.url = `/presentation`;
        this.apiProvider.requestType = 'post';
        return this.apiProvider.getUrl(data);
    }

    /**
     * @param id
     * @param name
     */
    updateParent(id: number, name: string) {
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.url = `/presentation/${id}`;
        this.apiProvider.requestType = 'put';
        return this.apiProvider.getUrl({name}).subscribe(r => {
            if (r && r.statusText) {
                this.notificationService.notifierMessage('success', r.statusText);
            }
        }, (error) => {
            if (error && error.statusText) {
                this.notificationService.notifierMessage('error', error.statusText);
            }
        });
    }

    updateChild(containerId: number, presentation: PresentationGuide) {
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.url = `/presentation/${containerId}/${presentation.id}`;
        this.apiProvider.requestType = 'put';
        this.apiProvider.getUrl(presentation).subscribe(r => {
            if (r && r.statusText) {
                this.getChildren(this.selectedParentContainer);
                this.notificationService.notifierMessage('success', r.statusText);
            }
        }, error => {
            if (error && error.statusText) {
                this.notificationService.notifierMessage('error', error.statusText);
            }
        });
    }

    /**
     * Delete presentation
     */
    deleteParent(id: number) {
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.url = `/presentation/${id}`;
        this.apiProvider.requestType = 'delete';
        return this.apiProvider.getUrl({}).subscribe(r => {
            if (r && r.statusText) {
                if (this.selectedParentContainer.id === id) {
                    this.selectedParentContainer = {} as any;
                }
                this.get(this.spreadId);
                this.notificationService.notifierMessage('success', r.statusText);
            }
        }, error => {
            if ( error && error.statusText) {
                this.notificationService.notifierMessage('error', error.statusText);
            }
        });
    }

    /**
     * Delete presentation
     */
    deleteChild(containerId: number, id: number) {
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.url = `/presentation/${containerId}/${id}`;
        this.apiProvider.requestType = 'delete';
        return this.apiProvider.getUrl({}).subscribe(r => {
            if ( r && r.statusText) {
                this.getChildren(this.selectedParentContainer);
                this.notificationService.notifierMessage('success', r.statusText);
            }
        }, error => {
            if (error && error.statusText) {
                this.notificationService.notifierMessage('error', error.statusText);
            }
        });
    }

    /**
     * @param index
     * @param blob
     */
    public addPresentationFile(index, blob: Blob) {
        this.apiProvider.shouldAuthenticate = true;
        this.apiProvider.url = '/static/file';
        this.apiProvider.requestType = 'post';
        const file = new FormData();
        file.append('file', blob);
        file.append('cors', 'enabled');
        return this.apiProvider.getUrl(file).subscribe(r => {
            if (r && r.data && r.data.path) {
                console.log(r.data.path);
                if (!this.presentations[index]) {
                    this.presentations[index] = {} as any;
                }
                this.presentations[index].media = r.data.path;
                this.presentations[index].tag = r.data.type;
            }
        });
    }
}
