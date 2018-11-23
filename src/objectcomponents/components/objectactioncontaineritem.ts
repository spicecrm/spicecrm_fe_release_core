/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {
    Component,
    Input,
    Output,
    EventEmitter,
    AfterViewInit,
    ViewChild,
    ViewContainerRef,
    OnInit,
    HostListener,
    NgZone
} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";
import {broadcast} from "../../services/broadcast.service";
import {model} from "../../services/model.service";

@Component({
    selector: "object-action-container-item",
    templateUrl: "./src/objectcomponents/templates/objectactioncontaineritem.html"
})
export class ObjectActionContainerItem implements AfterViewInit {
    @ViewChild("actioncontainer", {read: ViewContainerRef}) private actioncontainer: ViewContainerRef;

    @Input() public actionitem: any;
    @Output() public actionemitter: EventEmitter<any> = new EventEmitter<any>();

    private componentref: any;
    private standardActions = {
        NEW: "ObjectActionNewButton",
        DUPLICATE: "ObjectActionDuplicateButton",
        NEWRELATED: "ObjectActionNewrelatedButton",
        EDIT: "ObjectActionEditButton",
        DELETE: "ObjectActionDeleteButton",
        AUDIT: "ObjectActionAuditlogButton",
        IMPORT: "ObjectActionImportButton",
        MAIL: "ObjectActionBeanToMailButton",
        PRINT: "ObjectActionOutputBeanButton",
        SELECT: "ObjectActionSelectButton"
    }
    private stable: boolean = false;
    private stableSub: any;

    constructor(private language: language, private metadata: metadata, private model: model, private ngZone: NgZone) {
    }

    get id() {
        return this.actionitem.id;
    }

    get disabled() {
        if (this.stable && this.componentref) {
            return this.componentref.instance.disabled ? true : false;
        } else {
            return true;
        }
    }

    public ngAfterViewInit() {
        this.metadata.addComponent(this.actionitem.action ? this.standardActions[this.actionitem.action] : this.actionitem.component, this.actioncontainer).subscribe(componentref => {
            componentref.instance.parent = this.model;
            componentref.instance.actionconfig = this.actionitem.actionconfig;
            if (componentref.instance.actionemitter) {
                componentref.instance.actionemitter.subscribe(event => {
                    this.actionemitter.emit(event);
                });
            }

            // add the componentn and handle visibility
            this.componentref = componentref;
        });


        // ugly workaround to detect once the first stable
        // change detection run is done and then start returning the poroper disabled valued
        this.stableSub = this.ngZone.onStable.subscribe(stable => {
            this.stable = true;
            this.stableSub.unsubscribe();
        });
    }

    public execute() {
        if (this.componentref && this.componentref.instance.execute) this.componentref.instance.execute();
    }
}
