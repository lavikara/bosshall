import { Component, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {
  @Input('elementToScrollto') elementToScrollTo: HTMLElement;
  @Input('isLoginPage') isLoginPage = true;

  constructor(private location: Location) { }

  get isLandingPage(): boolean {
    if (this.location.path(true) != '' && this.location.path(true) != '/home')
      return false;
    return true;
  }

  scrollDown() {
    if (this.elementToScrollTo != null)
      this.elementToScrollTo.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }

  ngOnInit(): void {
  }

}
