/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, Input, HostBinding} from '@angular/core';
import {Router} from '@angular/router';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {toast} from '../../../services/toast.service';
import {language} from '../../../services/language.service';
import {modal} from '../../../services/modal.service';

@Component({
    selector: 'lead-convert-button',
    templateUrl: './src/modules/leads/templates/leadconvertbutton.html'
})
export class LeadConvertButton {

    public disabled: boolean = true;

    constructor(private language: language, private metadata: metadata, private model: model, private router: Router, private toast: toast, private modal: modal) {
    }

    private execute() {
        if (this.model.data.status === 'Converted') {
            this.toast.sendToast('Lead already Converted', 'warning');
        } else if (this.model.getFieldValue('account_id')) {
            this.modal.openModal('LeadConvertOpportunityModal').subscribe(modalRef => {
                modalRef.instance.lead = this.model;
                modalRef.instance.converted.subscribe((opportunityData: any) => {
                    this.model.setField('status', 'Converted');
                    this.model.setField('opportunity_id', opportunityData.id);
                    this.model.setField('opportunity_name', opportunityData.name);
                    this.model.setField('opportunity_amount', opportunityData.amount);
                    this.model.save();
                });
            });
        } else {
            this.router.navigate(['/module/Leads/' + this.model.id + '/convert']);
        }
    }

    public ngOnInit() {
        this.handleDisabled();
        this.model.mode$.subscribe(mode => {
            this.handleDisabled();
        });

        this.model.data$.subscribe(data => {
            this.handleDisabled();
        });
    }

    private handleDisabled() {
        this.disabled = this.model.getFieldValue('status') === 'Converted' || !this.model.checkAccess('edit') ? true : false;
    }
}
