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
import {Component, Optional, Injector, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {modal} from "../../services/modal.service";
import {modalwindow} from "../../services/modalwindow.service";
import {modellist} from "../../services/modellist.service";


/**
 * This component shows the ObjectActionMergeBeansButton; It opens the "objectactiondeactivatebeansmodal"
 */
@Component({
    selector: 'object-action-deactivate-beans-button',
    templateUrl: './src/objectcomponents/templates/objectactiondeactivatebeansbutton.html'
})
export class ObjectActionDeactivateBeansButton {

    /**
     * the actionconfig passed in from the actionset
     */
    public actionconfig: any;

    /**
     * to sneure the user cannot click twice
     */
    private saving: boolean = false;

    private selectedItems: any = [];

    constructor(
        private language: language,
        private metadata: metadata,
        private modal: modal,
        private injector: Injector,
        private modellist: modellist,
        @Optional() private modalwindow: modalwindow
    ) {

    }

    get disabled() {
        // return this.model.checkAccess('edit') && this.model.checkAccess('deactivate') ? false : true;
        return false;
    }

    get hasSelection() {
        return this.modellist.getSelectedCount() > 1;
    }

    get hidden() {
        return !this.hasSelection;
    }

    /**
     * Click:
     */
    public execute() {
        if (this.saving) return;

        this.selectedItems = this.modellist.getSelectedItems();

        this.modal.openModal('ObjectActionDeactivateBeansModal', true, this.injector).subscribe(editModalRef => {
            if (editModalRef) {
                editModalRef.instance.selectedItems = this.selectedItems;
                editModalRef.instance.module = this.modellist.module;
            }
        });
    }
}





