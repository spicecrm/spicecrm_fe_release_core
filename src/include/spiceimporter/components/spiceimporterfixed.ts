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
 * @module SpiceImporterModule
 */
import {Component, Input} from '@angular/core';
import {metadata} from '../../../services/metadata.service';
import {model} from '../../../services/model.service';
import {language} from '../../../services/language.service';
import {view} from '../../../services/view.service';

import {SpiceImporterService} from '../services/spiceimporter.service';

/**
 * @ignore
 */
declare var _: any;

@Component({
    selector: 'spice-importer-fixed',
    templateUrl: './src/include/spiceimporter/templates/spiceimporterfixed.html',
    providers: [view]
})


export class SpiceImporterFixed {

    @Input('requiredmodelfields')
    private requiredModelFields: any[];
    public filteredModuleFileds: any[];
    private modelfields: any[];

    constructor(
        private spiceImport: SpiceImporterService,
        private language: language,
        private metadata: metadata,
        private model: model,
        private view: view
    ) {
        // set the vie to editable and edit mode
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    @Input('currentimportstep')
    set currentImportStep(value: number) {
        if (value == 2) {
            this.getFilteredModuleFields();
        }
    }

    get modelFields() {
        return this.modelfields;
    }

    @Input('modelfields')
    set modelFields(value: any[]) {
        this.modelfields = value;
        this.filteredModuleFileds = value;
    }

    private getFilteredModuleFields() {
        let invertedFileMapping = _.invert(this.spiceImport.fileMapping);
        this.filteredModuleFileds = this.modelFields.filter(field => {
            return !invertedFileMapping.hasOwnProperty(field.name);
        });

    }

    private setFixedField(index, value) {
        this.spiceImport.setFixedField(index, value);
    }

    private getFixed(row) {
        return this.spiceImport.getFixed(row);

    }

    private removeFixed(index) {
        this.model.data = _.omit(this.model.data, this.spiceImport.fixedFields[index].field);
        this.spiceImport.removeFixed(index);
    }

    private checkRequired(fieldName) {

        let invertedFileMapping = _.invert(this.spiceImport.fileMapping),
            mappedFieldChecked = invertedFileMapping.hasOwnProperty(fieldName),
            fixedFieldChecked = this.spiceImport.fixedFields.some(field => field.field == fieldName);

        return mappedFieldChecked || fixedFieldChecked;


    }

    private isChosen(fieldName) {
        let invertedFileMapping = _.invert(this.spiceImport.fileMapping);
        return !!invertedFileMapping[fieldName];

    }

}
