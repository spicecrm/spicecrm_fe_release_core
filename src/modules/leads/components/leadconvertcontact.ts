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
 * @module ModuleLeads
 */
import {
    Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ViewContainerRef,
    OnInit
} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';

@Component({
    selector: 'lead-convert-contact',
    templateUrl: './src/modules/leads/templates/leadconvertcontact.html',
    providers: [view, model]
})
export class LeadConvertContact implements AfterViewInit, OnInit {
    @ViewChild('detailcontainer', {read: ViewContainerRef, static: true}) detailcontainer: ViewContainerRef;

    @Input() lead: model = undefined;
    @Output() contact: EventEmitter<model> = new EventEmitter<model>();

    initialized: boolean = false;
    componentSet: string = '';
    componentconfig: any = {};
    componentRefs: any = [];

    constructor(private view: view, private metadata: metadata, private model: model) {
        this.model.module = 'Contacts';
        this.model.initializeModel();

        this.view.isEditable = true;
        this.view.setEditMode();
    }

    ngOnInit() {
        console.log(this.model.data);

        this.lead.data$.subscribe(data => {

            this.model.data.degree1 = data.degree1;
            this.model.data.degree2 = data.degree2;
            this.model.data.first_name = data.first_name;
            this.model.data.last_name = data.last_name;
            this.model.data.salutation = data.salutation;
            this.model.data.title_dd = data.title_dd;
            this.model.data.title = data.title;
            this.model.data.department = data.department;
            this.model.data.email1 = data.email1;
            // SPICE-276 form is now using multiple e-mail address field type
            if( data.emailaddresses) {
                for (let item of this.model.data.emailaddresses) {
                    item.email_address = data.email1;
                }
            }

            // this.model.data.emailaddresses = data.emailaddresses;
            this.model.data.phone_work = data.phone_work;
            this.model.data.phone_mobile = data.phone_mobile;
            this.model.data.phone_fax = data.phone_fax;

            if ( data.business_sector ) this.model.data.business_sector = data.business_sector;
            if ( data.business_topic ) this.model.data.business_topic = data.business_topic;

            this.model.data.primary_address_street = data.primary_address_street;
            this.model.data.primary_address_city = data.primary_address_city;
            this.model.data.primary_address_postalcode = data.primary_address_postalcode;
            this.model.data.primary_address_state = data.primary_address_state;
            this.model.data.primary_address_country = data.primary_address_country;
            this.model.data.primary_address_attn = data.primary_address_attn;

        });
        // emit the model
        this.contact.emit(this.model);
    }

    ngAfterViewInit() {
        this.initialized = true;
        this.buildContainer();
    }

    buildContainer() {
        // Close any already open dialogs
        // this.container.clear();
        for (let component of this.componentRefs) {
            component.destroy();
        }

        let componentconfig = this.metadata.getComponentConfig('ObjectRecordDetails', this.model.module);
        for (let panel of this.metadata.getComponentSetObjects(componentconfig.componentset)) {
            this.metadata.addComponent(panel.component, this.detailcontainer).subscribe(componentRef => {
                componentRef.instance['componentconfig'] = panel.componentconfig;
                this.componentRefs.push(componentRef);
            });
        }
    }


}