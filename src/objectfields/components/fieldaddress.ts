/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, Renderer, ViewChild, ViewContainerRef} from '@angular/core';
import {model} from '../../services/model.service';
import {backend} from '../../services/backend.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

@Component({
    selector: 'field-address',
    templateUrl: './src/objectfields/templates/fieldaddress.html'
})
export class fieldAddress extends fieldGeneric {

    /*
    * getter function for the address .. need to build localization for this one
    *  todo: need to build localization for this one
     */
    get value() {
        return this.buildAddress();
    }

    get addresskey() {
        return this.fieldconfig.key ? this.fieldconfig.key + '_' : '';
    }

    private buildAddress() {
        let address = '';
        if (this.model.data[this.addresskey + 'address_street']) {
            address += this.model.data[this.addresskey + 'address_street'];
        }
        if (this.model.data[this.addresskey + 'address_postalcode']) {
            address += ', ' + this.model.data[this.addresskey + 'address_postalcode'] + ' ' + this.model.data[this.addresskey + 'address_city'];
        }
        if (this.model.data[this.addresskey + 'address_country']) {
            address += ', ' + this.model.data[this.addresskey + 'address_country'];
        }
        return address;
    }

    /*
    * getter for the field label if the form is rendered as subform
     */
    private getAddressLabel() {
        return this.language.getModuleLabel(this.model.module, this.fieldconfig.label);
    }

    /*
    * the functions for the autocomplete
     */
    private addressSelected(address) {
            this.street = address.street;
            this.city = address.city;
            this.postalcode = address.postalcode;
            this.state = address.state;
            this.country = address.country;
            this.latitude = address.latitude;
            this.longitude = address.longitude;
    }

    /*
     * getter and setter functions
     */
    get street() {
        return this.model.data[this.addresskey + 'address_street'];
    }

    set street(value) {
        this.model.data[this.addresskey + 'address_street'] = value;
    }

    get attn() {
        return this.model.data[this.addresskey + 'address_attn'];
    }

    set attn(value) {
        this.model.data[this.addresskey + 'address_attn'] = value;
    }

    get city() {
        return this.model.data[this.addresskey + 'address_city'];
    }

    set city(value) {
        this.model.data[this.addresskey + 'address_city'] = value;
    }

    get postalcode() {
        return this.model.data[this.addresskey + 'address_postalcode'];
    }

    set postalcode(value) {
        this.model.data[this.addresskey + 'address_postalcode'] = value;
    }

    get state() {
        return this.model.data[this.addresskey + 'address_state'];
    }

    set state(value) {
        this.model.data[this.addresskey + 'address_state'] = value;
    }

    get country() {
        return this.model.data[this.addresskey + 'address_country'];
    }

    set country(value) {
        this.model.data[this.addresskey + 'address_country'] = value;
    }

    get latitude() {
        return this.model.data[this.addresskey + 'address_latitude'];
    }

    set latitude(value) {
        this.model.data[this.addresskey + 'address_latitude'] = value;
    }

    get longitude() {
        return this.model.data[this.addresskey + 'address_longitude'];
    }

    set longitude(value) {
        this.model.data[this.addresskey + 'address_longitude'] = value;
    }
}
