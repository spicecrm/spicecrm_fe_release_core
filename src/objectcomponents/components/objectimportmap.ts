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

import {objectimport} from '../services/objectimport.service';

declare var _: any;

@Component({
    selector: 'object-import-map',
    templateUrl: './src/objectcomponents/templates/objectimportmap.html',
})
export class ObjectImportMap {

    @Input('modelfields') modelFields: Array<any> = undefined;
    @Input('requiredmodelfields') requiredModelFields: Array<any> = undefined;

    constructor(private objectimport: objectimport, private language: language, private metadata: metadata, private model: model) {
    }

    get idFieldAction() {
        return this.objectimport.idFieldAction;
    }

    set idFieldAction(action) {
        this.objectimport.idFieldAction = action;
        if (action == 'auto')
            this.objectimport.idField = '';
    }

    get description() {
        return this.objectimport.stepLongText;
    }

    getMapping(row) {
        return this.objectimport.getMapping(row);
    }

    setMapping(row, event) {
        this.objectimport.setMapping(row, event.srcElement.value);
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