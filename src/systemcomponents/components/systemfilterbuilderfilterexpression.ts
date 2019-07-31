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
 * @module WorkbenchModule
 */
import {
    Component, Input, OnInit
} from '@angular/core';
import {backend} from '../../services/backend.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'system-filter-builder-expression',
    templateUrl: './src/systemcomponents/templates/systemfilterbuilderfilterexpression.html',
})
export class SystemFilterBuilderFilterExpression implements OnInit {

    @Input() private module: string;
    @Input() private filterexpression: any = {};

    public fields: any[] = [];
    private operatortype = 'default';

    private operators = {
        default: [
            {
                operator: 'equals',
                name: 'LBL_EQUALS'
            }, {
                operator: 'starts',
                name: 'LBL_STARTS'
            }, {
                operator: 'contains',
                name: 'LBL_OP_CONTAINS'
            }, {
                operator: 'ncontains',
                name: 'LBL_OP_NOTCONTAINS'
            }, {
                operator: 'greater',
                name: 'LBL_OP_GREATER'
            }, {
                operator: 'gequal',
                name: 'LBL_OP_GREATEREQUAL'
            }, {
                operator: 'less',
                name: 'LBL_OP_LESS'
            }, {
                operator: 'lequal',
                name: 'LBL_OP_LESSEQUAL'
            }
        ],
        date: [
            {
                operator: 'today',
                name: 'LBL_TODAY'
            },
            {
                operator: 'past',
                name: 'LBL_PAST'
            },
            {
                operator: 'future',
                name: 'LBL_FUTURE'
            },
            {
                operator: 'thismonth',
                name: 'LBL_THIS_MONTH'
            },
            {
                operator: 'thisyear',
                name: 'LBL_THIS_YEAR'
            },
            {
                operator: 'nextmonth',
                name: 'LBL_NEXT_MONTH'
            },
            {
                operator: 'nextyear',
                name: 'LBL_NEXT_YEAR'
            }
        ],
        bool: [
            {
                operator: 'true',
                name: 'LBL_TRUE'
            },
            {
                operator: 'false',
                name: 'LBL_FALSE'
            }
        ],
        enum: [
            {
                operator: 'equals',
                name: 'LBL_EQUALS'
            }, {
                operator: 'oneof',
                name: 'LBL_ONEOF'
            }, {
                operator: 'empty',
                name: 'LBL_OP_ISEMPTY'
            }
        ]
    }

    constructor(
        private backend: backend,
        private language: language,
        private metadata: metadata,
    ) {

    }

    get field() {
        return this.filterexpression.field;
    }

    set field(field) {
        if (field != this.filterexpression.field) {
            this.filterexpression.field = field;

            // determine the operatorype and reset the operator
            this.determineOperatorType(field);
            this.operator = '';

            // reset the fieldvalue
            this.filterexpression.filtervalue = '';
        }
    }

    get operator() {
        return this.filterexpression.operator;
    }

    set operator(operator) {
        if (operator != this.filterexpression.operator) {
            this.filterexpression.operator = operator;
            this.filterexpression.filtervalue = '';
        }
    }

    get enumValue() {
        let val = this.filterexpression.filtervalue;
        if (val && typeof val != 'string') {
            return val;
        }
        return this.filterexpression.filtervalue = val.length > 1 ? val.split(',') : [val];
    }

    set enumValue(value) {
        this.filterexpression.filtervalue = value.length > 1 ? value.join(',') : value.toString();

    }

    private determineOperatorType(field) {
        let fieldtype = this.metadata.getFieldDefs(this.module, field);
        if (!fieldtype) {return}
        switch (fieldtype.type) {
            case 'date':
            case 'datetime':
            case 'datetimecombo':
                this.operatortype = 'date';
                break;
            case 'bool':
            case 'boolean':
                this.operatortype = 'bool';
                break;
            case 'enum':
            case 'multienum':
                this.operatortype = 'enum';
                break;
            default:
                this.operatortype = 'default';
                break;
        }
    }

    private showValueField() {
        return this.operatortype == 'default' || (this.operatortype == 'enum' && this.filterexpression.operator != 'empty');
    }

    private enumDisabled() {
        return this.operatortype == 'enum' && this.filterexpression.operator != 'equals';
    }

    private getFieldDisplayOptions() {
        let retArray = [];
        let options = this.language.getFieldDisplayOptions(this.module, this.field);
        for (let optionVal in options) {
            retArray.push({
                value: optionVal,
                display: options[optionVal]
            });
        }
        return retArray.filter(item => item.value.length > 0);
    }

    public ngOnInit() {
        let fields = this.metadata.getModuleFields(this.module);
        for (let field in fields) {
            this.fields.push(fields[field]);
        }

        this.fields.sort();

        // set the initial operatortype
        this.determineOperatorType(this.field);
    }

    private delete() {
        this.filterexpression.deleted = true;
    }

    private trackByFn(i, item) {
        return item.value;
    }
}
