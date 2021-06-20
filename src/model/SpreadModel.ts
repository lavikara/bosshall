import {UserModel} from "./UserModel";
import {BrandModel} from "./BrandModel";
import {LikeModel} from "./LikeModel";

export class SpreadModel {
    public id: number;
    public name: string;
    public description: string;
    public cover: string;
    public startTime: any;
    public endTime: any;
    public tag: Array<string> = [];
    public SpreadCreator: UserModel;
    public displayAction: string;
    public preview: string;
    public likeMeta: Array<LikeModel>;
    public creator?: number;
    public download: number;
    public AudienceType?: string;
    public status?: number;
    public invitationType: string;
    public downloaded: boolean;
    public file?: string;
    public brand?: number;
    public myPermission?: string;
    public spreadFlag: boolean;
    public participantCount: number;
    public comment_count: number;
    public Brand: BrandModel;
    public Participants: Array<UserModel>;
    public backgroundSound: string;
    public createdAt: any;
    public updatedAt: any;
}
