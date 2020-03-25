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
    AfterViewInit,
    Component,
    Input,
    OnInit,
    ViewChild,
    ViewContainerRef
} from '@angular/core';

import {metadata} from '../../../services/metadata.service';

declare var _: any;

@Component({
    selector: 'reporter-field-container',
    templateUrl: './src/modules/reports/templates/reporterfieldcontainer.html'
})
export class ReporterFieldContainer implements AfterViewInit {

    @ViewChild('reportFieldContainer', {
        read: ViewContainerRef,
        static: false
    }) private reportFieldContainer: ViewContainerRef;

    @Input() private record: any = {};
    @Input() private value: any = {};
    @Input() private field: any = {};

    constructor(private metadata: metadata) {

    }

    public ngAfterViewInit() {
        let fieldType = 'ReporterFieldStandard';

        // if we have a value an no record ... create the record
        if (this.value && _.isEmpty(this.record)) {
            this.record = {};
            this.record[this.field.fieldid] = this.value;
            this.record[this.field.fieldid + '_val'] = this.value;
        }

        if (this.field.component) {
            fieldType = this.field.component;
        } else {
            switch (this.field.type) {
                case 'percentage':
                    fieldType = 'ReporterFieldPercentage';
                    break;
                case 'currency':
                    fieldType = 'ReporterFieldCurrency';
                    break;
                case 'currencyint':
                    fieldType = 'ReporterFieldCurrency';
                    break;
                case 'enum':
                    fieldType = 'ReporterFieldEnum';
                    break;
                case "datetimecombo":
                case "datetime":
                    fieldType = 'ReporterFieldDateTime';
                    break
                case 'date':
                    fieldType = 'ReporterFieldDate';
                    break;
                case 'text':
                    fieldType = 'ReporterFieldText';
                    break;
                default:
                    fieldType = 'ReporterFieldStandard';
                    break;
            }
        }

        this.metadata.addComponentDirect(fieldType, this.reportFieldContainer).subscribe(componentRef => {
            componentRef.instance.record = this.record;
            componentRef.instance.field = this.field;
        });

    }


    get hasLink() {
        return this.field.link == 'yes';
    }

    get recordModule() {
        if (this.hasLink && this.record) {
            // route to the proper module
            if (this.field.linkinfo && this.field.linkinfo[this.record.unionid ? this.record.unionid : 'root']) {
                return this.field.linkinfo[this.record.unionid ? this.record.unionid : 'root'].module;
            } else {
                return this.record.sugarRecordModule;
            }
        } else {
            return '';
        }
    }

    get recordId() {
        if (this.hasLink && this.record) {
            // route to the proper module
            if (this.field.linkinfo && this.field.linkinfo[this.record.unionid ? this.record.unionid : 'root']) {
                return this.record[this.field.linkinfo[this.record.unionid ? this.record.unionid : 'root'].idfield];
            } else {
                return this.record.sugarRecordId;
            }
        } else {
            return '';
        }
    }
}
