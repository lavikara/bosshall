import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DataService} from "../../../app/providers/data.service";

@Component({
    templateUrl: './privacy.component.html',
    selector: 'app-article-privacy-component'
})
export class PrivacyComponent implements OnInit, AfterViewInit {
    constructor(private dataProvider: DataService) {
    }

    ngOnInit(): void {

    }

    ngAfterViewInit(): void {
        this.dataProvider.name = 'article';
        this.dataProvider.value = 'privacy';
        this.dataProvider.onValueChanges.next({
            value: this.dataProvider.value,
            name: this.dataProvider.name
        });
    }
}
