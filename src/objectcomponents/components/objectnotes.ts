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
    Component, OnInit
} from '@angular/core';
import {model} from '../../services/model.service';
import {session} from '../../services/session.service';
import {language} from '../../services/language.service';
import {objectnote} from '../services/objectnote.service';


/**
 * handles the spicenotes on the object allowing users to add quick notes (private or global visible)
 */
@Component({
    selector: 'object-notes',
    templateUrl: './src/objectcomponents/templates/objectnotes.html',
    providers: [objectnote]

})
export class ObjectNotes implements OnInit {

    /**
     * vraible for th ebingind to the new note when the user enters on e
     */
    private newNote: string = '';

    /**
     * keep track if the textarea is active (focused)
     */
    private _active = false;

    /**
     * indicator that the new note is considered private and not global so only visible to the user who created it or admins
     */
    private isPrivate: boolean = false;

    constructor(private model: model, private objectnote: objectnote, private language: language, private session: session) {

    }

    public ngOnInit() {
        this.objectnote.module = this.model.module;
        this.objectnote.id = this.model.id;

        this.objectnote.getNotes();
    }

    /**
     * resets the note when the user cancels
     */
    private clearNote() {
        this.newNote = '';
        this.isPrivate = false;
    }

    /**
     * adds thje note on the backend
     */
    private addNote() {
        this.objectnote.addNote(this.newNote, this.isPrivate);
        this.newNote = '';
    }


    /**
     * tgggle a note privat or global
     */
    private togglePrivate() {
        this.isPrivate = !this.isPrivate;
    }

    /**
     * returns the proper icon for a private vs global note
     */
    private getPrivateIcon() {
        if (this.isPrivate) {
            return 'lock';
        } else {
            return 'unlock';
        }
    }

    /**
     * returns the image of the current user if the user has mainatned an image
     */
    get userimage() {
        return this.session.authData.userimage;
    }

    /**
     * determine if the publisher is active or not
     */
    get isActive() {
        return this._active || this.newNote !== '';
    }

    /**
     * triggered when the textarea gets the focus
     */
    private onFocus() {
        this._active = true;
    }

    /**
     * triggered when the textarea has a blur event
     */
    private onBlur() {
        this._active = false;
    }

}
