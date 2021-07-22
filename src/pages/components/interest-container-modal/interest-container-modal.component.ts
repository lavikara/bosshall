import { Router } from '@angular/router';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from "@angular/core";
import { EntitiesService } from "../../../app/providers/user/entities.service";
import { KeyNameModel } from "../../../model/KeyNameModel";
import { FormControl } from "@angular/forms";
import { BrandModel } from "../../../model/BrandModel";
import { UserService } from "../../../app/providers/user/user.provider";
import { BrandService } from "../../../app/providers/brand/brand.service";
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-interest-container-modal',
  templateUrl: './interest-container-modal.component.html',
  styleUrls: ['./interest-container-modal.component.scss']
})
export class InterestContainerModalComponent implements OnInit {

  @Output()
  onChange: EventEmitter<any> = new EventEmitter<Array<any>>();
  @ViewChild('modal') modal: ElementRef;

  private _title: string;
  public filter: FormControl = new FormControl('');
  private interestEntry: any = {} as any;
  private cacheItemsForRemovalIfFormNotSaved: Array<KeyNameModel>;

  constructor(private entity: EntitiesService,
    private brandService: BrandService,
    private userService: UserService, private router: Router) {
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
    if (!value || !value.length) {
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
    this.cacheItemsForRemovalIfFormNotSaved = new Array(); // reset it
  }

  public searchBrands(interestId: number) {
    this.interestEntry.request(interestId);
  }

  public followBrand(brandId: number, interestId: number, followed: number) {
    if (!followed) {
      this.brandService.followBrand(brandId).add(r => {
        this.ngOnInit();
        this.searchBrands(interestId)
      })
    } else {
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

  public closeModal() {
    this.modal.nativeElement.classList.remove('is-active');
    setTimeout(() => {
      this.clearCache();
    }, 1500);
  }

  public gotoProfile() {
    this.modal.nativeElement.classList.remove('is-active');
    this.clearCache();
    this.router.navigateByUrl('/bl/profile');
  }

  private clearCache() {
    this.cacheItemsForRemovalIfFormNotSaved.forEach(item => {
      this.pushInterest(item);
    })
  }

  addForUnselectIfFormNotSaved(item: KeyNameModel) {
    this.cacheItemsForRemovalIfFormNotSaved.push(item);
  }

}
