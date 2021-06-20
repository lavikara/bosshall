import {StreamManager} from 'openvidu-browser';

export interface SideStreamUiInterface {
    open();
    remove();
    onMinimize(event: any);
    addStream(stream: StreamManager);
    onDisconnect(event: any);
}


