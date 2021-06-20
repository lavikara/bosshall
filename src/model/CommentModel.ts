import {UserModel} from "./UserModel";

export class CommentModel {
    public id: number;
    public SendMsg: UserModel;
    public createdAt: string;
    public updatedAt: string;
    public comment: string;
    public mediaMeta: string;
    public likeMeta: any;
    public User: UserModel;
    public replies: Array<CommentModel>;
}