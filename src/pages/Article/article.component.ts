import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../../app/providers/data.service';

@Component({
    selector: 'app-article-component',
    templateUrl: './article.component.html'
})

export class ArticleComponent implements OnInit, AfterViewInit, OnDestroy {
    public articleLink: any = [
        {
            id: 'about',
            title: 'ABOUT',
            children: [
                {
                    title: 'Tour Bosshall',
                    link: '#tour'
                },
                {
                    title: 'Values',
                    link: '#values'
                }
            ]
        },
        {
            id: 'faq',
            title: 'HELP CENTER',
            children: [
                {
                    title: 'Using Bosshalls',
                    link: '#using-bosshall'
                },
                {
                    title: 'Rules',
                    link: '#rules'
                },
                {
                    title: 'FAQ',
                    link: '#faq'
                }
            ]
        },
        {
            id: 'privacy',
            title: 'PRIVACY POLICY',
            children: [
                {
                    title: 'Information Use',
                    link: '#information-use'
                },
                {
                    title: 'Big Data',
                    link: '#big-use'
                },
                {
                    title: 'Communication',
                    link: '#communication'
                },
                {
                    title: 'Cookies',
                    link: '#cookies'
                },
                {
                    title: 'Changes to Privacy',
                    link: '#changes-to-privacy'
                },
                {
                    title: 'Contact Us',
                    link: '#contact-us'
                }
            ]
        },
        {
            id: 'contact-us',
            title: 'CONTACT US',
            children: [
                {
                    title: 'Contact Us',
                    link: '#contactus'
                },
                {
                    title: 'Help you need?',
                    link: '#what-help-do-you-need'
                },
                {
                    title: 'Our Support',
                    link: '#our-support'
                }
            ]
        },
        {
            id: 'terms',
            title: 'Terms & Condition',
            children: [
                {
                    title: 'Who We Are?',
                    link: '#who-we-are'
                },
                {
                    title: 'Content',
                    link: '#content'
                },
                {
                    title: 'General',
                    link: '#general'
                },
                {
                    title: 'Rules',
                    link: '#rules'
                }
            ]
        }
    ];
    public sideBarLinks: {
        id: string;
        title: string;
        active?: boolean,
        children: Array<{title: string; active?: boolean; link: string}>
    } = {} as any;

    @ViewChild('asideElement', {static: true})
    public asideElement: ElementRef;

    constructor(private dataService: DataService) {
    }
    ngOnInit(): void {
        this.dataService.onValueChanges.subscribe((valueKey) => {

            this.articleLink.slice().forEach((article) => {
                if ( valueKey.name === 'article' &&
                    valueKey.value === article.id) {
                    this.sideBarLinks = article;
                }
            });
        });
    }

    ngAfterViewInit(): void {
        window.onscroll = (event) => {
            this.watchScroll();

            this.checkAside();
        };

    }

    checkAside() {
        if (this.asideElement.nativeElement.getBoundingClientRect().top + 200 < window.pageYOffset) {
            this.sideBarLinks.active = true;
        } else {
            this.sideBarLinks.active = false;
        }
    }

    watchScroll() {
        this.sideBarLinks.children.forEach((element) => {
            if (element.link) {
                const el: HTMLElement = document.querySelector(element.link);
                if (el && el.getBoundingClientRect().top < window.pageYOffset) {

                    this.sideBarLinks.children.forEach((children) => {
                        if (children.link !== element.link) {
                            children.active = false;
                        } else {
                            element.active = true;
                        }
                    });
                }
            }
        });
    }

    ngOnDestroy(): void {

    }
}
