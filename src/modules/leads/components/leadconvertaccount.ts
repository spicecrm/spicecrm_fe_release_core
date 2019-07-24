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
} from "@angular/core";
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {modelutilities} from "../../../services/modelutilities.service";
import {fts} from "../../../services/fts.service";
import {view} from "../../../services/view.service";
import { language } from '../../../services/language.service';

@Component({
    selector: "lead-convert-account",
    templateUrl: "./src/modules/leads/templates/leadconvertaccount.html",
    providers: [view, model]
})
export class LeadConvertAccount implements AfterViewInit, OnInit {
    @ViewChild("detailcontainer", {read: ViewContainerRef, static: true}) private detailcontainer: ViewContainerRef;

    @Input() private  lead: any = {};

    // outputs for the interaction with the process
    @Output() private account: EventEmitter<model> = new EventEmitter<model>();
    @Output() private createaccount: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() private selectedaccount: EventEmitter<any> = new EventEmitter<any>();

    private initialized: boolean = false;
    private componentSet: string = "";
    private componentconfig: any = {};
    private componentRefs: any = [];
    private createAccount: boolean = false;


    public selectedAccount: any = undefined;
    public matchedAccounts: Array<any> = [];

    get create() {
        return this.createAccount;
    }

    set create(value) {
        this.createAccount = value;
        this.createaccount.emit(value);
    }


    constructor(private view: view, private metadata: metadata, private model: model, private modelutilities: modelutilities, private fts: fts, private language: language) {

        // initialize the model
        this.model.module = "Accounts";
        this.model.initializeModel();

        // initialize the view
        this.view.isEditable = true;
        this.view.setEditMode();

    }

    public ngOnInit() {
        this.lead.data$.subscribe(data => {
            if (data.account_name !== "") {

                this.fts.searchByModules(this.modelutilities.cleanAccountName(data.account_name), ["Accounts"]).subscribe(res => {
                    this.matchedAccounts = res.Accounts.hits;
                    if (this.matchedAccounts.length === 0) {
                        this.create = true;
                    }
                });

                this.model.data.name = data.account_name;
                this.model.data.website = data.website;

                this.model.data.billing_address_street = data.primary_address_street;
                this.model.data.billing_address_city = data.primary_address_city;
                this.model.data.billing_address_postalcode = data.primary_address_postalcode;
                this.model.data.billing_address_state = data.primary_address_state;
                this.model.data.billing_address_country = data.primary_address_country;
            }
        });
        this.account.emit(this.model);
    }

    public ngAfterViewInit() {
        this.initialized = true;
        this.buildContainer();
    }

    private buildContainer() {
        // Close any already open dialogs
        for (let component of this.componentRefs) {
            component.destroy();
        }

        let componentconfig = this.metadata.getComponentConfig("ObjectRecordDetails", this.model.module);
        for (let panel of this.metadata.getComponentSetObjects(componentconfig.componentset)) {
            this.metadata.addComponent(panel.component, this.detailcontainer).subscribe(componentRef => {
                componentRef.instance.componentconfig = panel.componentconfig;
                this.componentRefs.push(componentRef);
            });
        }
    }

    private selectAccount(event) {
        this.selectedAccount = event;
        this.selectedaccount.emit(event);
    }

    private unlinkAccount() {
        this.selectedAccount = undefined;
        this.selectedaccount.emit(undefined);
    }
}
