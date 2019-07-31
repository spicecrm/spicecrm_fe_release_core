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
import {Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';

@Component({
    selector: 'lead-convert-opportunity',
    templateUrl: './src/modules/leads/templates/leadconvertopportunity.html',
    providers: [view, model]
})
export class LeadConvertOpportunity implements AfterViewInit {
    @ViewChild('detailcontainer', {read: ViewContainerRef}) detailcontainer: ViewContainerRef;

    @Input() lead: model = undefined;

    @Output() opportunity: EventEmitter<model> = new EventEmitter<model>();
    @Output() createopportunity: EventEmitter<boolean> = new EventEmitter<boolean>();


    initialized: boolean = false;
    componentSet: string = '';
    componentconfig: any = {};
    componentRefs: any = [];

    // create flag and getter and setter for the checkbox
    createOpportunity: boolean = false;

    get create() {
        return this.createOpportunity;
    }

    set create(value) {
        this.createOpportunity = value;
        this.createopportunity.emit(value);
    }

    constructor(private view: view, private metadata: metadata, private model: model) {
        this.model.module = 'Opportunities';
        this.model.initializeModel();
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    ngOnInit() {
        this.lead.data$.subscribe(data => {
            this.model.data.amount = data.opportunity_amount;
            this.model.data.campaign_name = data.campaign_name;
            this.model.data.campaign_id = data.campaign_id;
        });
        this.opportunity.emit(this.model);
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