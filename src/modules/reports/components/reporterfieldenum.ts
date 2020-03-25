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
 * @module ModuleReports
 */
import {
    Component, OnInit
} from '@angular/core';
import {language} from "../../../services/language.service";
import {metadata} from "../../../services/metadata.service";

@Component({
    selector: 'reporter-field-enum',
    templateUrl: './src/modules/reports/templates/reporterfieldenum.html'
})
export class ReporterFieldEnum implements OnInit {

    private record: any = {};
    private field: any = {};

    private fieldName: string;
    private moduleName: string;

    constructor(private language: language, private metadata: metadata) {

    }

    public ngOnInit(): void {
        let pathArray = this.field.path.split('::');

        let arrCount = pathArray.length;

        // the last entry has to be the field
        let fieldArray = pathArray[arrCount - 1].split(':');
        this.fieldName = fieldArray[1];

        let moduleArray = pathArray[arrCount - 2].split(':');
        switch (moduleArray[0]) {
            case 'root':
                this.moduleName = moduleArray[1];
                break;
            case 'link':
                let field = this.metadata.getFieldDefs(moduleArray[1], moduleArray[2]);
                this.moduleName = field.module;
                break;
        }

    }

    get value() {
        if (this.fieldName && this.moduleName) {
            return this.language.getFieldDisplayOptionValue(this.moduleName, this.fieldName, this.record[this.field.fieldid + '_val']);
        } else {
            return this.record[this.field.fieldid];
        }
    }

}
