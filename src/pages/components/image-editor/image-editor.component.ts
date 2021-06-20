import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import 'fabric/dist/fabric.min';
import tuiImageEditor from 'tui-image-editor/dist/tui-image-editor';
import {editorTheme} from '../../../config/editor.theme';
import {MatDialogRef} from '@angular/material/dialog';
import {MediaHelper} from '../../../app/providers/media.helper';

@Component({
    selector: ';app-image-editor-include',
    templateUrl: './image-editor.component.html'
})

export class ImageEditorComponent implements OnInit, AfterViewInit {
    @ViewChild('tuiElement', {static: false})
    public tuiElement: ElementRef;
    private loadedEditor: any;

    constructor(private matDialogRef: MatDialogRef<any>, private mediaHelper: MediaHelper) {

    }


    ngAfterViewInit(): void {
        this.loadedEditor = new tuiImageEditor(this.tuiElement.nativeElement, {
            cssMaxWidth: 800,
            cssMaxHeight: 700,
            includeUI: {
                initMenu: 'filter',
                theme: editorTheme,
                menuBarPosition: 'bottom'
            },
            selectionStyle: {
                cornerSize: 20,
                rotatingPointOffset: 70
            }
        });
    }

    ngOnInit(): void {

    }


    public cancel() {
        this.matDialogRef.close();
    }

    public save() {
        this.mediaHelper.dataUrl2Blob(this.loadedEditor.toDataURL(), (blob) => {
            this.matDialogRef.close(blob);
        });
    }
}
