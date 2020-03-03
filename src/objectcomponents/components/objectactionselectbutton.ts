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
import {Component, OnDestroy, OnInit} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {relatedmodels} from '../../services/relatedmodels.service';
import {modal} from '../../services/modal.service';
import {language} from '../../services/language.service';
import {Subscription} from "rxjs";

@Component({
    selector: 'object-action-select-button',
    templateUrl: './src/objectcomponents/templates/objectactionselectbutton.html',
    providers: [model]
})
export class ObjectActionSelectButton implements OnInit, OnDestroy {

    public actionconfig: any = {};
    public disabled: boolean = true;
    private subscriptions: Subscription = new Subscription();

    constructor(private metadata: metadata, private language: language, private modal: modal, private model: model, private relatedmodels: relatedmodels) {
    }

    public ngOnInit() {
        // set model.module from relatedmodels
        this.model.module = this.relatedmodels.relatedModule;

        // enable button if the list action granted.
        if (this.model.module && this.metadata.checkModuleAcl(this.model.module, "list")) {
            this.disabled = false;
        }
    }

    /*
    * @openModal ObjectModalModuleDBLookup
    * @pass searchConditions
    * @pass module
    * @pass multiselect = true
    * @pass modulefilter
    * @subscribe to selectedItems
    * @call addSelectedItems
    */
    public execute() {
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = this.model.module;
            selectModal.instance.multiselect = true;
            selectModal.instance.modulefilter = this.actionconfig.modulefilter;
            selectModal.instance.selectedItems.subscribe(items => {
                this.addSelectedItems(items);
            });
        });
    }

    /*
    * @unsubscribe subscriptions
    */
    public ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }

    /*
    * @call relatedmodels.addItems
    * @pass event: any[]
    */
    private addSelectedItems(event) {
        this.relatedmodels.addItems(event);
    }
}
