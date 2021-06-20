export interface PresentationActionInterface {
    /**
     * @param fileInterface
     */
    sendFile(fileInterface: FileInterface);

    /**
     * pause
     */
    pause();

    /**
     * stop
     */
    stop();

    /**
     * play
     */
    play();

    /**
     * Seek
     */
    seek(duration: number);
}
