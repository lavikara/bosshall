interface RecorderAction {
    setup(resource: HTMLVideoElement, audioTrack: any);
    stop();
    pause();
    start();
    setupListeners();
}
