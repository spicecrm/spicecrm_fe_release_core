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
    Component
} from '@angular/core';
import {currency} from '../../../services/currency.service';
import {userpreferences} from '../../../services/userpreferences.service';

@Component({
    selector: 'reporter-field-curreny',
    templateUrl: './src/modules/reports/templates/reporterfieldcurrency.html'
})
export class ReporterFieldCurrency {

    private record: any = {};
    private field: any = {};

    private currencies: any[] = [];

    constructor(private currency: currency, private userpreferences: userpreferences) {

        this.currencies = this.currency.getCurrencies();

    }

    get currencyidfield() {
        return this.field.fieldid  + '_curid';
    }

    private getCurrencySymbol() {
        let currencySymbol = '';

        if (!this.record[this.field.fieldid]) return currencySymbol;

        let currencyid = -99;
        if (this.currencyidfield) {
            this.record[this.currencyidfield];
        }
        return this.currencies.find(currency => currency.id == currencyid).symbol;
    }

    private getValue() {
        if (this.record[this.field.fieldid]) {
            return this.userpreferences.formatMoney(parseFloat(this.record[this.field.fieldid]));
        } else {
            return '';
        }
    }

}