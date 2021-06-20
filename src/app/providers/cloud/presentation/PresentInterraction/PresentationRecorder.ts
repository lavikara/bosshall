interface PresentationRecorder {
    stopVideo();
    resumeVideo();
    drawPresentation(element: HTMLElement);
    addAudioTrack(mediaStreamTracks: MediaStreamTrack[]);
}
