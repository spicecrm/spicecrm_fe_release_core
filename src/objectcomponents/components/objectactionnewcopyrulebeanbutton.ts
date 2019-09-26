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
import {Component, Directive, Inject, OnInit, ViewChild} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {model} from "../../services/model.service";
import {language} from "../../services/language.service";


@Directive({
    selector: "object-action-new-copy-rule-bean-button-model-helper",
    providers: [model]
})
export class ObjectActionNewCopyRuleBeanButtonModelHelper {
    constructor(public model: model) {}
}


@Component({
    selector: "object-action-new-copy-rule-bean-button",
    templateUrl: "./src/objectcomponents/templates/objectactionnewcopyrulebeanbutton.html",
})
// actionconfig required! Example: '{ "module": "Calls", "label": "LBL_ADD_CALL" }'
export class ObjectActionNewCopyRuleBeanButton implements OnInit {

    // To provide a new model, we need a child component!
    @ViewChild(ObjectActionNewCopyRuleBeanButtonModelHelper, {static: true}) private child;

    public parent: any = {};
    public disabled: boolean = true;
    public actionconfig: any = {};

    constructor(private language: language, private metadata: metadata, private model: model) {

    }

    public ngOnInit() {
        // check acl
        if (this.actionconfig.module && this.metadata.checkModuleAcl(this.actionconfig.module, "create")) {
            this.disabled = false;
        }
    }

    public execute() {
        // Set the module of the new model and open a modal with copy rules
        this.child.model.module = this.actionconfig.module;
        this.child.model.addModel("", this.model);
    }
}



