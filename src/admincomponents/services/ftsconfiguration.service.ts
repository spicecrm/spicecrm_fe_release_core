/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Subject, Observable} from 'rxjs';
import {CanActivate}    from '@angular/router';
import {toast} from "../../services/toast.service";
import {language} from "../../services/language.service";


import {metadata} from '../../services/metadata.service';
import {backend} from '../../services/backend.service';

@Injectable()
export class ftsconfiguration {
    module: string = '';
    moduleFtsFields: Array<any> = [];
    moduleFtsSettings: any = {};
    indexing: boolean = false;

    constructor(
        private backend: backend,
        private metadata: metadata,
        private language: language,
        private toast: toast
    ) {}

    setModule(module) {
        this.module = module;
        this.getModuleFtsFields();
        this.getModuleSettings();
    }

    getModuleFtsFields() {
        this.moduleFtsFields = [];
        this.backend.getRequest('ftsmanager/' + this.module + '/fields').subscribe(fields => {
            this.moduleFtsFields = fields;
        });
    }

    getModuleSettings() {
        this.moduleFtsFields = [];
        this.backend.getRequest('ftsmanager/' + this.module + '/settings').subscribe(settings => {
            this.moduleFtsSettings = settings;
        });
    }

    getFieldDetails(id) {
        let fieldDetails: any = {};

        this.moduleFtsFields.some(field => {
            if (field.id === id) {
                fieldDetails = field;
                return true;
            }
        });

        return fieldDetails;
    }

    save() {
        let postData = {
            fields: this.moduleFtsFields,
            settings: this.moduleFtsSettings
        };
        this.backend.postRequest('ftsmanager/' + this.module, {}, postData).subscribe(response => {
            if (response)
                this.toast.sendToast(this.language.getLabel('LBL_DATA_SAVED'), 'success');
            else
                this.toast.sendToast(this.language.getLabel('ERR_NETWORK'), 'error');
        });
    }

    searchPath(path) {
        let pathFound = false;
        this.moduleFtsFields.some(field => {
            if (field.path === path) {
                pathFound = true;
                return true;
            }
        });
        return pathFound;
    }

    putMapping() {
        this.indexing = true;
        this.backend.deleteRequest('ftsmanager/' + this.module).subscribe(result => {
            this.backend.postRequest('ftsmanager/' + this.module + '/map').subscribe(
                result => {
                    this.indexing = false;
                }
            );
        })
    }

    indexModule() {
        this.indexing = true;
        this.backend.postRequest('ftsmanager/' + this.module + '/index').subscribe(
            result => {
                this.indexing = false;
            },
            error => {
                this.indexing = false;
            }
        )
    }

    initialize() {
        this.indexing = true;
        this.backend.postRequest('ftsmanager/core/initialize').subscribe(
            result => {
                this.indexing = false;
            },
            error => {
                this.indexing = false;
            }
        )
    }


    resetModule() {
        this.indexing = true;
        this.backend.postRequest('ftsmanager/' + this.module + '/resetindex').subscribe(
            result => {
                this.indexing = false;
            },
            error => {
                this.indexing = false;
            }
        )
    }

}
