import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DataService} from '../../../app/providers/data.service';

@Component({
    selector: 'app-article-faq-component',
    templateUrl: './faq.component.html'
})
export class FaqArticleComponent implements OnInit, AfterViewInit {
    constructor(private dataProvider: DataService) {
    }

    ngOnInit(): void {

    }

    ngAfterViewInit(): void {
        this.dataProvider.name = 'article';
        this.dataProvider.value = 'faq';
        this.dataProvider.onValueChanges.next({
            value: this.dataProvider.value,
            name: this.dataProvider.name
        });
    }
}
