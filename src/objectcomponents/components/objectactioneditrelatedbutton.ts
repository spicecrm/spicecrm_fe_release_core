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
import {Component, Directive, OnInit, ViewChild} from '@angular/core';
import {metadata} from '../../services/metadata.service';
import {model} from '../../services/model.service';
import {language} from '../../services/language.service';
import {relatedmodels} from "../../services/relatedmodels.service";


/**
 * a helper component used in ObjectActionNewCopyRuleBeanButton
 *
 * does nothing but provide a model
 */
@Directive({
    selector: "object-action-edit-related-button-helper",
    providers: [model]
})
export class ObjectActionEditRelatedButtonHelper {
    constructor(public model: model) {
    }
}

@Component({
    selector: 'object-action-edit-related-button',
    templateUrl: './src/objectcomponents/templates/objectactioneditrelatedbutton.html'
})
export class ObjectActionEditRelatedButton implements OnInit {

    /**
     * this is a helper so we have a subcomponent that can provide a new model
     *
     * this model is detected via teh component and then addressed
     */
    @ViewChild(ObjectActionEditRelatedButtonHelper, {static: true}) private child;

    public disabled: boolean = true;

    /**
     * the action config from the actionset
     */
    public actionconfig: any = {};

    constructor(
        private language: language,
        private metadata: metadata,
        private model: model,
    ) {

    }

    public ngOnInit() {
        this.handleDisabled(this.model.isEditing ? 'edit' : 'display');
        this.model.mode$.subscribe(mode => {
            this.handleDisabled(mode);
        });

        this.model.data$.subscribe(data => {
            this.handleDisabled(this.model.isEditing ? 'edit' : 'display');
        });
    }

    public execute() {

        // Set the module of the new model and open a modal with copy rules
        this.child.model.module = this.actionconfig.module;
        this.child.model.id = this.model.getFieldValue(this.actionconfig.parent_field);
        this.child.model.getData(false);

        this.child.model.edit();
    }

    private handleDisabled(mode) {
        if (this.model.data.acl && !this.model.checkAccess('edit')) {

            this.disabled = true;
            return;
        }
        this.disabled = mode == 'edit' ? true : false;
    }

}
