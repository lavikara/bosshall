export interface ChannelModel {
    title: string;
    logo: string;
}

export interface TunnedInModel {
    avatar: Array<string>;
    count: number;
}


export interface CompactPlayer {
    url: string;
    cover_image: string;
    series: string;
    channel: ChannelModel;
    comment_count: number;
    TunnedIn: TunnedInModel;
    downloads: number;
    type: string;
    title: string;
    location: string;
    dislike_count?: number;
    time: any;
    like_count: number;
    id: number;
}
