import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Video } from 'src/model/Video';
import { VideoService } from 'src/app/providers/video/video.service';

declare global {
  interface Window { loadSlickCarousel: any; } // see action.js
}
window.loadSlickCarousel = window.loadSlickCarousel || {};

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, AfterViewInit {
  videos: Video[];

  constructor(private videoService: VideoService) {
    this.videos = videoService.videos;
  }

  playVideo(vid: any, icon: HTMLElement) {
    console.log(vid)
    vid.play();
    icon.style.display = 'none';
    vid.on('ended', function () {
      vid.load();
      vid.pause();
      icon.style.display = 'inline-block'
    });
  }

  stopPlay(vid: any, icon: HTMLElement) {
    vid.pause();
    icon.style.display = 'inline-block';
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    window.loadSlickCarousel();
  }
}
