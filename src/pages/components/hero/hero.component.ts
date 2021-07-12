import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss']
})
export class HeroComponent implements OnInit {
  @Input('elementToScrollto') elementToScrollTo: HTMLElement;

  constructor() { }

  scrollDown() {
    this.elementToScrollTo.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }

  ngOnInit(): void {
  }

}
