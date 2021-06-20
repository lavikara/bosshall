/**
 * Drag and Drop utility
 */
export class DragNDropProvider {

    /**
     * @param element
     * @param debug
     * @param multipleFile
     */
    constructor(private element: HTMLElement, private debug: boolean, private multipleFile = false) {
        this._dragging = false;
    }

    /**
     * When element is being dragged
     */
    get dragging(): boolean {
        return this._dragging;
    }
    /**
     * Input Element for Click
     */
    private dragInputElement: HTMLInputElement;

    private _dragging = false;


    /**
     * Receives blob file for each successful drop
     * @param file
     */
    public onFileDropped: any = (file: Blob) => {};

    /**
     * Receive status text for drag
     * @param text
     */
    public onStatus: any = (text: string) => {};

    /**
     * Create An Element
     */
    private createElement() {
        this.dragInputElement = document.createElement('input');
        this.dragInputElement.setAttribute('type', 'file');
        if (this.multipleFile) {
            this.dragInputElement.setAttribute('multiple', 'multiple');
        }
        this.dragInputElement.classList.add('hidden');
        document.body.appendChild(this.dragInputElement);

    }

    /**
     * Print out if debug is turned on
     * @param text
     */
    private debugText(text) {
        if (this.debug) {
            console.log(text);
        }
    }

    /**
     * Show dotted border for dragged container
     * @param event
     */
    private showBorder(event) {
        this.element.style.border = '2px dotted #222222';
    }

    /**
     * turn of the border on drag ends
     * @param event
     */
    private hideBorder(event) {
        this.element.style.border = 'none';
    }

    /**
     * Call to initialize
     */
    public setup() {
        this.debugText('DragNDropProvider::setup called');
        this.createElement();
        this.element.addEventListener('dragenter', (event) => this.onDragEnter(event));
        this.element.addEventListener('drop', (event) => this.onDrop(event));
        this.dragInputElement.addEventListener('change', (event) => this.onDrop(event));
        this.element.addEventListener('dragover', (event) => this.onDragEnter(event));
        this.element.addEventListener('click', (event) =>  this.dragInputElement.click());
    }

    /**
     * Drag enter
     * @param event
     */
    private onDragEnter(event) {
        event.preventDefault();
        this.showBorder(event);
        this.debugText('DragNDropProvider::onDragEnter called');
        this.onStatus('File Dragging. Drop to receive file...');
    }

    /**
     * On Drop
     * @param event
     */
    private onDrop(event) {
        event.preventDefault();
        this.hideBorder(event);
        this.debugText('DragNDropProvider::onDrop File dropped');
        this.onStatus('File dropped');
        this.fileReceived(event);

    }

    /**
     * File recieved
     * @param event
     */
    private fileReceived(event) {
        if (event.target && event.target.files) {
            for (let i = 0; i < event.target.files.length; i++) {
                this.onFileDropped(event.target.files[i]);
            }
        }

        if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length) {
            for (let i = 0; i < event.dataTransfer.files.length; i++) {
                this.onFileDropped(event.dataTransfer.files[i]);
            }
        } else if (event.dataTransfer && event.dataTransfer.items && event.dataTransfer.items.length) {
            for (let i = 0; i < event.dataTransfer.items.length; i++) {
                this.onFileDropped(event.dataTransfer.items[i]);
            }
        }
    }
}
