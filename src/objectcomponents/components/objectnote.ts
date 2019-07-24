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
 * @module ObjectComponents
 */
import {
    Component, OnInit, Input, NgZone
} from '@angular/core';
import {objectnote} from '../services/objectnote.service';
import {DomSanitizer} from "@angular/platform-browser";

/**
 * @ignore
 */
declare var moment: any;

/**
 * displays a quicknote that is read in teh stream
 */
@Component({
    selector: 'object-note',
    templateUrl: './src/objectcomponents/templates/objectnote.html'
})
export class ObjectNote {

    /**
     * the note in the for loop
     */
    @Input() private note: any = {};

    /**
     * @ignore
     *
     * @param objectnote
     */
    constructor(private objectnote: objectnote, public sanitized: DomSanitizer) {

    }

    /**
     * get the timestamp and vonverts into a relative one
     */
    private getNoteTimeFromNow() {
        return moment(this.note.date).fromNow();
    }

    /**
     * delete the note
     */
    private deleteNote() {
        this.objectnote.deleteNote(this.note.id);
    }

    /**
     * sanitizes the value and passes it to the template
     */
    get htmlValue()    {
        return this.sanitized.bypassSecurityTrustHtml(this.note.text);
    }
}
