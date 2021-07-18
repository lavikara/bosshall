import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  @ViewChild('burger') private burger: ElementRef;
  @ViewChild('navList') private navList: ElementRef;

  constructor() { }

  menuClicked() {
    this.burger.nativeElement.classList.toggle('menu-button--active');
    this.navList.nativeElement.classList.toggle('list-container--active');
  }

  ngOnInit(): void {
  }

}
