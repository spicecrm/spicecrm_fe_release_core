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
    Component,
    Output,
    EventEmitter,
    OnInit
} from '@angular/core';

import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {view} from "../../services/view.service";

@Component({
    selector: 'object-edit-modal-dialog-duplicates-panel',
    templateUrl: './src/objectcomponents/templates/objecteditmodaldialogduplicatespanel.html',
    providers: [view]
})
export class ObjectEditModalDialogDuplicatesPanel implements OnInit {

    /**
     * an output when the panel emits that it shopudl be closed
     */
    @Output() private close: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * holds the fieldset for the fields to be displayed in the item. This is determined when the component is initialized from the component configuration
     */
    private fieldset: string = '';

    constructor(private model: model, private metadata: metadata, private language: language, private view: view) {
        this.view.isEditable = false;
    }

    /**
     * initializes and loads the fieldset
     */
    public ngOnInit() {
        let componentconfig = this.metadata.getComponentConfig('GlobalModalDialogDuplicates', this.model.module);
        this.fieldset = componentconfig.fieldset;
    }

    /**
     * private handler for the close button that emits that the panel should close
     */
    private hidePanel(){
        this.close.emit(true);
    }
}