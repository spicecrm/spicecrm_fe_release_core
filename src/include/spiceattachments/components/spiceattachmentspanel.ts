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
 * @module ModuleSpiceAttachments
 */
import {
    Component,
    OnInit,
    Input,
    NgZone,
    Output,
    EventEmitter,
    ViewChild,
    ViewContainerRef,
    Renderer2,
    Injector,
    Optional,
    SkipSelf
} from '@angular/core';
import {metadata} from "../../../services/metadata.service";
import {model} from "../../../services/model.service";
import {modal} from "../../../services/modal.service";
import {language} from "../../../services/language.service";
import {toast} from "../../../services/toast.service";
import {modelattachments} from "../../../services/modelattachments.service";

/**
 * @ignore
 */
declare var moment: any;

/**
 * displays a quicknote that is read in teh stream
 */
@Component({
    templateUrl: './src/include/spiceattachments/templates/spiceattachmentspanel.html',
    providers: [modelattachments],
})
export class SpiceAttachmentsPanel {


    /**
     * the fileupload elelent
     */
    @ViewChild("fileupload", {read: ViewContainerRef, static: false}) private fileupload: ViewContainerRef;

    /**
     * emits when the attachments are loaded
     */
    @Output() private attachmentsLoaded: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * @ignore
     *
     * passed in component config
     */
    private componentconfig: any = {};

    /**
     * contructor sets the module and id for the laoder
     * @param modelattachments
     * @param parentmodelattachments
     * @param language
     * @param model
     * @param renderer
     * @param toast
     * @param metadata
     * @param modalservice
     */
    constructor(private _modelattachments: modelattachments, @Optional() @SkipSelf() private parentmodelattachments: modelattachments, private language: language, private modal: modal, private model: model, private renderer: Renderer2, private toast: toast, private metadata: metadata, private modalservice: modal, private injector: Injector) {
        this._modelattachments.module = this.model.module;
        this._modelattachments.id = this.model.id;
    }

    /**
     * returns the proper modelattachments instance .. wither from the component or provided by the parent
     */
    get modelattachments(): modelattachments {
        return this.parentmodelattachments && this.parentmodelattachments.module == this.model.module && this.parentmodelattachments.id == this.model.id ? this.parentmodelattachments : this._modelattachments;
    }

    /**
     * returns if the model is editing
     */
    get editing() {
        return this.model.isEditing;
    }

    /**
     * initializes the model attachments service and loads the attachments
     */
    private loadFiles() {
        this.modelattachments.getAttachments().subscribe(loaded => {
            this.attachmentsLoaded.emit(true);
        });
    }

    /**
     * @ignore
     */
    public ngAfterViewInit() {
        if (!this.model.isNew) setTimeout(() => this.loadFiles(), 10);
    }

    /**
     * handler for the dragover event.- Checks if we only have files dragged over the div
     *
     * @param event
     */
    private preventdefault(event: any) {
        if ((event.dataTransfer.items.length >= 1 && this.hasOneItemsFile(event.dataTransfer.items)) || (event.dataTransfer.files.length > 0)) {
            event.preventDefault();
            event.stopPropagation();

            // ensure we are copying the element
            event.dataTransfer.dropEffect = 'copy';
        }
    }

    /**
     * helper to check if all elements of the drag over event are files
     *
     * @param items the items from the event
     */
    private hasOneItemsFile(items) {
        for (let item of items) {
            if (item.kind == 'file') {
                return true;
            }
        }

        return false;
    }

    /**
     * handle the drop and upload the files
     *
     * @param event the drop event
     */
    private onDrop(event: any) {
        this.preventdefault(event);
        let files = event.dataTransfer.files;
        if (files && files.length >= 1) {
            this.doupload(files);
        }
    }

    /**
     * handle the drop and upload the files
     *
     * @param event the drop event
     */
    private fileDrop(files) {
        if (files && files.length >= 1) {
            this.doupload(files);
        }
    }

    /**
     * triggers a file upload. From the select button firing the hidden file upload input
     */
    private selectFile() {
        let event = new MouseEvent("click", {bubbles: true});
        this.fileupload.element.nativeElement.dispatchEvent(event);
    }

    /**
     * does the upload oif the files
     */
    private uploadFile() {
        let files = this.fileupload.element.nativeElement.files;
        this.doupload(files);
    }

    /**
     * the upload itself
     *
     * @param files an array with files
     */
    private doupload(files) {
        this.modelattachments.uploadAttachmentsBase64(files);
    }

    /**
     * opens the add Image modal
     */
    private addImage() {
        this.modal.openModal('SpiceAttachmentAddImageModal', true, this.injector);
    }

}
