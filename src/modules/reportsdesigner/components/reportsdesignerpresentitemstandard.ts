/*
SpiceUI 2021.01.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * @module ModuleReportsDesigner
 */
import {Component, OnInit} from '@angular/core';
import {language} from "../../../services/language.service";
import {ReportsDesignerService} from "../services/reportsdesigner.service";
import {model} from "../../../services/model.service";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";

@Component({
    selector: 'reports-designer-present-item-standard',
    templateUrl: './src/modules/reportsdesigner/templates/reportsdesignerpresentitemstandard.html'
})
export class ReportsDesignerPresentItemStandard implements OnInit {

    public propertiesFieldName: string = 'standardViewProperties';

    constructor(public language: language, public model: model, public reportsDesignerService: ReportsDesignerService) {
    }

    /**
     * @return listfields: object[]
     */
    get listFields() {
        return this.reportsDesignerService.listFields;
    }

    /**
    * @return standardViewProperties: object
     */
    get properties() {
        return this.model.getField('presentation_params').pluginData[this.propertiesFieldName];
    }

    /**
    * @initializePluginData
     */
    public ngOnInit() {
        const properties = {
            processCount: 'Synchronous',
            listEntries: 25
        };
        this.initializePluginData(properties);
    }

    /**
    * @set standardViewProperties
    * @setField presentation_params
    */
    public initializePluginData(value: object) {
        const presentationParams = this.model.getField('presentation_params');
        if (!presentationParams.pluginData[this.propertiesFieldName]) {
            presentationParams.pluginData[this.propertiesFieldName] = value;
            this.model.setField('presentation_params', presentationParams);
        }
    }

    /*
    * A function that defines how to track changes for items in the iterable (ngForOf).
    * https://angular.io/api/common/NgForOf#properties
    * @param index
    * @param item
    * @return index
    */
    protected trackByFn(index, item) {
        return item.fieldid;
    }
}
