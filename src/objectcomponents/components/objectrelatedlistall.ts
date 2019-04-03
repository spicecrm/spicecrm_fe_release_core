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
 * @module ObjectComponents
 */
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute}   from '@angular/router';
import {relatedmodels} from '../../services/relatedmodels.service';
import {model} from '../../services/model.service';
import {navigation} from '../../services/navigation.service';
import {metadata} from '../../services/metadata.service';
import {language} from '../../services/language.service';

/**
 * @ignore
 */
declare var _;

@Component({
    selector: 'object-relatedlist-all',
    templateUrl: './src/objectcomponents/templates/objectrelatedlistall.html',
    providers: [model, relatedmodels]
})
export class ObjectRelatedlistAll implements OnInit {

    private module = '';
    private id = '';
    private link = '';
    private related = '';
    private fieldset: string = undefined;

    private componentconfig: any = {};
    private listfields: any[] = [];

    constructor(private activatedRoute: ActivatedRoute, private navigation: navigation, private language: language, private metadata: metadata, private model: model, private relatedmodels: relatedmodels) {

    }

    public ngOnInit() {
        this.module = this.activatedRoute.params['value']['module'];
        this.link = this.activatedRoute.params['value']['link'];
        this.related = this.activatedRoute.params['value']['related'];
        this.fieldset = this.activatedRoute.params['value']['fieldset'];

        // set theenavigation paradigm
        this.navigation.setActiveModule(this.module);

        // get the bean details
        this.model.module = this.module;
        this.model.id = this.activatedRoute.params['value']['id'];

        this.model.getData(true, 'detailview').subscribe(data => {
            this.navigation.setActiveModule(this.module, this.model.id, data.summary_text);
        });

        // load the config and fieldset
        this.componentconfig = this.metadata.getComponentConfig('ObjectRelatedlistAll', this.related);
        // if nothing is defined, try to take the default list config...
        if(!this.componentconfig.fieldset) {
            this.componentconfig = this.metadata.getModuleDefaultComponentConfigByUsage(this.related, 'list');
        }

        if(_.isEmpty(this.componentconfig)) {
            console.warn(`no componentconfig found for ObjectRelatedlistAll nor ObjectList with module ${this.related}`);
        }

        this.listfields = this.metadata.getFieldSetFields(this.fieldset ? this.fieldset : this.componentconfig.fieldset);
        if(_.isEmpty(this.listfields)) {
            console.warn('no fieldset to use!');
        }

        // load the related data
        this.relatedmodels.module = this.model.module;
        this.relatedmodels.id = this.model.id;
        this.relatedmodels.relatedModule = this.activatedRoute.params['value']['related'];
        this.relatedmodels.linkName = this.link;
        this.relatedmodels.loaditems = 50;
        if ( this.componentconfig.sequencefield ) {
            this.relatedmodels.sequencefield = this.componentconfig.sequencefield;
        } else if ( this.model.fields[this.relatedmodels._linkName].sequence_field ) {
            this.relatedmodels.sequencefield = this.model.fields[this.relatedmodels._linkName].sequence_field;
        }
        this.relatedmodels.getData();
    }

    private goModule() {
        this.model.goModule();
    }

    private goModel() {
        this.model.goDetail();
    }

    get listingTitle() {
        if ( this.metadata.fieldDefs[this.model.module][this.link].vname ) return this.language.getLabel( this.metadata.fieldDefs[this.model.module][this.link].vname );
        return this.language.getModuleName( this.related );
    }

}
