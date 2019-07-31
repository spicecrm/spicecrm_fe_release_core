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
 * @module ModuleSpicePath
 */

import {Component, Input, OnInit} from '@angular/core';
import {model} from '../../../services/model.service';
import {relatedmodels} from '../../../services/relatedmodels.service';
import {view} from '../../../services/view.service';
import {language} from '../../../services/language.service';
import {metadata} from '../../../services/metadata.service';

@Component({
    selector: 'spice-path-related-list-tile',
    templateUrl: './src/include/spicepath/templates/spicepathrelatedlisttile.html',
    providers: [model, view]
})
export class SpicePathRelatedListTile implements OnInit {

    @Input() private module: string = '';
    @Input() private data: any = {};
    @Input() private fieldset: string = '';

    private componentconfig: any = {};

    private addActions = [{action: 'remove', name: 'Remove'}];

    constructor(private model: model, private relatedmodels: relatedmodels, private view: view, private language: language, private metadata: metadata) {

    }

    public ngOnInit() {
        this.model.module = this.module;
        this.model.id = this.data.id;
        this.model.data = this.data;

        this.componentconfig = this.metadata.getComponentConfig('SpicePathRelatedListTile', this.module);
    }

    get componentSetLeft() {
        return this.componentconfig.left;
    }

    get componentSetRight() {
        return this.componentconfig.right;
    }

    private getFields() {
        return this.metadata.getFieldSetFields(this.fieldset)
    }

    private navgiateDetail() {
        this.model.goDetail();
    }

    private handleAction(event) {
        switch (event) {
            case 'remove':
                this.relatedmodels.deleteItem(this.model.id);
                break;
        }
    }
}