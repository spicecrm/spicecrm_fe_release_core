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
 * @module services
 */
import {EventEmitter, Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable()
export class view {
    /**
     * the mode of the view
     */
    private mode: 'view' | 'edit' = 'view';

    /**
     * an event emitter that fires when the mode changes
     */
    public mode$: BehaviorSubject<string>;

    /**
     * defines if the view can be set to edit mode or not
     */
    public isEditable: boolean = false;

    /**
     * prevent displaing links in fields when this is set to true
     */
    public displayLinks: boolean = true;

    /**
     * prevents label from displaying when this is set to false
     */
    public displayLabels: boolean = true;

    /**
     * the edit field ID that is passed in when the edit mode is set
     *
     * the field can query that to gain focus
     */
    public editfieldid: string = '';

    // defines the labele .. can be value none, default, long or short
    public labels: 'default' | 'long' | 'short' = 'default';

    // set the size
    public size: 'regular' | 'small' = 'regular';

    constructor() {
        this.mode$ = new BehaviorSubject<string>(this.mode);
    }

    /**
     * allows qeurying the current mode
     */
    public getMode() {
        return this.mode;
    }

    /**
     * checks if the view is in edit mode
     */
    public isEditMode() {
        if (this.mode === 'edit') {
            return true;
        } else {
            return false;
        }
    }

    /**
     * sets the edit mode
     *
     * @param fieldid passes over a field ID .. that alows the field to gain focus
     */
    public setEditMode(fieldid = '') {
        this.mode = 'edit';
        this.editfieldid = fieldid;
        this.mode$.next(this.mode);
    }

    /**
     * sets the view mode
     */
    public setViewMode() {
        this.mode = 'view';
        this.mode$.next(this.mode);
    }
}
