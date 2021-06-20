import {AfterViewInit, Component, OnInit} from '@angular/core';
import {DataService} from '../../../app/providers/data.service';

@Component( {
    selector: 'app-article-terms-component',
    templateUrl: './terms.component.html'
})
export class TermsArticleComponent implements AfterViewInit {
    constructor(private dataProvider: DataService) {
    }

    ngOnInit(): void {
    }
    ngAfterViewInit(): void {
        this.dataProvider.name = 'article';
        this.dataProvider.value = 'terms';
        this.dataProvider.onValueChanges.next({
            value: this.dataProvider.value,
            name: this.dataProvider.name
        });
    }
}
