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
 * @module AdminComponentsModule
 */
import {Component} from '@angular/core';
import {backend} from '../../services/backend.service';
import {toast} from "../../services/toast.service";
import {language} from "../../services/language.service";


/**
 * @ignore
 */
declare var moment: any;

@Component({
    selector: 'administration-dict-repair',
    templateUrl: './src/admincomponents/templates/administrationdictrepair.html'
})
export class AdministrationDictRepair {

    private loading: boolean = false;
    private sqlresult: string = '';
    private dbErrors: any = [];

    constructor(private backend: backend, private toast: toast, private language: language) {
    }

    /**
     * execute db repair and save the response
     */
    private doRepair() {
        this.loading = true;
        this.backend.postRequest('dictionary/repair').subscribe((result: any) => {
            if (!result.response) {
                this.dbErrors = result.errors;
            } else if (result.synced) {
                this.toast.sendToast(this.language.getLabel('LBL_REPAIR_DATABASE_ALREADY_SYNCED'), 'success');
            } else {
                this.sqlresult = result.sql;
                this.toast.sendToast(this.language.getLabel('LBL_REPAIR_DATABASE_SYNCED'), 'success');
            }
            this.loading = false;
        });
    }

}
