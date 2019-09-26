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
import { Component, AfterViewInit, OnInit, OnDestroy, Input } from "@angular/core";
import {relatedmodels} from "../../services/relatedmodels.service";
import {model} from "../../services/model.service";
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";


@Component({
    selector: "object-related-list",
    templateUrl: "./src/objectcomponents/templates/objectrelatedlist.html",
    providers: [relatedmodels]
})
export class ObjectRelatedList implements OnInit, OnDestroy, AfterViewInit {

    @Input() public componentconfig: any = {};
    private listfields: any[] = [];
    private fieldset: string = "";
    private editcomponentset: string = "";
    public module: string = "";

    constructor(
        public language: language,
        public metadata: metadata,
        public relatedmodels: relatedmodels,
        public model: model
    ) {
        this.relatedmodels.module = this.model.module;
        this.relatedmodels.id = this.model.id;
    }

    public aclAccess() {
        return this.metadata.checkModuleAcl(this.module, "list");
    }

    public loadRelated() {
        if (!this.aclAccess()) return;
        this.relatedmodels.getData();
    }

    public ngOnInit() {
        this.fieldset = this.componentconfig.fieldset;
        this.listfields = this.metadata.getFieldSetFields(this.fieldset);
        this.module = this.componentconfig.object;

        this.relatedmodels.relatedModule = this.componentconfig.object;

        if (this.componentconfig.link) this.relatedmodels.linkName = this.componentconfig.link;

        if ( this.componentconfig.sequencefield ) {
            this.relatedmodels.sequencefield = this.componentconfig.sequencefield;
        } else if ( this.relatedmodels._linkName && this.model.fields[this.relatedmodels._linkName] && this.model.fields[this.relatedmodels._linkName].sequence_field ) {
            this.relatedmodels.sequencefield = this.model.fields[this.relatedmodels._linkName].sequence_field;
        }

        if (this.componentconfig.items) this.relatedmodels.loaditems = this.componentconfig.items;

        if (this.componentconfig.modulefilter) this.relatedmodels.modulefilter = this.componentconfig.modulefilter;

        /*
        if(this.componentconfig.editable) {
            this.editable = this.componentconfig.editable;
        }
        */

        if (this.componentconfig.editcomponentset) this.editcomponentset = this.componentconfig.editcomponentset;

        if (this.componentconfig.sortfield) {
            this.relatedmodels.sort.sortfield = this.componentconfig.sortfield;
            this.relatedmodels.sort.sortdirection = this.componentconfig.sortdirection ? this.componentconfig.sortdirection : "ASC";
        }

    }

    get editable() {
        try {
            return this.componentconfig.editable && this.model.data.acl.edit;
        } catch (e) {
            return false;
        }
    }

    get hideactions() {
        return this.componentconfig.hideactions;
    }

    public ngAfterViewInit() {
        this.loadRelated();
    }

    public ngOnDestroy() {
        // need to stop all subscrptions on my service
        this.relatedmodels.stopSubscriptions();
    }

    public addSelectedItems(items) {
        this.relatedmodels.addItems(items);
    }
}
