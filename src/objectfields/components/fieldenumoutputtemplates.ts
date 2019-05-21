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
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {model} from '../../services/model.service';
import {view} from '../../services/view.service';
import {language} from '../../services/language.service';
import {metadata} from '../../services/metadata.service';
import {Router}   from '@angular/router';
import {backend} from "../../services/backend.service";
import {fieldGeneric} from "./fieldgeneric";

@Component({
    selector: 'field-output-templates',
    templateUrl: './src/objectfields/templates/fieldoutputtemplates.html'
})
export class FieldEnumOutputTemplates extends fieldGeneric implements OnInit{

    isLoaded: boolean = false;
    items = [];
    @Output('select') select$ = new EventEmitter();
    private _selected_item = null;

    constructor(
        public model: model,
        public view: view,
        public language: language,
        public metadata: metadata,
        public router: Router,
        private backend: backend,
    ) {
        super(model, view, language, metadata, router);
    }

    get subjectField(){
        return this.fieldconfig.subject ? this.fieldconfig.subject : 'name';
    }

    get bodyField(){
        return this.fieldconfig.body ? this.fieldconfig.body : 'description_html';
    }

    get isDisabled(){
        return !this.isLoaded || !this.items;
    }

    get selected_item()
    {
        return this._selected_item;
    }

    set selected_item(val)
    {
        this._selected_item = val;
        this.select$.emit(val);
        this.value = val.id;
    }

    ngOnInit(){
        //console.log(this.model.data, this.model.module);
        let params = {
            searchfields:
                {
                    join: 'AND',
                    conditions:[
                        {field: 'module_name', operator: '=', value: this.model.module}
                    ]
                }
        };

        this.backend.all('OutputTemplates', params).subscribe(
            (data: any) => {
                this.items = data;

                if( !this.selected_item && this.value )
                {
                    for(let item of this.items)
                    {
                        if(this.value == item.id)
                            this.selected_item = item;
                    }
                }

            }
        );

        this.isLoaded = true;
    }

}