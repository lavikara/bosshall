interface FileInterface {
    path: string;
    fileType: 'audio' | 'video' | 'image';
    duration?: number;
    volume?: number;
    spread: number;
    sender: number;
}
