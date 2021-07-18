import { DomSanitizer, Title } from '@angular/platform-browser';
import { QueryList, ElementRef } from '@angular/core';
import { Component, OnInit, AfterViewInit, ViewChildren } from '@angular/core';
import { Faq } from 'src/model/Faq';

interface DisplayHeight {
  questionHeight: number,
  answerHeight: number,
  isExpanded: boolean
}

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit, AfterViewInit {
  public questions: Faq[];
  @ViewChildren('article') articles: QueryList<ElementRef>;
  private articleAndItsHeight: Map<HTMLElement, DisplayHeight>;
  public plusIcon: any;

  constructor(private sanitizer: DomSanitizer, private titleService: Title) {
    titleService.setTitle("FAQ - Bosshalls")
    this.questions = [
      new Faq('Who can use Bosshalls?', `Anybody can use Bosshall`),
      new Faq('Must I create my brand profile to broadcast on bosshalls?', `
        Yes. you have to signup your user profile first. This profile is strictly under your 
        control and can’t be accessed by bosshalls and other users. Then if you have a virtual 
        or physical media brand, you will need to create your brand profile to run bosshalls broadcast.
        NB. Brand profiles are always open for the global audience to view.
      `),
      new Faq('Is my data on bosshalls safe?', `
        Yes. your data is safe on bosshalls. On the client side you manage your personal data and no one 
        sees  our profile page. See bosshalls privacy to see more on keeping your data safe.
      `),
      new Faq('What is a spread?', `
        Spreads are graphical representations of shows/programs lined up for bosshalls broadcast. 
        Media brands spread this graphics containing visual information of their shows to inform 
        the audience and enable access to join and stream the show.
      `),
      new Faq('Who can create spreads on bosshalls?', `
        Create spread feature is only available to users and accounts that create media brand profiles.
      `),
      new Faq('How many brands can I follow?', `
        Limitless
      `),
      new Faq('Why should I add my media brand executives on my brand profile?', `
        So bosshalls wants the audience to know the talents behind the daily work-flow of the 
        brands they’ve been following for years. A vital way of helping with such recognition 
        which they deserve is by creating an opportunity for them to be represented on brand profiles.
      `),
      new Faq('How do I differentiate new,old and ongoing spread on my homepage?', `
        All new and ongoing spread has three triangular dots on it. The old spread doesn’t. 
        This indicates elapsed broadcast. Episodic spreads are recurring. Audiences can access 
        recurring broadcasts whenever it’s airing.
      `),
      new Faq('What is the subscribers page?', `
        This page houses all the data of audiences streaming a particular show. 
        It allows brands to invite guests, hosts, special audiences and even ban audiences. 
        Call it a data center. It is exclusive to brands and it is hosted on each spread on 
        the broadcast section of the spread creator’s homepage. This feature is exclusive to 
        users/accounts who create spreads.
      `),
      new Faq('Who is a show manager?', `
        On bosshalls, manager permission are special users among the audience that are assigned 
        to help host manage display activities like frequent display of videos and pictures 
        depending on the broadcast setup.
      `),
      new Faq('Can I test-run my shows before the main event?', `
        Yes. as the show host needing to test-run shows is hassle free. 
        Just invite your test guest and audience via the subscribers page and 
        hit the broadcast CTA to load your content on the presentation section. 
        Go live with your test team via the broadcast and access broadcast button 
        to certify your prowess before the main event.
      `),
      new Faq('What show categories air on bosshall?', `
        Everything sports, entertainment and varieties
      `),
      new Faq('Mode of invitation?', `
        Spread creators will encounter public and direct mode of invitations.
        Public invitations allow random audiences to access broadcasts with restriction just like the conventional radio shows.
        Direct invitation is strictly on invitation.sports journalists for instance can use this mode of invasion to invite sports personalities for interviews. Spreads on this mode are seen by special handles invited for the event.
      `)
    ];
    this.articleAndItsHeight = new Map;
    this.plusIcon = this.sanitizer.bypassSecurityTrustHtml(`
                <svg class="svg-icon">
                  <use xlink:href="#plus-circle-outline"></use>
                </svg>`);
  }

  expandArticle(article: HTMLElement) {
    let displayProperties = this.articleAndItsHeight.get(article);
    if (displayProperties.isExpanded) {
      article.style.height = `${displayProperties.questionHeight}px`;
      displayProperties.isExpanded = false;
    } else {
      article.style.height = `${displayProperties.answerHeight}px`;
      displayProperties.isExpanded = true;
      // article.querySelector('.icon').innerHTML = this.sanitizer.bypassSecurityTrustHtml(`
      //         <svg class="svg-icon">
      //           <use xlink:href="#plus-circle-outline"></use>
      //         </svg>`);
    }

  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.articles.forEach(article => {
      let collapsedHeight = article.nativeElement.querySelector('header').offsetHeight;
      let expandedHeight = article.nativeElement.offsetHeight;
      this.articleAndItsHeight.set(article.nativeElement, {
        questionHeight: collapsedHeight,
        answerHeight: expandedHeight,
        isExpanded: false
      });
      article.nativeElement.style.height = `${collapsedHeight}px`;
    })
  }

}
