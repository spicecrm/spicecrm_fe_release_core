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

@Component({
    selector: 'field-email',
    templateUrl: './src/objectfields/templates/fieldemail.html'
})
export class fieldEmail extends fieldGeneric {

    private invalid = false;
    private mark: string;

    // from https://emailregex.com
    private validation = new RegExp('^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$');

    constructor(public model: model, public view: view, public l: language, public metadata: metadata, public router: Router) {
        super(model, view, l, metadata, router);
        this.mark = this.model.generateGuid();
    }

    get email() {
        return this.value;  // <--- not needed anymore? :o
    }

    get value() {
        let email = '';
        let emailaddresses = this.model.getFieldValue('emailaddresses');
        if (emailaddresses) {
            for (let emailaddress of emailaddresses) {
                if (emailaddress.primary_address == 1) {
                    email = emailaddress.email_address;
                }
            }
        }
        return email;
    }

    set value(newemail) {

        if (this.invalid && this.validation.test(newemail)) {
            this.model.resetFieldMessages(this.fieldname, 'error', this.mark);
            this.invalid = false;
        }

        if (!this.model.getFieldValue('emailaddresses') || this.model.getFieldValue('emailaddresses').length == 0) {
            let newEmail = {
                id: '',
                primary_address: '1',
                email_address: newemail,
                email_address_caps: newemail.toUpperCase(),
                email_address_id: ''
            };
            this.model.setField('emailaddresses', [newEmail]);
        } else {
            for (let emailaddress of this.model.getFieldValue('emailaddresses')) {
                if (emailaddress.primary_address == 1) {
                    emailaddress.email_address = newemail;
                    emailaddress.email_address_caps = newemail.toUpperCase();
                    emailaddress.email_address_id = '';
                    emailaddress.id = '';
                }
            }
        }
    }

    private changed() {

        if (!this.value || this.value == '') {
            this.model.resetFieldMessages(this.fieldname, 'error', this.mark);
            this.invalid = false;
        } else if (this.validation.test(this.value)) {
            this.model.resetFieldMessages(this.fieldname, 'error', this.mark);
            this.invalid = false;
        } else {
            this.model.setFieldMessage('error', this.l.getLabel('LBL_INPUT_INVALID'), this.fieldname, this.mark);
            this.invalid = true;
        }
    }

    private sendEmail() {
        if (this.model.data[this.fieldname] != '') {
            window.location.assign('mailto:' + this.model.data[this.fieldname]);
        }
    }

}
