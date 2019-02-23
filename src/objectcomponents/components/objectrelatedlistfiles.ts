/*
SpiceUI 2018.10.001

Copyright (c) 2016-present, aac services.k.s - All rights reserved.
Redistribution and use in source and binary forms, without modification, are permitted provided that the following conditions are met:
- Redistributions of source code must retain this copyright and license notice, this list of conditions and the following disclaimer.
- Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
- If used the SpiceCRM Logo needs to be displayed in the upper left corner of the screen in a minimum dimension of 31x31 pixels and be clearly visible, the icon needs to provide a link to http://www.spicecrm.io
THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

*/

import {Component, AfterViewInit, OnInit, ViewChild, ViewContainerRef, Renderer} from "@angular/core";
import {model} from "../../services/model.service";
import {language} from "../../services/language.service";
import {toast} from "../../services/toast.service";
import {modelattachments} from "../../services/modelattachments.service";
import {metadata} from "../../services/metadata.service";
import {footer} from "../../services/footer.service";
import {modal} from "../../services/modal.service";

@Component({
    selector: "object-relatedlist-files",
    templateUrl: "./src/objectcomponents/templates/objectrelatedlistfiles.html",
    providers: [modelattachments],
    host: {
        "(drop)": "this.onDrop($event)",
        "(dragover)": "this.preventdefault($event)"
    }
})
export class ObjectRelatedlistFiles implements AfterViewInit {

    @ViewChild("fileupload", {read: ViewContainerRef}) private fileupload: ViewContainerRef;

    private componentconfig: any = {};
    private displayitems: number = 5;
    private theFile: string = "";
    private theProgress: number = 0;
    private showUploadModal: boolean = false;
    private isopen: boolean = true;

    constructor(private modelattachments: modelattachments, private language: language, private model: model, private renderer: Renderer, private toast: toast, private footer: footer, private metadata: metadata, private modalservice: modal) {
        this.modelattachments.module = this.model.module;
        this.modelattachments.id = this.model.id;
    }

    private loadFiles() {
        this.modelattachments.getAttachments();
    }

    public ngAfterViewInit() {
        setTimeout(()=> this.loadFiles(), 10);
    }

    private toggleOpen() {
        this.isopen = !this.isopen;
    }

    get iconStyle() {
        if (!this.isopen) {
            return {
                transform: 'scale(1, -1)'
            };
        } else {
            return {};
        }
    }

    private preventdefault(event: any) {
        if ((event.dataTransfer.items.length >= 1 && this.allItemsFile(event.dataTransfer.items)) || (event.dataTransfer.files.length > 0)) {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    private allItemsFile(items) {
        for (let item of items) {
            if (item.kind != 'file') {
                return false;
            }
        }

        return true;
    }

    private onDrop(event: any) {
        this.preventdefault(event);
        let files = event.dataTransfer.files;
        if (files && files.length >= 1) {
            this.doupload(files);
        }
    }


    private canViewAll() {
        return true;
    }

    private selectFile() {
        let event = new MouseEvent("click", {bubbles: true});
        this.renderer.invokeElementMethod(this.fileupload.element.nativeElement, "dispatchEvent", [event]);
    }

    private uploadFile() {
        let files = this.fileupload.element.nativeElement.files;
        this.doupload(files);
    }

    private doupload(files) {
        this.modelattachments.uploadAttachmentsBase64(files);
    }

    private closeUploadPopup() {
        this.showUploadModal = false;
    }

    private getBarStyle() {
        return {
            width: this.theProgress + "%"
        };
    }

    private takeFoto() {
        this.modalservice.openModal("SystemCaptureImage").subscribe(modal => {
            modal.instance.model = this.model;
            modal.instance.response$.subscribe(file => {
                this.modelattachments.files.push(file);
            });
        });
    }
}
