/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, Input, HostBinding} from '@angular/core';

import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {backend} from '../../../services/backend.service';

@Component({
    templateUrl: './src/modules/campaigns/templates/campaigntaskactivatebutton.html',
    host: {
        'class': 'slds-button slds-button--neutral',
        '[style.display]': 'getDisplay()'
    },
    styles: [
        ':host {cursor:pointer;}'
    ]
})
export class CampaignTaskActivateButton {

    activating: boolean = false;

    constructor(private language: language, private metadata: metadata, private model: model, private toast: toast, private backend: backend) {
    }

    getDisplay() {

        // not for email
        if(this.model.getFieldValue('campaigntask_type') == 'Email')
            return 'none';

        // not if activated
        if(this.model.getFieldValue('activated'))
            return 'none';

        return this.model.isEditing || this.model.data.activated === true ? 'none' : '';
    }

    activate() {
        // if we are activating .. do nothing
        if(this.activating) return;

        // set activating indicator
        this.activating = true;

        // execute on backend
        this.backend.postRequest('/module/CampaignTasks/' + this.model.id + '/activate').subscribe(status => {
            this.activating = false;

            // send toast and set actrive
            if (status.success) {
                this.toast.sendToast('Activated');
                this.model.setField('activated', true);

            }
            else
                this.toast.sendToast('Error');
        })
    }

}