import {AfterViewInit, Component, Input} from '@angular/core';
import {BrandService} from '../../../app/providers/brand/brand.service';
import {NgxSmartModalComponent} from 'ngx-smart-modal';

@Component({
    selector: 'app-brand-story-component',
    templateUrl: './brandStory.component.html'
})
export class BrandStoryComponent implements AfterViewInit {
    @Input()
    edit = false;

    public story = '';

    constructor(private brandService: BrandService, private smartModal: NgxSmartModalComponent) {
    }


    public saveStory() {
        this.brandService.story.setValue(this.story);
        this.smartModal.close();
    }


    ngAfterViewInit(): void {
        this.smartModal.onOpen.subscribe(() => {
            this.story = this.brandService.story.value;
        });
    }
}
