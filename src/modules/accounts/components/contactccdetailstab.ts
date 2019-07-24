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
 * @module ModuleAccounts
 */
import {Component, Input, ViewChild, ViewContainerRef} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {toast} from '../../../services/toast.service';
import {backend} from '../../../services/backend.service';

/**
* @ignore
*/
declare var moment: any;

@Component({
    selector: 'contact-cc-details-tab',
    templateUrl: './src/modules/accounts/templates/contactccdetailstab.html',
    providers: [model]
})
export class ContactCCDetailsTab {
    @ViewChild('ccdetailscontainer', {read: ViewContainerRef, static: true}) ccdetailscontainer: ViewContainerRef;
    @Input() data: any = undefined;
    @Input('contactid') contactId: string = undefined;
    @Input('ccid') ccId: string = undefined;
    @Input('ccname') ccName: string = undefined;

    constructor(private language: language,
                private metadata: metadata,
                private view: view,
                private toast: toast,
                private backend: backend,
                private model: model) {
    }

    ngOnInit() {
        this.model.module = 'ContactCCDetails';
    }

    ngAfterViewInit() {
        this.buildContainer();
    }

    ngOnChanges() {
        if (this.data) {
            this.model.id = this.data.id;
            this.model.data = this.data;
        } else {
            this.model.id = this.model.generateGuid();
            this.model.data = {
                id: this.model.id,
                name: this.ccName,
                contact_id: this.contactId,
                companycode_id: this.ccId,
                date_entered: new moment(),
                date_modified: new moment(),
            }
        }
    }

    buildContainer() {
        let componentconfig = this.metadata.getComponentConfig('ContactCCDetailsTab', 'Accounts');
        let componentSet = componentconfig.componentset;
        if (componentSet) {
            let components = this.metadata.getComponentSetObjects(componentSet);
            for (let component of components) {
                this.metadata.addComponent(component.component, this.ccdetailscontainer).subscribe(componentref => {
                    componentref.instance.componentconfig = component.componentconfig;
                });
            }
        }
    }
}
