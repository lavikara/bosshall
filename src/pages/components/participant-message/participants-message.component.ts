import {AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {MessageService} from '../../../app/providers/cloud/message/message.service';
import {Message} from '../../../app/providers/cloud/message/message';
import {SpreadService} from '../../../app/providers/spread/spread.service';
import {SpreadModel} from '../../../model/SpreadModel';
import {CloudService} from '../../../app/providers/cloud/cloud.provider';
import {AuthProvider} from '../../../app/providers/auth.provider';
enum Sizes {
    small, medium, big
}

@Component({
    selector: 'app-participants-message-include',
    templateUrl: './participants-message.component.html',
    styleUrls: ['./participants-message.component.scss']
})

export class ParticipantsMessageIncludeComponent implements OnInit, AfterViewInit {
    @ViewChild('fileElement', {static: true})
    public fileElement: ElementRef;
    constructor(
        private messageService: MessageService,
        private cloudService: CloudService,
        private authProvider: AuthProvider
    ) {
    }

    ngAfterViewInit() {
        if (this.fileElement && this.fileElement.nativeElement) {
            this.fileElement.nativeElement.addEventListener('change', (event) => {
                if (event.target && event.target.files) {
                    for (let i = 0; i < event.target.files.length; i++) {
                        this.uploadFile(event.target.files[i]);
                    }
                }
            })
        }
    }

    private uploadFile(blob: Blob) {
        this.cloudService.uploadStaticFile(blob).then((r: string) => {
            if (r && r.length && r.length > 5) {
                const iframe = document.createElement('iframe');
                iframe.src = r;
                iframe.style.width = `200px`;
                iframe.style.height = `200px`;
                console.log(iframe.outerHTML)
                this.createRequest(iframe.outerHTML, 'Message');
            }
        }).catch(error => {});
    }

    get paddingSize(): string {
        return this._paddingSize;
    }

    get size(): Sizes {
        return this._size;
    }

    @Input()
    set size(value: Sizes) {
        this._size = value;
    }

    @Input()
    set paddingSize(value: string) {
        if (value === 'small') {
            this._paddingSize = '5px 5px 0 5px';
        } else if (value === 'medium') {
            this._paddingSize = '10px 10px 0 10px';
        }
    }

    get bg(): string {
        return this._bg;
    }

    @Input()
    set bg(value: string) {
        this._bg = value;
    }

    get messages(): Message[] {
        if (this.messageService.currentUser) {
            return this.messageService.userMessages;
        } else {
            return this.messageService.spreadMessage;
        }
    }

    get isAllUser(): boolean {
        return this.messageService.currentUser === 0;
    }

    get spreadDetail(): SpreadModel {
        return this.cloudService.spreadDetails;
    }

    get screenName(): string {
        return this.messageService.chatName;
    }
    @ViewChild('inputField', {static: true}) inputField: ElementRef;
    private _paddingSize = '38px 38px 0 38px';
    private _bg = '#fbfbfb';
    private _size = Sizes.big;
    ngOnInit(): void {
        if (this.inputField && this.inputField.nativeElement) {
            this.inputField.nativeElement.addEventListener('keypress', (event) => {
                if (event.key === 'Enter' || event.which === 13) {
                    this.sendMessage();
                }
            });
        }
    }

    private createRequest(text: string, type: 'Message' | 'call') {
        const newMessage = this.messageService.newMessage(
            this.messageService.currentUser,
            text,
            type,
            this.cloudService.myCapabilities
        );
        newMessage.send();
    }

    public sendMessage() {
        this.createRequest(this.inputField.nativeElement.textContent,
            'Message');
        setTimeout(() => {
            this.inputField.nativeElement.innerHTML = '';
        }, 300);
    }

    get reply(): Message {
        return this.messageService.replyId;
    }

    public removeReply() {
        this.messageService.replyId = {} as Message;
    }

    public call() {
        this.createRequest(
            'Is requesting an Audience',
            'call'
        );
    }

    get mainFeed(): boolean {
        return !!(this.cloudService.mainStream &&
            this.cloudService.mainStream.stream);
    }

    public openEmoji() {

    }

    get isChiefHost(): boolean {
        return this.cloudService.chiefBroadcaster.id === this.authProvider.user.id;
    }

    public openFileChooser() {
        this.fileElement.nativeElement.click();
    }
}
