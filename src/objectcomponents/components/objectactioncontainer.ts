/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, Input, Output, EventEmitter, AfterViewInit, ViewChild, ViewContainerRef, Optional} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";
import {broadcast} from "../../services/broadcast.service";
import {model} from "../../services/model.service";

@Component({
    selector: "object-action-container",
    templateUrl: "./src/objectcomponents/templates/objectactioncontainer.html"
})
export class ObjectActionContainer implements AfterViewInit {
    @ViewChild("actioncontainer", {read: ViewContainerRef}) private actioncontainer: ViewContainerRef;

    @Input() private actionset: string = "";
    @Output() private actionemitter: EventEmitter<any> = new EventEmitter<any>();

    constructor(private language: language, private metadata: metadata, private model: model) {
    }

    public ngAfterViewInit() {
        let actionitems = this.metadata.getActionSetItems(this.actionset);
        if (actionitems) {
            for (let actionitem of actionitems) {
                if (actionitem.action) {
                    switch (actionitem.action) {
                        case "NEW":
                            if (this.metadata.checkModuleAcl(this.model.module, "create")) {
                                this.metadata.addComponent("ObjectActionNewButton", this.actioncontainer);
                            }
                            break;
                        case "DUPLICATE":
                            if (this.metadata.checkModuleAcl(this.model.module, "create")) {
                                this.metadata.addComponent("ObjectActionDuplicateButton", this.actioncontainer).subscribe(comp => {
                                    comp.instance.parent = this.model;
                                });
                            }
                            break;
                        case "NEWRELATED":
                            this.metadata.addComponent("ObjectActionNewrelatedButton", this.actioncontainer).subscribe(comp => {
                                comp.instance.parent = this.model;
                            });
                            break;
                        case "EDIT":
                            this.metadata.addComponent("ObjectActionEditButton", this.actioncontainer);
                            break;
                        case "DELETE":
                            this.metadata.addComponent("ObjectActionDeleteButton", this.actioncontainer);
                            break;
                        case "IMPORT":
                            if (this.metadata.checkModuleAcl(this.model.module, "import")) {
                                this.metadata.addComponent("ObjectActionImportButton", this.actioncontainer);
                            }
                            break;
                        case "AUDIT":
                            this.metadata.addComponent("ObjectActionAuditlogButton", this.actioncontainer);
                            break;
                        case "MAIL":
                            this.metadata.addComponent("ObjectActionBeanToMailButton", this.actioncontainer);
                            break;
                        case "SELECT":
                            this.metadata.addComponent("ObjectActionSelectButton", this.actioncontainer).subscribe(componentRef => {
                                componentRef.instance.actionconfig = actionitem.actionconfig;
                            });
                            break;
                    }
                } else {
                    this.metadata.addComponent(actionitem.component, this.actioncontainer).subscribe(buttonref => {
                        buttonref.instance.actionconfig = actionitem.actionconfig;
                        if (buttonref.instance.actionemitter) {
                            buttonref.instance.actionemitter.subscribe(event => {
                                this.actionemitter.emit(event);
                            });
                        }
                    });
                }
            }
        }
    }
}