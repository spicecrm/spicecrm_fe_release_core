/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, ElementRef, Renderer, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {popup} from '../../services/popup.service';
import {modal} from '../../services/modal.service';
import {Router}   from '@angular/router';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';

@Component({
    selector: 'field-relate',
    templateUrl: './src/objectfields/templates/fieldrelate.html',
    providers: [popup]
})
export class fieldRelate extends fieldGeneric implements OnInit {
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
        public renderer: Renderer,
        public modal: modal
    ) {
        super(model, view, language, metadata, router);
    }

    public ngOnInit() {
        const fieldDefs = this.metadata.getFieldDefs(this.model.module, this.fieldname);
        this.relateIdField = fieldDefs.id_name;
        this.relateNameField = this.fieldname;
        this.relateType = fieldDefs.module;
    }

    private closePopups() {
        if (this.model.data[this.relateIdField]) {
            this.relateSearchTerm = '';
        }
        this.relateSearchOpen = false;
    }

    private clearField() {
        this.model.data[this.relateNameField] = '';
        this.model.setField(this.relateIdField, '');
    }

    private onFocus() {
        this.relateSearchOpen = true;
    }

    private setRelated(related) {
        this.model.data[this.relateIdField] = related.id;
        this.model.data[this.relateNameField] = related.text;
        this.closePopups();
    }

    private goRelated() {
        // go to the record
        this.router.navigate(['/module/' + this.relateType + '/' + this.model.getField(this.relateIdField)]);
    }

    private searchWithModal() {
        this.relateSearchOpen = false;
        this.modal.openModal('ObjectModalModuleLookup').subscribe(selectModal => {
            selectModal.instance.module = this.relateType;
            selectModal.instance.multiselect = false;
            selectModal.instance.selectedItems.subscribe(items => {
                if ( items.length ) {
                    this.setRelated({ 'id':items[0].id, 'text': items[0].summary_text, 'data': items[0] });
                }
            });
            selectModal.instance.searchTerm = this.relateSearchTerm;
        });
    }

}
