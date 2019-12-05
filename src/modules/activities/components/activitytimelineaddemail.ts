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
import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {language} from '../../../services/language.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {modal} from '../../../services/modal.service';
import {backend} from '../../../services/backend.service';
import {session} from '../../../services/session.service';
import {activitiyTimeLineService} from '../../../services/activitiytimeline.service';

@Component({
    selector: 'activitytimeline-add-email',
    templateUrl: './src/modules/activities/templates/activitytimelineaddemail.html',
    providers: [model, view]
})
export class ActivityTimelineAddEmail implements OnInit {

    public fromEmails: any[] = [];
    private formFields: any[] = [];
    private fromInbox: string = '';
    private formFieldSet: string = '';
    private isExpanded: boolean = false;
    private isInitialized: boolean = false;

    constructor(private metadata: metadata,
                private activitiyTimeLineService: activitiyTimeLineService,
                private model: model, private view: view,
                private language: language,
                private session: session,
                private backend: backend,
                private modal: modal,
                private ViewContainerRef: ViewContainerRef) {
    }

    public get firstFormField() {
        return this.formFields.filter((item, index) => index === 0);
    }

    public ngOnInit() {
        this.initializeEmail();
        this.subscribeParent();
        this.setEditMode();
        this.getFields();
    }

    private initializeEmail() {
        this.isInitialized = true;
        this.model.module = 'Emails';
        // SPICEUI-2
        this.model.id = this.model.generateGuid();
        this.model.initializeModel();

        // set the parent data
        this.model.data.parent_type = this.activitiyTimeLineService.parent.module;
        this.model.data.parent_id = this.activitiyTimeLineService.parent.id;
        this.model.data.parent_name = this.activitiyTimeLineService.parent.data.summary_text;

        this.model.data.type = 'out';
        this.model.data.status = 'created';

        // set sender and recipients
        this.model.data.recipient_addresses = [];
        this.model.data.from_addr_name = this.session.authData.email;
    }

    private subscribeParent() {
        this.activitiyTimeLineService.parent.data$.subscribe(data => {
            if (this.model.data.recipient_addresses.length == 0) {
                this.determineToAddr();
            }
            // if we still have the same model .. update
            if (data.id == this.model.data.parent_id)
                this.model.data.parent_name = data.summary_text;
        });
    }

    private setEditMode() {
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    private getFields() {
        let conf = this.metadata.getComponentConfig('ActivityTimelineAddEmail', this.model.module);
        this.formFieldSet = conf.fieldset;
        this.formFields = this.metadata.getFieldSetItems(conf.fieldset);
    }

    private onFocus() {
        if (!this.isInitialized) {
            this.determineToAddr();

            this.backend.getRequest('EmailManager/outbound').subscribe(data => {
                if (data.length > 0) {
                    for (let entry of data) {
                        this.fromEmails.push(entry);
                    }
                    this.fromInbox = data[0].id;
                }
            });
        }
        this.isExpanded = true;
    }

    private determineToAddr() {
        // see if we have an email from the parent
        if (this.activitiyTimeLineService.parent.data.email1) {
            this.model.data.recipient_addresses = [{
                parent_type: this.activitiyTimeLineService.parent.module,
                parent_id: this.activitiyTimeLineService.parent.id,
                email_address: this.activitiyTimeLineService.parent.data.email1,
                id: this.model.generateGuid(),
                address_type: 'to'
            }];
        }
    }

    private cancel() {
        this.isExpanded = false;
    }

    private send() {
        this.model.data.to_be_sent = true;
        this.save();
    }

    private save() {
        this.model.save().subscribe(data => {
            this.isExpanded = false;
            this.model.data.to_be_sent = false;
            this.initializeEmail();
            this.determineToAddr();
        });
    }

    private expand() {
        this.modal.openModal('GlobalDockedComposerModal', true, this.ViewContainerRef.injector);
    }
}