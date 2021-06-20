import {TimeZoneModel} from "./TimeZoneModel";
import {CountryModel} from "./CountryModel";
import {ExecutiveModel} from "./ExecutiveModel";
import {WebsiteModel} from "./WebsiteModel";
import {PhilosopherModel} from "./PhilosopherModel";
import {KeyNameModel} from "./KeyNameModel";
import {UserModel} from "./UserModel";

export class BrandModel {
    public id: number;
    public name: string;
    public address: string;
    public workingDays: string;
    public workStart: string;
    public workEnd: string;
    public followers?: number;
    public logo: string;
    public created: number;
    public motto: string;
    public TimeZone?: TimeZoneModel;
    public about?: string;
    public Country?: CountryModel;
    public story?: string;
    public selected?: boolean;
    public Followers?: UserModel;
    public createdAt: any;
    public updatedAt: string;
    public timezone: number;
    public ExecutiveInvitations: Array<ExecutiveModel>;
    public BrandWebsites: Array<WebsiteModel>;
    public BrandPhilosophers: Array<PhilosopherModel>;
    public InterestTag: Array<KeyNameModel>;

}
