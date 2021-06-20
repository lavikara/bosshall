interface RecorderListener {
    onUploaded(event);
    onError(res: string);
    onComplete(blob: Blob, spreadId: number);
    onStartPlaying();

}
