import {CountryModel} from "./CountryModel";

export class Participants {
    public id: number;
    public Country: CountryModel;
    public firstname: string;
    public lastname: string;
    public headline: string;
    public permission: string;
    public picture: string;
}
