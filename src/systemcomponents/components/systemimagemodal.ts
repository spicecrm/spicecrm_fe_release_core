/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module SystemComponents
 */
import { Component, Input } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { language } from '../../services/language.service';

@Component({
    selector: 'system-image-modal',
    templateUrl: './src/systemcomponents/templates/systemimagemodal.html'
})
export class SystemImageModal {

    /**
     * Title of the modal window.
     */
    @Input() public title = '';

    /**
     * Maximal pixel width of the image, when predefined from outside.
     */
    @Input() public maxWidth: number = null;

    /**
     * Maximal pixel height of the image, when predefined from outside.
     */
    @Input() public maxHeight: number = null;

    /**
     * Extern dropped file(s).
     */
    @Input() public droppedFiles: FileList = null;

    /**
     * The data of the image (base64, leaded by the file format, delimited by '|').
     */
    private imageData: string = null;

    /**
     * Observable for submitting the image.
     */
    private answer: Observable<boolean|string> = null;

    /**
     * Subject for submitting the image.
     */
    private answerSubject: Subject<boolean|string> = null;

    /**
     * Reference for the modal.
     */
    private self: any;

    constructor( private language: language ) {
        this.answerSubject = new Subject();
        this.answer = this.answerSubject.asObservable();
    }

    /**
     * Cancel button clicked.
     */
    private cancel(): void {
        this.answerSubject.next( false );
        this.answerSubject.complete();
        this.self.destroy();
    }

    /**
     * Is allowed to save (click save button)?
     */
    private get canSave(): boolean {
        return !!this.imageData;
    }

    /**
     * Save button clicked.
     */
    private save(): void {
        if ( !this.canSave ) return;
        this.answerSubject.next( this.imageData );
        this.answerSubject.complete();
        this.self.destroy();
    }

    public onModalEscX() {
        this.cancel();
    }

}
