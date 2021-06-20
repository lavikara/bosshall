import {Component, EventEmitter, Input, Output} from "@angular/core";
import {QueueService} from "../../../app/providers/queue.service";

@Component({
    selector: 'app-external-website-selector',
    templateUrl: './external-website.component.html'
})

export class ExternalWebsiteComponent {
    @Output()
    public inputChanged: EventEmitter<string[]> = new EventEmitter<string[]>();

    constructor(private delayProvider: QueueService) {
    }

    public websites: Array<string> = [''];


    @Input()
    set injectWebsites(value: Array<string>) {
        this.websites = value;
    }

    public addNewWebsite() {
        this.websites.push('');
    }

    public populateForm(i, event) {
       this.websites[i] = event.target.value
    }

    public sendInput(i, event) {
        this.websites[i] = event.target.value;
        this.delayProvider.delay(() => {
            this.inputChanged.emit(this.websites);
        }, 1000);
    }
}
