import {BrandModel} from "./BrandModel";
import {CountryModel} from "./CountryModel";

export class UserModel {
    public firstname: string;
    public lastname: string;
    public email?: string;
    public verified: boolean;
    public username?: string;
    public picture: string;
    public id: number;
    public brandSelected: number;
    public BrandSelected: BrandModel;
    public country: number;
    public background: string;
    public Country: CountryModel;
    public mobile: number;
    public anonymity: boolean;
    public state: string;
    public tags: string;
    public permission: string;
    public address: string;
    public headline: string;
    public bio: string;
    public interestCount?: number;
    public receiveNotification?: boolean;
    public receiveSound?: boolean;
}
