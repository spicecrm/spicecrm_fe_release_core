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
 * @module ObjectFields
 */
import {Component, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {currency} from '../../services/currency.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';
import {userpreferences} from '../../services/userpreferences.service';

@Component({
    selector: 'field-currency',
    templateUrl: './src/objectfields/templates/fieldcurrency.html'
})
export class fieldCurrency extends fieldGeneric implements OnInit {

    /**
     * holds an array of currencies
     */
    public currencies: any[] = [];

    /**
     * the reference to the field with the currency id
     */
    private currencyidfield: string = '';

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, public currency: currency, public userpreferences: userpreferences) {
        super(model, view, language, metadata, router);
        this.currencies = this.currency.getCurrencies();
    }

    /**
     * @ignore
     */
    public ngOnInit() {
        this.currencyidfield = this.fieldconfig.field_currencyid;

        // if not check if the modl has a currncy_id field
        if (!this.currencyidfield) {
            let modelFields = this.metadata.getModuleFields(this.model.module);
            if (modelFields.currency_id) this.currencyidfield = 'currency_id';
        }
    }

    /**
     * helper to get the currency symbol
     */
    private getCurrencySymbol(): string {
        let currencySymbol: string;
        let currencyid = -99;
        if (this.currencyidfield) {
            if (!this.model.data[this.currencyidfield]) return '';
            else currencyid = this.model.data[this.currencyidfield];
        }
        this.currencies.some(currency => {
            if (currency.id == currencyid) {
                currencySymbol = currency.symbol;
                return true;
            }
        });
        return currencySymbol;
    }

    /**
     * override the getter for the value
     */
    get value() {
        let fieldval = this.model.getFieldValue(this.fieldname);

        if (fieldval === undefined) return '';
        let val = parseFloat(fieldval);
        if (isNaN(val)) return '';
        return this.userpreferences.formatMoney(val);
    }

    /**
     * override the setter for the value
     *
     * @param val
     */
    set value(val) {
        val = val.split(this.userpreferences.toUse.num_grp_sep).join('');
        val = val.split(this.userpreferences.toUse.dec_sep).join('.');
        if (isNaN(val = parseFloat(val))) {
            this.model.setField(this.fieldname, '');
        } else {
            // this.value = Math.floor(val * Math.pow(10, this.userpreferences.toUse.default_currency_significant_digits)) / Math.pow(10, this.userpreferences.toUse.default_currency_significant_digits);
            this.model.setField(this.fieldname, Math.floor(val * Math.pow(10, this.userpreferences.toUse.default_currency_significant_digits)) / Math.pow(10, this.userpreferences.toUse.default_currency_significant_digits))
        }
    }
}