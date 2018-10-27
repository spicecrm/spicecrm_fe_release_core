/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {AfterViewInit, Component, Input, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {modal} from '../../services/modal.service';
import {backend} from '../../services/backend.service';
import {session} from '../../services/session.service';
import {activitiyTimeLineService} from '../../services/activitiytimeline.service';
import {ObjectRelatedlistFiles} from "./objectrelatedlistfiles";

@Component({
    selector: 'object-activitiytimeline-add-email',
    templateUrl: './src/objectcomponents/templates/objectactivitytimelineaddemail.html',
    providers: [model, view]
})
export class ObjectActivitiyTimelineAddEmail implements OnInit {

    formFields: Array<any> = [];
    fromEmails: Array<any> = [];
    fromTemplates: Array<any> = [];
    fromInbox: string = '';
    fromTemplate: string = '';
    formFieldSet: string = '';
    isExpanded: boolean = false;
    isInitialized: boolean = false;

    public get firstFormField() {
        return this.formFields.filter((item, index) => index === 0)
    }

    public get moreFormFields() {
        return this.formFields.filter((item, index) => index > 0)
    }

    constructor(private metadata: metadata, private activitiyTimeLineService: activitiyTimeLineService, private model: model, private view: view, private language: language, private session: session, private backend: backend, private modal: modal, private ViewContainerRef: ViewContainerRef) {}

    ngOnInit() {
        // initialize the model
        this.initializeEmail();

        // subscribe to the parent models data Observable
        // name is not necessarily loaded
        this.activitiyTimeLineService.parent.data$.subscribe(data => {
            // if we still have the same model .. update
            if (data.id = this.model.data.parent_id)
                this.model.data.parent_name = data.summary_text;
        });

        // set view to editbale and edit mode
        this.view.isEditable = true;
        this.view.setEditMode();

        // get the fields
        let componentconfig = this.metadata.getComponentConfig('ObjectActivitiyTimelineAddEmail', this.model.module);
        this.formFieldSet   = componentconfig.fieldset;
        this.formFields     = this.metadata.getFieldSetFields(componentconfig.fieldset);
    }

    initializeEmail(){
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

        // set sender and receipients
        this.model.data.recipient_addresses = [];
        this.model.data.from_addr_name = this.session.authData.email;
    }

    determineToAddr(){
        // see if we have anemail from the parent
        if(this.activitiyTimeLineService.parent.data.email1){
            this.model.data.recipient_addresses = [{
                parent_type: this.activitiyTimeLineService.parent.module,
                parent_id: this.activitiyTimeLineService.parent.id,
                email_address: this.activitiyTimeLineService.parent.data.email1,
                id: this.model.generateGuid(),
                address_type: 'to'
            }]
        }
    }

    onFocus() {
        if(!this.isInitialized) {
            this.determineToAddr();

            this.backend.getRequest('EmailManager/outbound').subscribe(data => {
                if(data.length > 0) {
                    for (let entry of data) {
                        this.fromEmails.push(entry);
                    }
                    this.fromInbox = data[0].id;
                }
            });

        }
        this.isExpanded = true;

    }

    cancel(){
        this.isExpanded = false;
    }

    send(){
        this.model.data.to_be_sent = true;
        this.save();
    }

    save(){
        this.model.save().subscribe(data => {
            this.isExpanded = false;
            this.model.data.to_be_sent = false;
            this.initializeEmail();
            this.determineToAddr();
        });
    }

    getSenderEmailAddresses(){
        return [{
            displayname: this.session.authData.first_name + ' ' + this.session.authData.last_name + ' <' + this.session.authData.email + '>',
            email: this.session.authData.email
        }];
    }

    expand(){
        this.modal.openModal('GlobalDockedComposerModal', true, this.ViewContainerRef.injector).subscribe(componentref => {
            // componentref.instance.setModel(this.model);
        })
    }
}