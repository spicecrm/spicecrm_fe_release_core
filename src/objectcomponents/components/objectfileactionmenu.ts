/*
SpiceUI 1.1.0

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, ElementRef, Input, Renderer} from "@angular/core";
import {metadata} from "../../services/metadata.service";
import {language} from "../../services/language.service";
import {modelattachments} from "../../services/modelattachments.service";
import {popup} from "../../services/popup.service";
import {broadcast} from "../../services/broadcast.service";

@Component({
    selector: "object-file-action-menu",
    templateUrl: "./src/objectcomponents/templates/objectfileactionmenu.html",
    providers: [popup]
})
export class ObjectFileActionMenu {

    @Input() private buttonsize: string = "";
    @Input() private fileid: string = "";
    @Input() private filename: string = "";
    private isOpen: boolean = false;
    private clickListener: any;

    constructor(private broadcast: broadcast, private modelattachments: modelattachments, private language: language, private elementRef: ElementRef, private popup: popup, private renderer: Renderer) {
        popup.closePopup$.subscribe(close => {
            this.isOpen = false;
        });
    }

    private toggleOpen() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.clickListener = this.renderer.listenGlobal("document", "click", (event) => this.onClick(event));
        } else if (this.clickListener) {
            this.clickListener();
        }
    }

    public onClick(event: MouseEvent): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.isOpen = false;
        }
    }

    private getButtonSizeClass(){
        if(this.buttonsize !== "") {
            return "slds-button--icon-" + this.buttonsize;
        }
    }

    private getDropdownLocationClass(){
        let rect = this.elementRef.nativeElement.getBoundingClientRect();
        if(window.innerHeight - rect.bottom < 100) {
            return "slds-dropdown--bottom";
        }
    }

    private deleteFile() {
        this.isOpen = false;
        this.modelattachments.deleteAttachment(this.fileid);
    }

    private downloadFile() {
        this.isOpen = false;
        this.modelattachments.downloadAttachment(this.fileid, this.filename);
    }
    private openFile() {
        this.isOpen = false;
        this.modelattachments.openAttachment(this.fileid);
    }
}
