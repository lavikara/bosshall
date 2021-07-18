import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(private titleService: Title) {
    titleService.setTitle('About - Bosshalls')
  }

  playVideo(vid: any, icon: HTMLElement) {
    vid.addEventListener("playing", function () {
      icon.style.display = 'none';
    });

    vid.addEventListener("pause", function () {
      icon.style.display = 'inline-block';
    });

    vid.addEventListener("stop", function () {
      icon.style.display = 'inline-block';
    });

    vid.play();
  }

  ngOnInit(): void {
  }

}
