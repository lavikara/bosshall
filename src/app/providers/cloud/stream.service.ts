import {StreamProvider} from './stream/stream-provider';
import {StreamEvent, StreamManager} from 'openvidu-browser';
import {Participants} from '../../../model/Participants';
import {ParticipantEnum} from '../../configuration/audience.enum';

export class CloudCapabilities {
    audienceType: string;
    canVideo: boolean;
    canAudio: boolean;
    canBan: boolean;
    canPresent: boolean;
    canAddPresentation: boolean;
    manageHostPresentation: boolean;
    canChat: boolean;
    canManageRequest: boolean;
}

export abstract class StreamService extends StreamProvider {
    protected token: any;
    private _participants: Array<Participants> = [];
    protected _onlineParticipant: any = {} as any;
    protected getToken(): string {
        return this.token;
    }

    protected isPublisher(): boolean {
        return this.role === 'PUBLISHER';
    }

    protected onError(error: any) {
        console.log('stream error');
        console.log(error);
    }

    protected streamCreated(event: StreamEvent) {
        console.log('stream created');
        console.log(event);
    }

    protected streamDestroyed(event: StreamEvent) {
        if (!event || !event.stream || !event.stream.streamManager) {
            return;
        }
        const userInfo = this.getInfoFromStream(event.stream.streamManager);
        if (userInfo && userInfo.permission === ParticipantEnum.CHIEF_HOST) {
            this.redirect(false);
            this.leaveSession();
        }
    }

    public getInfoFromStream(stream: StreamManager) {

        if (!stream || !stream.stream || !stream.stream.connection) {
            return;
        }
        if (stream && stream.stream.connection && stream.stream.connection.data) {
            const userDataStr = stream.stream.connection.data.substr(5);
           return JSON.parse(userDataStr);
        }
        return {};
    }

    /**
     * @param participant
     */
    protected setParticipant(participant: Participants) {
        let added = false;
        this._participants.forEach((parpnt: Participants) => {
            if (parpnt.id === participant.id) {
                added = true;
            }
        });
        this._onlineParticipant[participant.id] = true;

        if (!added) {
            this._participants.push(participant);
        }
    }

    protected removeParticipant(participant: Participants) {
        for (let i = 0; i < this._participants.length; i++) {
            if (this._participants[i].id === participant.id) {
                this._participants.splice(i, 1);
                delete this._onlineParticipant[participant.id];

            }
        }
    }


    get participants(): Array<Participants> {
        return this._participants;
    }

    get myCapabilities(): CloudCapabilities {
        return this._myCapabilities;
    }

    public isOnline(userId: number) {
        return this._onlineParticipant[userId];
    }
}
