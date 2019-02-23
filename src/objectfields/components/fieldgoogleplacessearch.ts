/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {fieldGeneric} from './fieldgeneric';
import {Router} from '@angular/router';

declare var _: any;
@Component({
    selector: 'field-google-places-search',
    templateUrl: './src/objectfields/templates/fieldgoogleplacessearch.html'
})
export class fieldGooglePlacesSearch extends fieldGeneric {

    public options: any[] = [];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router) {
        super(model, view, language, metadata, router);


    }

    private setDetails(details){
        let changedFields = {};
        if(this.fieldconfig.formatted_phone_number && details.formatted_phone_number) {
            changedFields[this.fieldconfig.formatted_phone_number] = details.formatted_phone_number;
        }
        if(this.fieldconfig.international_phone_number && details.international_phone_number) {
            changedFields[this.fieldconfig.international_phone_number] = details.international_phone_number;
        }
        if(this.fieldconfig.website && details.website) {
            changedFields[this.fieldconfig.website] = details.website;
        }
        if(details.address) {
            if (this.fieldconfig.city && details.address.city) {
                changedFields[this.fieldconfig.city] = details.address.city;
            }
            if (this.fieldconfig.country && details.address.country) {
                changedFields[this.fieldconfig.country] = details.address.country;
            }
            if (this.fieldconfig.postalcode && details.address.postalcode) {
                changedFields[this.fieldconfig.postalcode] = details.address.postalcode;
            }
            if (this.fieldconfig.state && details.address.state) {
                changedFields[this.fieldconfig.state] = details.address.state;
            }
            if (this.fieldconfig.street && details.address.street) {
                changedFields[this.fieldconfig.street] = details.address.street;
            }
            if (this.fieldconfig.location_lat && details.address.latitude) {
                changedFields[this.fieldconfig.location_lat] = details.address.latitude;
            }
            if (this.fieldconfig.location_long && details.address.longitude) {
                changedFields[this.fieldconfig.location_long] = details.address.longitude;
            }
        }
        if(!_.isEmpty(changedFields)) {
            this.model.setFields(changedFields);
        }
    }

}
