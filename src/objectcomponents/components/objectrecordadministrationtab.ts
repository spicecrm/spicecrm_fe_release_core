/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

/**
 * Created by christian on 08.11.2016.
 */
import {AfterViewInit, ComponentFactoryResolver, Component, ViewChild, ViewContainerRef, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';

@Component({
    selector: 'object-record-details-tab',
    templateUrl: './src/objectcomponents/templates/objectrecordadministrationtab.html'
})
export class ObjectRecordAdministrationTab implements OnInit {

    componentconfig: any = {};
    expanded: boolean = true;
    territorymanaged: boolean = false;

    fields: any = {
        'spiceacl_primary_territory': {
            field: 'spiceacl_primary_territory',
            fieldconfig: {}
        },
        'spiceacl_territories_hash': {
            field: 'spiceacl_territories_hash',
            fieldconfig: {}
        },
        'assigned_user_name': {
            field: 'assigned_user_name',
            fieldconfig: {}
        },
        'created_by_name': {
            field: 'created_by_name',
            fieldconfig: {fieldtype: 'modifiedby', field_date: 'date_entered'}
        },
        'modified_by_name': {
            field: 'modified_by_name',
            fieldconfig: {fieldtype: 'modifiedby', field_date: 'date_modified'}
        }
    };

    constructor(private activatedRoute: ActivatedRoute, private metadata: metadata, private model: model, private language: language) {
    }

    ngOnInit() {
        if (this.componentconfig.collapsed) {
            this.expanded = false;
        }

        let fields = this.metadata.getModuleFields(this.model.module)
        {
            if (fields.spiceacl_primary_territory)
                this.territorymanaged = true;
        }

    }


    get hidden() {
        return (this.componentconfig.requiredmodelstate && !this.model.checkModelState(this.componentconfig.requiredmodelstate));
    }

}