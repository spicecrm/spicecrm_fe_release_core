/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, ElementRef, Renderer2, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {popup} from '../../services/popup.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {broadcast} from '../../services/broadcast.service';
import {fieldGeneric} from './fieldgeneric';

@Component({
    selector: 'field-lookup',
    templateUrl: './src/objectfields/templates/fieldlookup.html',
    providers: [popup]
})
export class fieldLookup extends fieldGeneric implements OnInit {

    private clickListener: any;
    private lookupType: string = '';
    private lookupmoduleSelectOpen: boolean = false;
    private lookupSearchOpen: boolean = false;
    private lookupSearchTerm: string = '';

    constructor(public model: model,
                public view: view,
                public popup: popup,
                public broadcast: broadcast,
                public language: language,
                public metadata: metadata,
                public router: Router,
                private elementRef: ElementRef,
                private renderer: Renderer2) {
        super(model, view, language, metadata, router);

        // subscribe to the popup handler
        this.popup.closePopup$.subscribe(() => this.closePopups());

        // subscriber to the broadcast when new model is added from the model
        this.broadcast.message$.subscribe(message => this.handleMessage(message));
    }

    public ngOnInit() {
        this.lookupType = this.lookupmodules[0];
    }

    get displayAssignedUser() {
        return this.fieldconfig.displayassigneduser;
    }

    get lookupmodules(): Array<string> {
        let lookupmodules = ['Contacts', 'Users'];

        if (this.fieldconfig.lookupmodules) {
            lookupmodules = this.fieldconfig.lookupmodules.replace(/\s/g, '').split(',');
        }

        return lookupmodules;
    }

    get pills() {
        let pills = [];
        for (let lookupModule of this.lookupmodules) {
            if (this.model.data[lookupModule.toLowerCase()] && this.model.data[lookupModule.toLowerCase()].beans) {
                for (let beanid in this.model.data[lookupModule.toLowerCase()].beans) {
                    let bean = this.model.data[lookupModule.toLowerCase()].beans[beanid];

                    // special handling for assigned user
                    if (lookupModule == 'Users' && !this.displayAssignedUser && beanid == this.model.data.assigned_user_id) {
                        continue;
                    }

                    // pus to the pills
                    pills.push({
                        module: lookupModule,
                        id: bean.id,
                        summary_text: bean.summary_text
                    });
                }
            }
        }
        return pills;
    }


    private addItem(item) {
        if (!this.model.data[this.lookupType.toLowerCase()]) {this.model.data[this.lookupType.toLowerCase()] = {beans: {}};}

        this.model.data[this.lookupType.toLowerCase()].beans[item.id] = {
            id: item.id,
            summary_text: item.text
        };
    }

    private handleMessage(message: any) {
        if (message.messagedata.reference) {
            switch (message.messagetype) {
                case 'model.save':
                    if (this.fieldid === message.messagedata.reference) {
                        // clear the searchterm
                        this.lookupSearchTerm = '';

                        // set the model
                        this.addItem({id: message.messagedata.data.id, text: message.messagedata.data.summary_text});
                    }
                    break;
            }
        }
    }

    public onClick(event: MouseEvent): void {
        const clickedInside = this.elementRef.nativeElement.contains(event.target);
        if (!clickedInside) {
            this.closePopups();
        }
    }

    private closePopups() {
        /*
        if (this.model.data[this.parentIdField])
            this.lookupSearchTerm = '';
        */

        this.lookupSearchOpen = false;
        this.lookupmoduleSelectOpen = false;

        this.clickListener();
    }

    private toggleLookupTypeSelect() {
        this.lookupmoduleSelectOpen = !this.lookupmoduleSelectOpen;
        this.lookupSearchOpen = false;
    }

    private setLookupType(lookupType) {
        this.lookupSearchTerm = '';
        this.lookupType = lookupType;
        this.lookupmoduleSelectOpen = false;
    }

    private removeItem(item) {
        this.model.data[item.module.toLowerCase()].beans_relations_to_delete[item.id] = item;
        delete(this.model.data[item.module.toLowerCase()].beans[item.id]);
    }

    private onFocus() {
        // this.getRecent();
        this.lookupmoduleSelectOpen = false;
        this.lookupSearchOpen = true;

        this.clickListener = this.renderer.listen('document', 'click', (event) => this.onClick(event));
    }

    private parentSearchStyle() {
        if (this.lookupSearchOpen) {
            return {
                display: 'block'
            };
        }
    }
}
