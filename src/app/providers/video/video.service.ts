import { Injectable } from '@angular/core';
import { Video } from 'src/model/Video';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  public videos: Video[];

  constructor() {
    this.videos = [
      new Video('/assets/vids/video1.mp4'),
      new Video('/assets/vids/video2.mp4'),
      new Video('/assets/vids/video3.mp4')
    ]
  }
}
