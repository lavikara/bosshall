import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {EntitiesService} from "../../../app/providers/user/entities.service";
import {KeyNameModel} from "../../../model/KeyNameModel";
import {FormControl} from "@angular/forms";
import {BrandModel} from "../../../model/BrandModel";
import {UserService} from "../../../app/providers/user/user.provider";
import {BrandService} from "../../../app/providers/brand/brand.service";

@Component({
    selector: 'app-interest-container-selector',
    templateUrl: './interest-container.component.html'
})

export class InterestContainer implements OnInit {

    @Output()
    onChange: EventEmitter<any> = new EventEmitter<Array<any>>();

    private _title: string;
    public filter: FormControl = new FormControl('');
    private interestEntry: any = {} as any;

    constructor(private entity: EntitiesService,
                private brandService: BrandService,
                private userService: UserService) {
    }

    get interestBrands(): Array<BrandModel> {
        return this.interestEntry.data;
    }

    get interests(): Array<KeyNameModel> {
        return this.entity.interests;
    }

    @Input()
    set title(title: string) {
        this._title = title;
    }

    get title() {
        return this._title;
    }

    @Input()
    set selected(value: Array<KeyNameModel>) {
        if(!value || !value.length) {
            return;
        }
        for (let i = 0; i < this.interests.length; i++) {
            for (let j = 0; j < value.length; j++) {
                if (this.interests[i].id === value[j].id) {
                    this.interests[i].selected = true;
                }
            }
        }
    }

    ngOnInit(): void {
        this.interestEntry = this.userService.interestsBrand(true, 1);

    }

    public searchBrands(interestId: number) {
        this.interestEntry.request(interestId);
    }

    public followBrand(brandId: number, interestId: number, followed: number) {
        if(!followed) {
            this.brandService.followBrand(brandId).add(r=> {
                this.ngOnInit();
                this.searchBrands(interestId)
            })
        }else {
            this.brandService.unFollowBrand(brandId).add(() => {
                this.ngOnInit();
                this.searchBrands(interestId)
            })
        }

    }

    public pushInterest(item: KeyNameModel) {
        for (let i = 0; i < this.interests.length; i++) {
            if (this.interests[i].id === item.id) {
                if (item.selected) {
                    this.interests[i].selected = false;

                } else {
                    this.interests[i].selected = true;
                }
            }
        }
        const selectedInterests = [];
        for (let j = 0; j < this.interests.length; j++) {
            if (this.interests[j].selected) {
                selectedInterests.push(this.interests[j]);
            }
        }
        this.onChange.emit(selectedInterests);

    }
}
