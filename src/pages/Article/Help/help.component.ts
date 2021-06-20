import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DataService} from "../../../app/providers/data.service";

@Component({
    templateUrl: './help.component.html',
    selector: 'app-article-help-component'
})
export class HelpComponent implements OnInit, AfterViewInit {
    constructor(private dataProvider: DataService) {
    }

    ngOnInit(): void {

    }

    ngAfterViewInit(): void {
        this.dataProvider.name = 'article';
        this.dataProvider.value = 'about';
        this.dataProvider.onValueChanges.next({
            value: this.dataProvider.value,
            name: this.dataProvider.name
        });
    }
}
