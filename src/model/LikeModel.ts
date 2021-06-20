export class LikeModel {
    public icon: [number, number];
    public class: string;
    public userId: number;
    public colons: string;
    public shortName: string;
    public unicode: string;

    constructor(data: object) {
        this.icon = data['sheet'] || data['icon'];
        this.class = data['id'];
        this.userId = data['userId'];
        this.unicode = data['unified'];
        this.colons = data['colons'];
        this.shortName = data['shortName'];
    }

    static json(data: string) {
        try {
            return JSON.parse(data);
        } catch (e) {
            return data;
        }
    }


    static addLike(oldLike, newLike) {
        try {
            oldLike.likeMeta = JSON.parse(oldLike.likeMeta) || [];

        } catch (e) {
            oldLike.likeMeta = [];
        }

        oldLike.likeMeta.unshift(newLike);
        oldLike.likeMeta = JSON.stringify(oldLike.likeMeta);
        return oldLike;
    }

    static impression(likes: Array<object>): Array<LikeModel> {
        if (!likes || !likes.length) {
            return [];
        }

        return likes.map(r => new LikeModel(r));
    }

    static count(like: Array<LikeModel>) {
        return like.length;
    }
}
