import {Injectable} from '@angular/core';
import {ApiProvider} from '../api.service';
import {KeyNameModel} from '../../../model/KeyNameModel';
import {ApiModel} from '../../../model/ApiModel';
import {LocalStorageService} from 'ngx-store';
import {CountryModel} from '../../../model/CountryModel';
import {TimeZoneModel} from '../../../model/TimeZoneModel';

@Injectable({
    providedIn: 'root'
})
export class EntitiesService {
    private interestsKey = 'interestsKey';
    private countryKey = 'countryKey';
    private timezoneKey = 'timezoneKey';

    constructor(private apiProvider: ApiProvider, private localStorageService: LocalStorageService) {

    }

    private _countries: Array<CountryModel> = [];

    get countries(): Array<CountryModel> {
        if (this._countries.length) {
            return this._countries;
        }
        this._countries = this.localStorageService.get(this.countryKey) || [];
        return this._countries;
    }

    private _interests: Array<KeyNameModel> = [];

    get interests(): Array<KeyNameModel> {
        if (this._interests.length) {
            return this._interests;
        }
        this._interests = this.localStorageService.get(this.interestsKey) || [];
        return this._interests;
    }

    private _timezone: Array<TimeZoneModel> = [];

    get timezone(): Array<TimeZoneModel> {
        if (this._timezone.length) {
            return this._timezone;
        }
        this._timezone = this.localStorageService.get(this.timezoneKey) || [];
        return this._timezone;
    }

    public async setup() {

        if (!this.countries.length) {
            await this.getInterests();
        }

        if (!this.countries.length) {
            await this.getCountries();
        }


        if (!this.timezone.length) {
            await this.getTimezone();
        }
    }

    private async _entry(done: (value?: ApiModel) => any) {
        return await new Promise((resolve, reject) => {
            this.apiProvider.getUrl({}).subscribe({
                next: (r: ApiModel) => {

                    done(r);
                    resolve(r);
                },
                error: (error: any) => {

                    reject(error);
                }
            });
        });
    }

    private async getInterests() {
        this.apiProvider.url = 'static/entity?type=Interest';
        this.apiProvider.requestType = 'get';
        this.apiProvider.shouldAuthenticate = true;
        return await this._entry((r) => {
            this.localStorageService.set(this.interestsKey, r.data);
        });

    }

    private async getTimezone() {
        this.apiProvider.url = 'static/entity?type=TimeZone';
        this.apiProvider.requestType = 'get';
        this.apiProvider.shouldAuthenticate = true;
        return await this._entry((r) => {
            this.localStorageService.set(this.timezoneKey, r.data);
        });

    }

    private getCountries() {
        this.apiProvider.url = 'static/entity?type=Country';
        this.apiProvider.requestType = 'get';
        this.apiProvider.shouldAuthenticate = false;
        return this._entry((r) => {
            this.localStorageService.set(this.countryKey, r.data);
        });
    }
}
