/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Injectable} from '@angular/core';

@Injectable()

export class objectimport {
    fileName: string = '';
    fileId: string = '';
    fileHeader: Array<any> = [];
    fileData: Array<any> = [];
    fileMapping: any = {};
    fileRows: string = '';
    fixedFields: Array<any> = [];
    importAction: string = 'new';
    checkFields: Array<any> = [];
    savedImports: Array<any> = [];
    importDuplicateAction: string = 'ignore';
    result: any = {};
    fileTooBig: boolean = false;
    importTemplateAction: string = 'none';
    idfield: string = '';
    idFieldAction: string = 'auto';
    templateName: string = undefined;
    enclosure: string = 'none';
    separator: string = 'semicolon';
    stepLongText: string = '';

    constructor() {
    }

    set idField(idField){
        if(this.fileMapping[idField])
            delete this.fileMapping[idField];
        this.idfield = idField;
    }

    get idField(){
        return this.idfield;
    }

    resetSettings() {
        this.fileMapping = {};
        this.fixedFields = [];
        this.checkFields = [];
        this.idField = '';
        this.result = {};
    }

    addFixed() {
        this.fixedFields.push({
            field: undefined
        });
    }

    getFixed(row) {
        let rowIndex = this.fixedFields.indexOf(row);
        if (rowIndex > -1)
            return this.fixedFields[rowIndex].field;
        else
            return '';
    }

    setFixedField(index, value) {
        this.fixedFields[index].field = value;
    }

    removeFixed(index) {
        this.fixedFields.splice(index, 1);
    }

    addCheck() {
        this.checkFields.push({
            field: undefined
        })
    }

    getCheckField(index) {
        if (this.checkFields[index] && this.checkFields[index].field)
            return this.checkFields[index].field;
        else
            return '';
    }

    setCheckField(index, value) {
        this.checkFields[index].field = value;
    }

    removeCheck(index) {
        this.checkFields.splice(index, 1);
    }

    getMapping(importField) {
        if (Object.keys(this.fileMapping).length > 0 && this.fileMapping[importField])
            return this.fileMapping[importField];
        else
            return '';
    }

    setMapping(importField, modelField) {
        if (modelField != '') {
            this.fileMapping[importField] = modelField;
        } else {
            delete(this.fileMapping[importField]);
        }
    }

    setSavedImport(id) {

        this.resetSettings();
        this.savedImports.some(item => {
            if (item.id === id) {
                for (let key in item.mappings) {
                    if (this.fileHeader.indexOf(key) != -1)
                        this.fileMapping[key] = item.mappings[key];
                }
                this.fixedFields = item.fixed;
                this.checkFields = item.checks;
                return true;
            }
        })
    }

}