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
    ViewChildren,
    QueryList,
    OnInit,
    ChangeDetectorRef, AfterViewInit, AfterContentInit, PipeTransform, Pipe
} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";
import {model} from "../../services/model.service";
import {ObjectActionContainerItem} from "./objectactioncontaineritem";
import {disableBindings} from "@angular/core/src/render3";


@Component({
    selector: "object-action-container",
    templateUrl: "./src/objectcomponents/templates/objectactioncontainer.html"
})
export class ObjectActionContainer implements OnInit {
    @ViewChildren(ObjectActionContainerItem) private actionitemlist: QueryList<ObjectActionContainerItem>

    @Input() private actionset: string = "";
    @Input() private mainactionitems: any[] = [];
    @Input() private addactionitems: any[] = [];
    @Output() public actionemitter: EventEmitter<any> = new EventEmitter<any>();

    private isOpen: boolean = false;

    constructor(private language: language, private metadata: metadata, private model: model, private changeDetectorRef: ChangeDetectorRef) {
    }

    public ngOnInit() {
        let actionitems = this.metadata.getActionSetItems(this.actionset);
        let initial = true;
        for (let actionitem of actionitems) {
            if (initial) {
                this.mainactionitems.push({
                    disabled: true,
                    id: actionitem.id,
                    sequence: actionitem.sequence,
                    action: actionitem.action,
                    component: actionitem.component,
                    actionconfig: actionitem.actionconfig
                });
                initial = false;
            } else {
                this.addactionitems.push({
                    disabled: true,
                    id: actionitem.id,
                    sequence: actionitem.sequence,
                    action: actionitem.action,
                    component: actionitem.component,
                    actionconfig: actionitem.actionconfig
                });
            }
        }
    }

    private toggleOpen() {
        this.isOpen = !this.isOpen;
    }

    get opendisabled() {
        let disabled = true;
        this.addactionitems.some(actionitem => {
            if (this.isDisabled(actionitem.id) === false) {
                disabled = false;
                return true;
            }
        })
        return disabled;
    }

    get hasAddItems() {
        return this.addactionitems.length > 0;
    }

    private disabledhandler(id, disabled) {
        setTimeout(() => {
            this.mainactionitems.some((actionitem: any) => {
                if (actionitem.id == id) {
                    actionitem.disabled = disabled;
                    return true;
                }
            });

            this.addactionitems.some((actionitem: any) => {
                if (actionitem.id == id) {
                    actionitem.disabled = disabled;
                    return true;
                }
            });
        });
    }

    private isDisabled(actionid) {
        let disabled = true;
        if (this.actionitemlist) {
            this.actionitemlist.some((actionitem: any) => {
                if (actionitem.id == actionid) {
                    disabled = actionitem.disabled ? true : false;
                    return true;
                }
            });
        }
        return disabled;
    }

    private propagateclick(actionid) {
        this.actionitemlist.some(actionitem => {
            if (actionitem.id == actionid) {
                if (!actionitem.disabled) actionitem.execute();
                return true;
            }
        });
    }

    private emitaction(event) {
        this.actionemitter.emit(event);
    }
}
