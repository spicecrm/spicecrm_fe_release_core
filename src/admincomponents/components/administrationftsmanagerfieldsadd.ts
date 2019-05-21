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
    ViewContainerRef,
    OnDestroy,
    Output,
    EventEmitter
} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";

import {metadata} from '../../services/metadata.service';
import {modelutilities} from '../../services/modelutilities.service';
import {language} from '../../services/language.service';
import {backend} from '../../services/backend.service';
import {ftsconfiguration} from '../services/ftsconfiguration.service';


@Component({
    selector: 'administration-ftsmanager-fields-add',
    templateUrl: './src/admincomponents/templates/administrationftsmanagerfieldsadd.html'
})
export class AdministrationFTSManagerFieldsAdd {

    @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();

    path: Array<any> = [];
    links: Array<any> = [];
    fields: Array<any> = [];
    selectedFields: any = {};

    constructor(private metadata: metadata, private language: language, private ftsconfiguration: ftsconfiguration, private backend: backend, private modelutilities: modelutilities) {
        this.path.push({
            type: 'root',
            module: this.ftsconfiguration.module,
            path: 'root:' + this.ftsconfiguration.module
        });
        this.getLinks();
        this.getFields();
    }

    chooseBreadcrumb(i) {
        this.path = this.path.slice(0, i + 1);
        this.getLinks();
        this.getFields();
    }

    getLinks() {
        this.links = [];
        this.backend.getRequest('ftsmanager/core/nodes', {
            node: 'root',
            nodeid: this.buildNodeid()
        }).subscribe(links => {
            this.links = links;
        });
    }

    setLink(link) {
        this.path.push(link);
        this.getLinks();
        this.getFields();
    }

    getFields() {
        this.fields = [];
        this.backend.getRequest('ftsmanager/core/fields', {nodeid: this.buildNodeid()}).subscribe(fields => {
            let nodeid = this.buildNodeid();
            for (let field of fields) {
                if (this.ftsconfiguration.searchPath(nodeid + '::field:' + field.name)) {
                    field.exists = true;
                }

                this.fields.push(field);
            }
        });
    }

    buildNodeid() {
        let nodeArray = [];
        for (let path of this.path) {
            nodeArray.push(path.path);
        }
        return nodeArray.join('::');
    }

    getFieldLabel(field) {
        let path = this.path[this.path.length - 1].path.split(':');
        return this.language.getFieldDisplayName(path[1], field);
    }

    selectField(field) {
        if (this.selectedFields[this.buildNodeid() + '::field:' + field.name])
            delete(this.selectedFields[this.buildNodeid() + '::field:' + field.name]);
        else {
            let displaypath = '';
            for(let path of this.path){
                if(displaypath != '') displaypath += '->';
                displaypath += path.module;
            }
            field.displaypath = displaypath;
            field.fieldname = field.name;
            field.name = this.getFieldLabel(field.name);

            this.selectedFields[this.buildNodeid() + '::field:' + field.fieldname] = field;
        }
    }

    fieldSelected(fieldname) {
        return this.selectedFields[this.buildNodeid() + '::field:' + fieldname] ? true : false;
    }


    canSave(){
        let itemcount = 0;
        for(let field in this.selectedFields){
            itemcount++;
        }
        return itemcount > 0 ? true : false;
    }


    close() {
        this.closeModal.emit(false);
    }

    save(){
        for(let field in this.selectedFields){
            let fieldid = this.modelutilities.generateGuid();

            let fieldpath = '';
            let fieldpathitems = field.split('::');
            for(let fieldpathitem of fieldpathitems){
                let fieldpathitemelements = fieldpathitem.split(':');
                if(fieldpathitemelements && fieldpathitemelements.length === 3){
                    fieldpath += fieldpathitemelements[2] + '->'
                }
            }

            this.ftsconfiguration.moduleFtsFields.push({
                id: fieldid,
                fieldid: fieldid,
                fieldname: this.selectedFields[field].fieldname,
                name: this.selectedFields[field].name,
                indexfieldname: fieldpath + this.selectedFields[field].fieldname,
                displaypath: this.selectedFields[field].displaypath,
                path: field,
                search: true,
                indextype: 'string',
                index: 'analyzed'
            })
        }
        this.closeModal.emit(true)
    }
}

