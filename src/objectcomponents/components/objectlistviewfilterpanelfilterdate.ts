/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, Input, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-listview-filter-panel-filter-date',
    templateUrl: './src/objectcomponents/templates/objectlistviewfilterpanelfilterdate.html'
})
export class ObjectListViewFilterPanelFilterDate implements OnInit
{
    @Input() filter: any = {};
    // should be received from backend...
    readonly operators: any[] = [
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
            operator: 'thisquarter',
            name: 'LBL_THIS_QUARTER'
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
            operator: 'nextquarter',
            name: 'LBL_NEXT_QUARTER'
        },
        {
            operator: 'nextyear',
            name: 'LBL_NEXT_YEAR'
        }
    ];
    options: Array<any> = [];

    constructor(
        private language: language,
        private model: model
    ) {

    }

    ngOnInit() {
        let options = this.language.getFieldDisplayOptions(this.model.module, this.filter.field);
        for (let optionVal in options) {
            if (optionVal != '')
                this.options.push({
                    value: optionVal,
                    display: options[optionVal]
                })
        }
    }

    operatorDisabled() {
        return this.filter.field ? false : true;
    }


    valueDisabled() {
        return true;
        // return this.filter.operator ? false : true;
    }
}
