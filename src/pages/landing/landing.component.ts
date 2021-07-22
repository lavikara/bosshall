import { Router } from '@angular/router';
import { AuthProvider } from './../../app/providers/auth.provider';
import { Component, OnInit, AfterViewInit, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { Video } from 'src/model/Video';
import { VideoService } from 'src/app/providers/video/video.service';
import { Title } from '@angular/platform-browser';

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
  @ViewChildren('vid') videoElements: QueryList<ElementRef>;

  constructor(private videoService: VideoService,
    private titleService: Title,
    private authProvider: AuthProvider,
    private router: Router) {
    titleService.setTitle("Bosshalls - Virutal Hub for Media")
    this.videos = videoService.videos;
  }

  playVideo(vid: any, icon: HTMLElement) {
    // stop all videos first
    this.videoElements.forEach(vid => vid.nativeElement.pause())

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

  stopPlay(vid: any, icon: HTMLElement) { }

  get loggedIn() {
    return this.authProvider.user && this.authProvider.user.id;
  }

  ngOnInit(): void {
    if (this.loggedIn)
      this.router.navigate(['bl/brand']);
  }

  ngAfterViewInit(): void {
    window.loadSlickCarousel();
  }
}
