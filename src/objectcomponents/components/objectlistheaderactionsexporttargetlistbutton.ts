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
    Component, Injector
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {modal} from '../../services/modal.service';
import {backend} from '../../services/backend.service';
import {modellist} from '../../services/modellist.service';

/**
 * renders in the list header action menu and offers the user the option to export the list to a targetlist
 */
@Component({
    selector: 'object-list-header-actions-export-targetlist-button',
    templateUrl: './src/objectcomponents/templates/objectlistheaderactionsexporttargetlistbutton.html',
})
export class ObjectListHeaderActionsExportTargetlistButton {

    constructor(private injector: Injector, private language: language, private metadata: metadata, private modellist: modellist, private model: model, private modal: modal, private backend: backend) {
    }

    /**
     * cheks the acl rights for the user to export
     */
    get exportdisabled() {
        // check if the user can create a prospetlist
        if (!this.metadata.checkModuleAcl('ProspectLists', 'create')) return true;

        // check if the module can link to a prospectlist
        let hasProspectlistLink = false;
        let fielddefs = this.metadata.getModuleFields(this.modellist.module);
        for (let field in fielddefs) {
            let fielddef = fielddefs[field];
            if(fielddef.type == 'link' && fielddef.module == 'ProspectLists'){
                hasProspectlistLink = true;
                break;
            }
        }
        if(!hasProspectlistLink) return true;

        // check the export right as well
        return !this.metadata.checkModuleAcl(this.model.module, 'export');
    }

    /**
     * returns the number of sleected items or all in the modellist
     */
    get exportcount() {
        let selectedCount = this.modellist.getSelectedCount();
        return selectedCount ? selectedCount : this.modellist.listData.totalcount;
    }

    /**
     * opens a modal to enter the targetlist name
     */
    private export() {
        this.modal.openModal('ObjectListHeaderActionsExportTargetlistModal', true, this.injector);
    }
}
