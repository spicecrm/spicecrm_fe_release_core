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
 * @module ModuleCampaigns
 */
import {Component, Injector} from '@angular/core';
import {model} from '../../../services/model.service';
import {modal} from '../../../services/modal.service';
import {language} from '../../../services/language.service';
import {view} from "../../../services/view.service";

@Component({
    selector: 'campaign-task-email-panel',
    templateUrl: './src/modules/campaigns/templates/campaigntaskemailpanel.html'
})
export class CampaignTaskEmailPanel {

    private componentconfig: any = {};

    constructor(private language: language,
                private model: model,
                private injector: Injector,
                private view: view,
                private modal: modal) {

    }

    /**
     * @return matchedModelState: boolean
     */
    get hidden() {
        return (this.componentconfig.requiredmodelstate && !this.model.checkModelState(this.componentconfig.requiredmodelstate));
    }

    /**
     * @openModal ObjectModalModuleLookup
     * @pass module
     * @pass multiselect
     * @setField email_subject
     * @setField email_body
     * @setField email_stylesheet_id
     */
    private copyFromTemplate() {
        this.modal.openModal('ObjectModalModuleLookup', true, this.injector)
            .subscribe(selectModal => {
                selectModal.instance.module = 'EmailTemplates';
                selectModal.instance.multiselect = false;
                selectModal.instance.selectedItems.subscribe(items => {
                    if (items.length) {
                        this.model.setField('email_subject', items[0].subject);
                        this.model.setField('email_body', items[0].body_html);
                        this.model.setField('email_stylesheet_id', items[0].style);
                    }
                });
            });
    }
}
