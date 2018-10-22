/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, Input} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {view} from '../../services/view.service';

import {objectimport} from '../services/objectimport.service';

declare var _: any;

@Component({
    selector: 'object-import-fixed',
    templateUrl: './src/objectcomponents/templates/objectimportfixed.html',
    providers: [view]
})


export class ObjectImportFixed {

    @Input('modelfields')
    set modelFields(value: Array<any>) {
        this.modelfields = value;
        this.filteredModuleFileds = value;
    }

    @Input('currentimportstep')
    set currentImportStep(value: number) {
        if (value == 2)
            this.getFilteredModuleFields();
    }

    @Input('requiredmodelfields')
    requiredModelFields: Array<any> = undefined;


    filteredModuleFileds: Array<any> = undefined;
    modelfields: Array<any> = undefined;

    constructor(
        private objectimport: objectimport,
        private language: language,
        private metadata: metadata,
        private model: model,
        private view: view
    ) {
        // set the vie to editable and edit mode
        this.view.isEditable = true;
        this.view.setEditMode();
    }

    get modelFields() {
        return this.modelfields;
    }

    getFilteredModuleFields() {
        let invertedFileMapping = _.invert(this.objectimport.fileMapping);
        this.filteredModuleFileds = this.modelFields.filter(field => {
            return !invertedFileMapping.hasOwnProperty(field.name);
        });

    }

    setFixedField(index, value) {
        this.objectimport.setFixedField(index, value);
    }

    getFixed(row) {
        return this.objectimport.getFixed(row);

    }

    removeFixed(index) {
        this.model.data = _.omit(this.model.data, this.objectimport.fixedFields[index].field);
        this.objectimport.removeFixed(index);
    }

    checkRequired(fieldName) {

        let invertedFileMapping = _.invert(this.objectimport.fileMapping),
            mappedFieldChecked = invertedFileMapping.hasOwnProperty(fieldName),
            fixedFieldChecked = this.objectimport.fixedFields.some(field => field.field == fieldName);

        if (mappedFieldChecked || fixedFieldChecked)
            return true;

        return false;
    }

    isChosen(fieldName) {
        let invertedFileMapping = _.invert(this.objectimport.fileMapping);
        if(invertedFileMapping[fieldName])
            return true;
        return false;
    }

}