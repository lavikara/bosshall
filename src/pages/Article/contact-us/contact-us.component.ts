import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DataService} from '../../../app/providers/data.service';

@Component({
    selector: 'app-article-contact-us',
    templateUrl: './contact-us.component.html'
})
export class ContactUsComponent implements OnInit, AfterViewInit {
    constructor(private dataProvider: DataService) {

    }

    ngOnInit(): void {

    }

    ngAfterViewInit(): void {
        this.dataProvider.name = 'article';
        this.dataProvider.value = 'contact-us';
        this.dataProvider.onValueChanges.next({
            value: this.dataProvider.value,
            name: this.dataProvider.name
        });
    }
}
