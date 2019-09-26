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
import {
    AfterViewInit,
    ComponentFactoryResolver,
    Component,
    Input,
    NgModule,
    ViewChild,
    ViewContainerRef, OnInit
} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {navigation} from '../../services/navigation.service';
import {language} from '../../services/language.service';
import {administrationconfigurator} from '../services/administrationconfigurator.service';

@Component({
    selector: 'administration-configurator',
    templateUrl: './src/admincomponents/templates/administrationconfigurator.html',
    providers: [administrationconfigurator]
})
export class AdministrationConfigurator implements OnInit {

    componentconfig: any = {};
    displayFilters: boolean = false;
    filters: any = {};

    constructor(
        private metadata: metadata,
        private administrationconfigurator: administrationconfigurator,
        private language: language
    ) {

    }

    ngOnInit() {
        this.administrationconfigurator.dictionary = this.componentconfig.dictionary;
        this.administrationconfigurator.loadEntries(this.componentconfig.fields);
    }

    get count(){
        return this.administrationconfigurator.entries.length;
    }

    private trackByFn(index, item) {
        return item.id;
    }

    getEntries() {
        let entries = [];
        for (let entry of this.administrationconfigurator.entries) {
            // check for filters
            let ignoreentry = false;
            if(this.displayFilters) {
                for (let filterfield in this.filters) {
                    if (!this.administrationconfigurator.isEditMode(entry.id) && this.filters[filterfield] && entry.data[filterfield] && entry.data[filterfield].indexOf(this.filters[filterfield]) == -1)
                        ignoreentry = true;
                }
            }

            if (!ignoreentry)
                entries.push(entry);
        }
        return entries;
    }

    getFields() {
        let fields = [];

        for (let field of this.componentconfig.fields) {
            if (field.hidden !== true)
                fields.push(field);
        }

        return fields;
    }

    addEntry() {
        this.administrationconfigurator.addEntry();
    }

    sort(field) {
        this.administrationconfigurator.sort(field);
    }

    toggleFilter() {
        this.displayFilters = !this.displayFilters;
    }

    clearFilter(){
        this.filters = {};
    }
}