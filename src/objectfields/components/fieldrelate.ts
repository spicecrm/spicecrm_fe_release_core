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
 * @module ObjectFields
 */
import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {popup} from '../../services/popup.service';
import {modal} from '../../services/modal.service';
import {Router} from '@angular/router';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {backend} from '../../services/backend.service';
import {toast} from '../../services/toast.service';

@Component({
    selector: 'field-relate',
    templateUrl: './src/objectfields/templates/fieldrelate.html',
    providers: [popup]
})
export class fieldRelate extends fieldGeneric implements OnInit, OnDestroy {
    private relateIdField: string = '';
    private relateNameField: string = '';
    private relateType: string = '';
    private relateSearchOpen: boolean = false;
    private relateSearchTerm: string = '';

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        public elementRef: ElementRef,
        public modal: modal,
        public backend: backend,
        public toast: toast
    ) {
        super(model, view, language, metadata, router);
    }

    /**
     * returns if an icon shoudl be displayed
     */
    get displayicon() {
        return this.fieldconfig.displayicon ? true : false;
    }

    /**
     * retuns if add is disabled for the relate dorpdown
     */
    get disableadd() {
        return this.fieldconfig.disableadd;
    }

    /**
     * simple getter to determine if the field has a link, the view allows for links and if the user has ACL rights to navigate to thte the of the record
     */
    get link() {
        try {
            return this.view.displayLinks;
        } catch (e) {
            return false;
        }
    }

    public ngOnInit() {
        const fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldname);
        this.relateIdField = fieldDefs.id_name;
        this.relateNameField = this.fieldname;
        this.relateType = fieldDefs.module;
    }

    /**
     * closes all dropdowns that might be oipen and clears the searchterm
     */
    private closePopups() {
        if (this.model.getField(this.relateIdField)) {
            this.relateSearchTerm = '';
        }
        this.relateSearchOpen = false;
    }

    /**
     * resets the field on the  model
     */
    private clearField() {
        if (this.fieldconfig.promptondelete) {
            this.modal.confirm(
                this.language.getLabelFormatted('LBL_PROMPT_DELETE_RELATIONSHIP', [this.language.getFieldDisplayName(this.model.module, this.fieldname, this.fieldconfig)], 'long'),
                this.language.getLabelFormatted('LBL_PROMPT_DELETE_RELATIONSHIP', [this.language.getFieldDisplayName(this.model.module, this.fieldname, this.fieldconfig)])
            ).subscribe(response => {
                if (response) {
                    this.removeRelated();
                }
            });
        } else {
            this.removeRelated();
        }
    }

    private removeRelated() {
        this.model.setField(this.relateNameField, '');
        this.model.setField(this.relateIdField, '');
    }

    /**
     * open the recent items when the feld recievs the focus
     */
    private onFocus() {
        this.relateSearchOpen = true;
    }

    /**
     * set the related item
     *
     * @param related the related record
     */
    private setRelated(related) {
        let newFields = {};
        newFields[this.relateIdField] = related.id;
        newFields[this.relateNameField] = related.text;
        this.model.setFields(newFields);
        if (this.fieldconfig.executeCopyRules == 2) {
            this.executeCopyRules(related.id);
        } else if (this.fieldconfig.executeCopyRules == 1) {
            this.modal.confirm('Copy the data from related record?', 'Copy data?').subscribe(answer => answer && this.executeCopyRules(related.id));
        }
        this.closePopups();
    }

    /**
     * if config is set the copy rules are evaluated and data from the related record is copied to the current one
     *
     * @param idRelated the related id
     */
    private executeCopyRules(idRelated) {
        let awaitStopper = this.modal.await('LBL_LOADING');
        this.backend.get(this.relateType, idRelated).subscribe(
            (response: any) => {
                let relateModel = {
                    module: this.relateType,
                    id: response.id,
                    data: response
                };
                this.model.executeCopyRulesParent(relateModel);
                awaitStopper.emit();
            },
            () => {
                this.toast.sendToast('ERR_LOADING_RECORD', 'error');
                awaitStopper.emit();
            });
    }

    /**
     * navigates to the related record
     */
    private goRelated() {
        // go to the record
        this.router.navigate(['/module/' + this.relateType + '/' + this.model.getField(this.relateIdField)]);
    }

    /**
     * opens a search modal
     */
    private searchWithModal() {
        this.relateSearchOpen = false;
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = this.relateType;
            selectModal.instance.modulefilter = this.fieldconfig.modulefilter;
            selectModal.instance.multiselect = false;
            this.subscriptions.add(
                selectModal.instance.selectedItems.subscribe(items => {
                    if (items.length) {
                        this.setRelated({id: items[0].id, text: items[0].summary_text, data: items[0]});
                    }
                })
            );
            selectModal.instance.searchTerm = this.relateSearchTerm;
        });
    }
}
