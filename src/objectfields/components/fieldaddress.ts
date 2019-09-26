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
import {Component} from '@angular/core';
import {fieldGeneric} from './fieldgeneric';


/**
 * renders an address field with all elements
 */
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

    /**
     * since multiple addresses can be rendered in the config of the field the key for the address is defined. This returns the key to be used in all other functions
     */
    get addresskey() {
        return this.fieldconfig.key ? this.fieldconfig.key + '_' : '';
    }

    /**
     * builds a formatted address form all elements and renders it on the screen
     */
    private buildAddress() {
        let address = '';
        let address_arr = [];
        if (this.model.data[this.addresskey + 'address_attn']) {
            address_arr.push(this.model.data[this.addresskey + 'address_attn']);
        }
        if (this.model.data[this.addresskey + 'address_street']) {
            address_arr.push(this.model.data[this.addresskey + 'address_street']);
        }
        if (this.model.data[this.addresskey + 'address_postalcode']) {
            address_arr.push(this.model.data[this.addresskey + 'address_postalcode'] + ' ' + this.model.data[this.addresskey + 'address_city']);
        }
        if (this.model.data[this.addresskey + 'address_state']) {
            address_arr.push(this.model.data[this.addresskey + 'address_state']);
        }
        if (this.model.data[this.addresskey + 'address_country']) {
            address_arr.push(this.model.data[this.addresskey + 'address_country']);
        }
        address = address_arr.join(', ');
        return address;
    }

    /**
     * this is called with the event when the autocomplete function returns a selected address from googler search
     *
     * @param address is handed over from the Event Emitter from the autocomplete component
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

    /**
     * getter for the field label if the form is rendered as subform
     */
    private getAddressLabel() {
        return this.language.getLabel(this.fieldconfig.label);
    }

    /**
     * a getter for the street
     */
    get street() {
        return this.model.data[this.addresskey + 'address_street'];
    }

    /**
     * a setter for the street
     *
     * @param value
     */
    set street(value) {
        this.model.setField(this.addresskey + 'address_street', value);
    }

    /**
     * a getter for the attn field
     */
    get attn() {
        return this.model.data[this.addresskey + 'address_attn'];
    }

    /**
     * a setter for the attn field
     * @param value
     */
    set attn(value) {
        this.model.setField(this.addresskey + 'address_attn', value);
    }

    /**
     * a getter for the city field
     */
    get city() {
        return this.model.data[this.addresskey + 'address_city'];
    }

    /**
     * a setter for the city field
     *
     * @param value
     */
    set city(value) {
        this.model.setField(this.addresskey + 'address_city', value);
    }

    /**
     * a getter for the postalcode
     */
    get postalcode() {
        return this.model.data[this.addresskey + 'address_postalcode'];
    }

    /**
     * a setter for the postalcode
     *
     * @param value
     */
    set postalcode(value) {
        this.model.setField(this.addresskey + 'address_postalcode', value);
    }

    /**
     * a getter for the state
     */
    get state() {
        return this.model.data[this.addresskey + 'address_state'];
    }

    /**
     * a setter for the state
     *
     * @param value
     */
    set state(value) {
        this.model.setField(this.addresskey + 'address_state', value);
    }

    /**
     * a getter for the country
     */
    get country() {
        return this.model.data[this.addresskey + 'address_country'];
    }

    /**
     * a setter for the country
     *
     * @param value
     */
    set country(value) {
        this.model.setField(this.addresskey + 'address_country', value);
    }

    /**
     * a getter for the latitude
     */
    get latitude() {
        return this.model.data[this.addresskey + 'address_latitude'];
    }

    /**
     * a setter for the latitude
     *
     * @param value
     */
    set latitude(value) {
        this.model.setField(this.addresskey + 'address_latitude', value);
    }

    /**
     * a getter for the longitude
     */
    get longitude() {
        return this.model.data[this.addresskey + 'address_longitude'];
    }

    /**
     * a setter for the longitude
     *
     * @param value
     */
    set longitude(value) {
        this.model.setField(this.addresskey + 'address_longitude', value);
    }
}
