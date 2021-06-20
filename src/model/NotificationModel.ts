import {UserModel} from "./UserModel";

export class NotificationModel {
    public NotificationFrom: UserModel;
    public NotificationTo: UserModel;
    public description: string;
    public title: string;
    public id: number;
    public url: string;
    public read: boolean;
    public createdAt: string;
    public updatedAt: string;
}
