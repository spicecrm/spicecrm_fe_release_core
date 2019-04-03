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
import {Component, Input, Output, EventEmitter} from '@angular/core';
import {model} from '../../services/model.service';
import {metadata} from '../../services/metadata.service';
import {popup} from '../../services/popup.service';
import {language} from '../../services/language.service';
import {fts} from '../../services/fts.service';
import {modal} from '../../services/modal.service';

@Component({
    selector: 'field-lookup-search',
    templateUrl: './src/objectfields/templates/fieldlookupsearch.html'
})
export class fieldLookupSearch {
    private searchTerm: string = '';
    private searchTimeout: any = {};
    @Input() private module: string = '';
    @Input() private fieldid: string = '';
    @Input() private modulefilter: string = '';
    @Input() private disableadd: boolean = false;

    @Output() private selectedObject: EventEmitter<any> = new EventEmitter<any>();
    @Output() private searchWithModal = new EventEmitter();

    @Output() private searchtermChange = new EventEmitter<string>();

    @Input() set searchterm(value) {
        this.searchTerm = value;
        if (this.searchTimeout) {window.clearTimeout(this.searchTimeout);}
        this.searchTimeout = window.setTimeout(() => this.doSearch(), 500);
    }

    constructor( private metadata: metadata, public model: model, public popup: popup, public fts: fts, public language: language, private modal: modal ) {
    }

    get canAdd() {
        return !this.disableadd && this.metadata.checkModuleAcl(this.module, 'edit');
    }

    private doSearch() {
        if (this.searchTerm !== '' && this.searchTerm !== this.fts.searchTerm) {
            this.fts.searchByModules(this.searchTerm, [this.module], 10, {}, {}, false, this.modulefilter);
        }
    }

    private setParent(id, text, data) {
        this.searchTerm = '';
        this.searchtermChange.emit(this.searchTerm);

        this.selectedObject.emit({ id, text, data });

        this.popup.close();
    }

    private recordAdded( record ) {
        this.setParent( record.id, record.text, record.data );
    }

    private getSearchResults() {
        let resultsArray = [];
        this.fts.moduleSearchresults.some(results => {
            if (results.module === this.module) {
                resultsArray = results.data.hits;
                return true;
            }
        });
        return resultsArray;
    }

}
