import {Injectable, NgZone} from '@angular/core';
import {ApiProvider} from '../api.service';
import {FormGroup} from '@angular/forms';
import {ApiModel} from '../../../model/ApiModel';
import {PaginationModel} from '../../../model/PaginationModel';
import {ConnectionSocketProvider} from '../socket/connection.socket.provider';

@Injectable({
    providedIn: 'root'
})


export class SpreadComment {

    constructor(private apiProvider: ApiProvider,
                private ngZone: NgZone,
                private socketConnection: ConnectionSocketProvider) {
    }

    private _commentForm: FormGroup;

    set commentForm(value: FormGroup) {
        this._commentForm = value;
    }

    createComment(id: number) {
        this._commentForm.value.reply = this._commentForm.value.reply || 0;
        const options = this._commentForm.value;
        options.id = id;
        this.socketConnection.send('Spread', 'Create_comment', options);
    }

    listComments(spreadId: number) {
        let commentId = 0;
        const pageModel: PaginationModel = new PaginationModel();
        const request = {
            data: [],
            pagination: pageModel,
            request: () => {
                this.apiProvider.shouldAuthenticate = true;
                this.apiProvider.url = '/spread/' + spreadId + '/comment' + (commentId ? '?reply=' + commentId : '');
                this.apiProvider.requestType = 'get';
                return this.apiProvider.getUrl({}).subscribe({
                    next: (r: ApiModel) => {
                        pageModel.putPagination(r.pagination);
                        request.data = r.data;
                    },
                    error: (e: any) => {

                    }
                });
            },
            set(id: number) {
                commentId = id;
            }
        };
        return request;
    }

    public createLike(commentId, emojiModel) {
        if (!commentId) {

            return;
        }
        const options: any = emojiModel;
        options.id = commentId;
        this.socketConnection.send('Spread', 'Like_comment', options);

    }
}
