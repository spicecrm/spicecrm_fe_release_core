/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, OnInit} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {backend} from '../../services/backend.service';
import {configurationService} from '../../services/configuration.service';
import {fieldGeneric} from './fieldgeneric';
import {Router}   from '@angular/router';

@Component({
    selector: 'field-companies',
    templateUrl: './src/objectfields/templates/fieldcompanies.html'
})
export class fieldCompanies extends fieldGeneric implements OnInit{

    companies: Array<any> = [];

    constructor(public model: model, public view: view, public language: language, public metadata: metadata, public router: Router, private backend: backend, private configurationService: configurationService) {
        super(model, view, language, metadata, router);
    }

    ngOnInit(){
        let storedCompanies = this.configurationService.getData('companies');
        if(storedCompanies === false){
            this.backend.getRequest('module/CompanyCodes').subscribe((companies : any) => {
                this.configurationService.setData('companies', companies.list);
                this.companies = companies.list;
                this.setDefault();
            })
        } else {
            this.companies = storedCompanies;
            this.setDefault();
        }
    }

    setDefault(){
        if(this.view.isEditMode() && !this.model.data[this.fieldname] && this.companies.length > 0){
            this.value = this.companies[0].id;
        }
    }

    get companyName(){
        let companyName = '';
        this.companies.some(company => {
            if(company.id == this.model.data[this.fieldname]){
                companyName = company.name;
                return true;
            }
        })
        return companyName;

    }
}