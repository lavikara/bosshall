import { Injectable } from '@angular/core';
import { Video } from 'src/model/Video';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  public videos: Video[];

  constructor() {
    this.videos = [
      new Video('/assets/vids/1.Welcome-to-Bosshalls.mp4', 'Welcome to Bosshalls'),
      new Video('/assets/vids/2.Creating-your-media-brand-profile.mp4',
        'Creating your media brand profile'),
      new Video('/assets/vids/3.Creating-spread.mp4', 'Creating spread'),
      new Video('/assets/vids/4.How-to-invite-guest-celebrity-to-your-show.mp4',
        'How to invite guest celebrity to your show'),
      new Video('/assets/vids/5.How-to-run-your-bossholls-broadcast-as-a-host-or-guest.mp4',
        'How to run your bossholls broadcast as a host or guest'),
      new Video('/assets/vids/6.How-audience-join-your-show.mp4', 'How audience join your show')
    ]
  }
}
