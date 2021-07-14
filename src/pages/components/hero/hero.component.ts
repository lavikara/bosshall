import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {
  @Input('elementToScrollto') elementToScrollTo: HTMLElement;
  @Input('isLoginPage') isLoginPage = true;

  constructor() { }

  scrollDown() {
    if (this.elementToScrollTo != null)
      this.elementToScrollTo.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }

  ngOnInit(): void {
  }

}
