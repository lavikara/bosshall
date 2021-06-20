import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {SpreadModel} from '../../../model/SpreadModel';
import {FileBlobModel} from "../../../model/FileBlobModel";

@Component({
    selector: 'app-inc-spread-flash-component',
    templateUrl: './spread-flash.component.html'
})

export class SpreadFlashIncludeComponent implements OnInit, AfterViewInit {
    private _display: SpreadModel = {} as any;
    private _percentage = 0;
    private _players: Array<SpreadModel> = [];
    private queue: Array<SpreadModel> = [];
    constructor() {

    }

    ngOnInit() {

    }

    private waitLoop() {
        setTimeout(() => {
            this._percentage -= 4;
            if (this._percentage < 1 && this.queue.length) {
                this.startQueue();
            } else if (this._percentage > 0) {
                this.waitLoop();
            }
        }, 1100);
    }


    private startQueue(data?: SpreadModel) {
        if (data && data.id) {
            this.queue.push(data);
        }
        if (!this._percentage) {
            this._percentage = 100;
            if(this.queue && this.queue.length){
                this._display = JSON.parse(JSON.stringify(this.queue[0]));
                this.queue.splice(0,1);
                this.waitLoop();
            }
        }
    }


    get loadingImg(): string {
        return FileBlobModel.loading();
    }

    ngAfterViewInit(): void {

/*        console.log('listing to flash')
        this.pusherService.spreadChannel.bind('create', (event) => {
            console.log('got new Spread', event);
            if (this.players.find(r => r.brand == event.brand)) {
                console.log('got spread from brand');
               this.startQueue(event);
            }
        });*/

    }


    get percentage(): number {
        return this._percentage;
    }

    get players(): Array<SpreadModel> {
        return this._players;
    }

    @Input()
    set players(value: Array<SpreadModel>) {
        this._players = value;
    }

    get display(): SpreadModel {
        return this._display;
    }
}
